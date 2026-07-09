package com.screenguardianmobile

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.max
import kotlin.math.min

object DevicePolicySyncHelper {

    private const val TAG = "DevicePolicySync"
    private const val MAX_MINUTES_PER_DAY = 24 * 60

    /**
     * Applies policy data from the backend payload into PolicyStore.
     *
     * Shared by:
     * - HTTP policy sync
     * - Socket policy updates
     *
     * Safety:
     * If the payload contains deviceId and it does not match this device,
     * the policy is ignored.
     */
    fun applyPolicyData(context: Context, data: JSONObject) {
        val currentDeviceId = PolicyStore.getDeviceId(context)
        val payloadDeviceId = data.optString("deviceId", "")

        if (
            !currentDeviceId.isNullOrBlank() &&
            payloadDeviceId.isNotBlank() &&
            payloadDeviceId != currentDeviceId
        ) {
            Log.d(
                TAG,
                "Ignoring policy for another device. payloadDeviceId=$payloadDeviceId currentDeviceId=$currentDeviceId"
            )
            return
        }

        val screenTime = data.optJSONObject("screenTime") ?: JSONObject()
        val lockState = data.optJSONObject("lockState") ?: JSONObject()

        val isLocked = data.optBoolean("isLocked", false)
        val isLimitEnabled = screenTime.optBoolean("isLimitEnabled", false)

        val limitMode = screenTime.optString(
            "limitMode",
            PolicyStore.LIMIT_MODE_NONE
        )

        val manualLockEnabled = lockState.optBoolean("manualLockEnabled", false)
        val dailyLimitLockActive = lockState.optBoolean("dailyLimitLockActive", false)
        val weeklyLimitLockActive = lockState.optBoolean("weeklyLimitLockActive", false)
        val scheduleLockActive = lockState.optBoolean("scheduleLockActive", false)

        val dailyLimitMinutesRaw = screenTime.optInt("dailyLimitMinutes", 0)
        val dailyLimitMinutes = max(0, min(dailyLimitMinutesRaw, MAX_MINUTES_PER_DAY))

        val extraMinutesRaw = screenTime.optInt("extraMinutesToday", 0)
        val extraMinutesToday = max(0, min(extraMinutesRaw, MAX_MINUTES_PER_DAY))

        val weeklyLimitMinutesRaw = screenTime.optInt("weeklyLimitMinutes", 0)
        val weeklyLimitMinutes = max(0, weeklyLimitMinutesRaw)

        val usedWeekMinutesRaw = screenTime.optInt("usedWeekMinutes", 0)
        val usedWeekMinutes = max(0, usedWeekMinutesRaw)

        val weeklySchedule = screenTime.optJSONArray("weeklySchedule") ?: JSONArray()

        val blockedApps = mutableListOf<String>()
        val applications = data.optJSONArray("applications") ?: JSONArray()

        for (i in 0 until applications.length()) {
            val app = applications.optJSONObject(i) ?: continue
            val packageName = app.optString("packageName", "")
            val isBlocked = app.optBoolean("isBlocked", false)

            if (packageName.isNotBlank() && isBlocked) {
                blockedApps.add(packageName)
            }
        }

        PolicyStore.setServerLocked(context, isLocked)

        PolicyStore.setManualLockEnabled(context, manualLockEnabled)
        PolicyStore.setDailyLimitLockActive(context, dailyLimitLockActive)
        PolicyStore.setWeeklyLimitLockActive(context, weeklyLimitLockActive)
        PolicyStore.setScheduleLockActive(context, scheduleLockActive)

        PolicyStore.setLimitEnabled(context, isLimitEnabled)
        PolicyStore.setLimitMode(context, limitMode)
        PolicyStore.setDailyLimit(context, dailyLimitMinutes)
        PolicyStore.setExtraMinutes(context, extraMinutesToday)
        PolicyStore.setWeeklyLimit(context, weeklyLimitMinutes)
        PolicyStore.setUsedWeek(context, usedWeekMinutes)
        PolicyStore.setWeeklySchedule(context, weeklySchedule)

        PolicyStore.setBlockedApps(context, blockedApps)

        val shouldLock = PolicyStore.shouldLockDevice(context)
        val blockReason = PolicyStore.resolveBlockReason(context)

        if (shouldLock && blockReason.isNotBlank()) {
            PolicyStore.setBlockReason(context, blockReason)
        } else {
            PolicyStore.clearBlockReason(context)
        }

        Log.d(
            TAG,
            "Policy applied: deviceId=$payloadDeviceId locked=$isLocked limitEnabled=$isLimitEnabled mode=$limitMode daily=$dailyLimitMinutes extra=$extraMinutesToday weekly=$weeklyLimitMinutes usedWeek=$usedWeekMinutes scheduleDays=${weeklySchedule.length()} manualLock=$manualLockEnabled dailyLock=$dailyLimitLockActive weeklyLock=$weeklyLimitLockActive scheduleLock=$scheduleLockActive blockedApps=${blockedApps.size}"
        )
    }

    fun fetchAndSavePolicy(
        context: Context,
        onFinished: (() -> Unit)? = null
    ) {
        val baseUrl = PolicyStore.getHeartbeatBaseUrl(context)
        val deviceId = PolicyStore.getDeviceId(context)
        val token = PolicyStore.getHeartbeatToken(context)

        if (baseUrl.isNullOrBlank() || deviceId.isNullOrBlank() || token.isNullOrBlank()) {
            finishOnMain(onFinished)
            return
        }

        Thread {
            var connection: HttpURLConnection? = null

            try {
                val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/policy")
                connection = url.openConnection() as HttpURLConnection

                connection.requestMethod = "GET"
                connection.setRequestProperty("Authorization", "Bearer $token")
                connection.setRequestProperty("Content-Type", "application/json")
                connection.connectTimeout = 10000
                connection.readTimeout = 10000

                val responseCode = connection.responseCode
                val responseBody = readResponse(connection)

                if (responseCode !in 200..299) {
                    if (isPermanentDeviceRemoval(responseCode, responseBody)) {
                        Log.w(
                            TAG,
                            "Policy fetch indicates device is no longer managed. code=$responseCode body=$responseBody"
                        )
                        clearLocalManagedState(context)
                        return@Thread
                    }

                    Log.e(
                        TAG,
                        "Policy fetch failed temporarily. code=$responseCode body=$responseBody"
                    )
                    return@Thread
                }

                val root = JSONObject(responseBody)
                val data = root.optJSONObject("data") ?: JSONObject()

                applyPolicyData(context, data)

            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch policy", e)
            } finally {
                connection?.disconnect()
                finishOnMain(onFinished)
            }
        }.start()
    }

    private fun isPermanentDeviceRemoval(responseCode: Int, responseBody: String): Boolean {
        if (responseCode != 400 && responseCode != 404) {
            return false
        }

        return try {
            val root = JSONObject(responseBody)
            val error = root.optJSONObject("error")
            val errorCode = error?.optString("code") ?: ""

            errorCode == "DEVICE_NOT_FOUND" ||
                errorCode == "DEVICE_NOT_ACTIVE"
        } catch (_: Exception) {
            false
        }
    }

    private fun clearLocalManagedState(context: Context) {
        PolicyStore.clearAll(context)
        DeviceServerSyncHelper.clearSessionCache()

        Log.w(TAG, "Cleared local managed state because device is no longer managed by server")
    }

    private fun finishOnMain(onFinished: (() -> Unit)?) {
        if (onFinished == null) return

        if (Looper.myLooper() == Looper.getMainLooper()) {
            onFinished.invoke()
        } else {
            Handler(Looper.getMainLooper()).post {
                onFinished.invoke()
            }
        }
    }

    private fun readResponse(connection: HttpURLConnection): String {
        return try {
            val stream = if (connection.responseCode in 200..299) {
                connection.inputStream
            } else {
                connection.errorStream
            }

            stream?.let {
                BufferedReader(InputStreamReader(it)).use { reader ->
                    reader.readText()
                }
            } ?: ""
        } catch (_: Exception) {
            "Failed to read response"
        }
    }
}