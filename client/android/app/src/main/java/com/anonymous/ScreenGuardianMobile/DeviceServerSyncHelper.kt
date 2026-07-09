package com.screenguardianmobile

import android.content.Context
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import org.json.JSONObject

/**
 * DeviceServerSyncHelper
 *
 * Sends device state updates to the backend server.
 */
object DeviceServerSyncHelper {

    private const val TAG = "DeviceServerSync"
    private const val MAX_MINUTES_PER_DAY = 24 * 60
    private const val LOW_TIME_LOCAL_DEBOUNCE_MS = 60 * 60 * 1000L

    @Volatile
    private var lastAppUsageSyncAt: Long = 0L

    @Volatile
    private var lastLowTimeAlertSentAt: Long = 0L

    @Volatile
    private var lastSentUsageMinutes: Int? = null

    /**
     * PATCH /api/v1/devices/{deviceId}/heartbeat
     */
    fun sendHeartbeat(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return

            val usageAccessEnabled = UsageStatsHelper.hasUsageAccess(context)
            val accessibilityEnabled =
                ScreenGuardianAccessibilityService.isServiceEnabled(context)

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/heartbeat")
                    connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "accessibilityEnabled": $accessibilityEnabled,
                      "usageAccessEnabled": $usageAccessEnabled
                    }
                    """.trimIndent()

                    connection.outputStream.use {
                        it.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(TAG, "Heartbeat responseCode=$responseCode body=$responseBody")

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send heartbeat", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "Heartbeat error", e)
        }
    }

    /**
     * PATCH /api/v1/devices/{deviceId}/usage
     */
    fun sendUsage(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return

            val usedTodayMinutesRaw = PolicyStore.getUsedToday(context)
            val usedTodayMinutes = usedTodayMinutesRaw.coerceIn(0, MAX_MINUTES_PER_DAY)

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/usage")
                    connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "usedTodayMinutes": $usedTodayMinutes
                    }
                    """.trimIndent()

                    connection.outputStream.use {
                        it.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(
                        TAG,
                        "Usage responseCode=$responseCode used=$usedTodayMinutes body=$responseBody"
                    )

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send usage", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "Usage error", e)
        }
    }

    fun sendUsageIfChanged(context: Context, minDeltaMinutes: Int = 1) {
        try {
            val current = PolicyStore.getUsedToday(context)
            val last = lastSentUsageMinutes

            val limitEnabled = PolicyStore.isLimitEnabled(context)
            val remaining = PolicyStore.getRemainingMinutes(context)

            val usageChangedEnough =
                last == null || kotlin.math.abs(current - last) >= minDeltaMinutes

            val nearLimit =
                limitEnabled && remaining in 0..5

            if (!usageChangedEnough && !nearLimit) {
                return
            }

            lastSentUsageMinutes = current
            sendUsage(context)

        } catch (e: Exception) {
            Log.e(TAG, "sendUsageIfChanged error", e)
        }
    }

    fun sendAppUsage(context: Context) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return

            val usageStats = UsageStatsHelper.getTodayUsageByAppJson(context)

            if (usageStats.length() == 0) {
                Log.d(TAG, "sendAppUsage skipped: no app usage stats")
                return
            }

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL("${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/apps/usage")
                    connection = url.openConnection() as HttpURLConnection

                    connection.requestMethod = "PATCH"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = JSONObject().apply {
                        put("usageStats", usageStats)
                    }.toString()

                    connection.outputStream.use {
                        it.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(
                        TAG,
                        "App usage responseCode=$responseCode count=${usageStats.length()} body=$responseBody"
                    )
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send app usage", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "sendAppUsage error", e)
        }
    }

    fun sendAppUsageIfIntervalPassed(
        context: Context,
        intervalMs: Long = 5 * 60 * 1000L
    ) {
        try {
            val now = System.currentTimeMillis()

            if (now - lastAppUsageSyncAt < intervalMs) {
                return
            }

            lastAppUsageSyncAt = now
            sendAppUsage(context)

        } catch (e: Exception) {
            Log.e(TAG, "sendAppUsageIfIntervalPassed error", e)
        }
    }

    fun reportBlockedAppAttempt(context: Context, packageName: String) {
        try {
            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val deviceId = PolicyStore.getDeviceId(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return

            val encodedPackageName = URLEncoder.encode(packageName, "UTF-8")

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL(
                        "${baseUrl.trimEnd('/')}/api/v1/devices/$deviceId/apps/$encodedPackageName/block-attempt"
                    )

                    connection = url.openConnection() as HttpURLConnection
                    connection.requestMethod = "POST"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "packageName": "$packageName"
                    }
                    """.trimIndent()

                    connection.outputStream.use {
                        it.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(
                        TAG,
                        "Blocked app attempt responseCode=$responseCode package=$packageName body=$responseBody"
                    )
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to report blocked app attempt", e)
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "reportBlockedAppAttempt error", e)
        }
    }

    fun clearSessionCache() {
        lastSentUsageMinutes = null
        lastAppUsageSyncAt = 0L
        lastLowTimeAlertSentAt = 0L
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

    fun reportLowTimeIfNeeded(context: Context, remainingMinutes: Int) {
        try {
            if (!PolicyStore.isLimitEnabled(context)) return

            val mode = PolicyStore.getLimitMode(context)

            if (
                mode != PolicyStore.LIMIT_MODE_DAILY &&
                mode != PolicyStore.LIMIT_MODE_WEEKLY
            ) {
                return
            }

            if (remainingMinutes < 0 || remainingMinutes == Int.MAX_VALUE) {
                return
            }

            if (remainingMinutes > 5) {
                return
            }

            val now = System.currentTimeMillis()

            if (now - lastLowTimeAlertSentAt < LOW_TIME_LOCAL_DEBOUNCE_MS) {
                return
            }

            val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
            val token = PolicyStore.getHeartbeatToken(context) ?: return

            lastLowTimeAlertSentAt = now

            Thread {
                var connection: HttpURLConnection? = null

                try {
                    val url = URL(
                        "${baseUrl.trimEnd('/')}/api/v1/notifications/child/screen-time-ending"
                    )

                    connection = url.openConnection() as HttpURLConnection
                    connection.requestMethod = "POST"
                    connection.setRequestProperty("Content-Type", "application/json")
                    connection.setRequestProperty("Authorization", "Bearer $token")
                    connection.doOutput = true
                    connection.connectTimeout = 10000
                    connection.readTimeout = 10000

                    val body = """
                    {
                      "remainingMinutes": $remainingMinutes
                    }
                    """.trimIndent()

                    connection.outputStream.use {
                        it.write(body.toByteArray(Charsets.UTF_8))
                    }

                    val responseCode = connection.responseCode
                    val responseBody = readResponse(connection)

                    Log.d(
                        TAG,
                        "Low time alert responseCode=$responseCode remaining=$remainingMinutes body=$responseBody"
                    )

                    if (responseCode !in 200..299) {
                        lastLowTimeAlertSentAt = 0L
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to report low time alert", e)

                    lastLowTimeAlertSentAt = 0L
                } finally {
                    connection?.disconnect()
                }
            }.start()

        } catch (e: Exception) {
            Log.e(TAG, "reportLowTimeIfNeeded error", e)
        }
    }
}