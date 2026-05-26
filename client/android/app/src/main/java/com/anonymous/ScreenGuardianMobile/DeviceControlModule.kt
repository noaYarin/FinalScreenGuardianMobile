package com.screenguardianmobile

import android.Manifest
import android.content.ComponentName
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceControlModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceControl"
    }

    @ReactMethod
    fun lockNow(promise: Promise) {
        try {
            PolicyStore.setLockNow(reactApplicationContext, true)
            PolicyStore.setBlockReason(reactApplicationContext, "LOCK_NOW")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("LOCK_NOW_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun unlockNow(promise: Promise) {
        try {
            PolicyStore.setLockNow(reactApplicationContext, false)
            PolicyStore.setBlockReason(reactApplicationContext, "")
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UNLOCK_NOW_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun setDailyLimit(minutes: Int, promise: Promise) {
        try {
            PolicyStore.setDailyLimit(reactApplicationContext, minutes)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SET_DAILY_LIMIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun approveExtraMinutes(minutes: Int, promise: Promise) {
        try {
            PolicyStore.addExtraMinutes(reactApplicationContext, minutes)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("APPROVE_EXTRA_MINUTES_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun saveHeartbeatConfig(
        baseUrl: String,
        deviceId: String,
        childToken: String,
        childId: String,
        parentId: String,
        promise: Promise
    ) {
        try {
            PolicyStore.setHeartbeatBaseUrl(reactApplicationContext, baseUrl)
            PolicyStore.setHeartbeatDeviceId(reactApplicationContext, deviceId)
            PolicyStore.setHeartbeatToken(reactApplicationContext, childToken)
            PolicyStore.setChildId(reactApplicationContext, childId)
            PolicyStore.setParentId(reactApplicationContext, parentId)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SAVE_HEARTBEAT_CONFIG_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun syncPolicyNow(promise: Promise) {
        try {
            DevicePolicySyncHelper.fetchAndSavePolicy(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SYNC_POLICY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getRemainingTime(promise: Promise) {
        try {
            val result = Arguments.createMap().apply {
                putInt("dailyLimitMinutes", PolicyStore.getDailyLimit(reactApplicationContext))
                putInt("usedTodayMinutes", PolicyStore.getUsedToday(reactApplicationContext))
                putInt("extraMinutes", PolicyStore.getExtraMinutes(reactApplicationContext))
                putInt("remainingMinutes", PolicyStore.getRemainingMinutes(reactApplicationContext))
                putBoolean("lockNow", PolicyStore.isLockNow(reactApplicationContext))
                putBoolean("shouldLock", PolicyStore.shouldLockDevice(reactApplicationContext))
                putBoolean("limitEnabled", PolicyStore.isLimitEnabled(reactApplicationContext))
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_REMAINING_TIME_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getAndroidPermissionStates(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val usageAccess = UsageStatsHelper.hasUsageAccess(ctx)
            val accessibility = ScreenGuardianAccessibilityService.isServiceEnabled(ctx)

            val notifications = if (Build.VERSION.SDK_INT >= 33) {
                ContextCompat.checkSelfPermission(
                    ctx,
                    Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED
            } else {
                true
            }

            val lm =
                ctx.getSystemService(android.content.Context.LOCATION_SERVICE) as LocationManager

            val locationProvidersOn =
                lm.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                    lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)

            val fineGranted = ContextCompat.checkSelfPermission(
                ctx,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            val coarseGranted = ContextCompat.checkSelfPermission(
                ctx,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            val location = locationProvidersOn && (fineGranted || coarseGranted)

            val map = Arguments.createMap().apply {
                putBoolean("usageAccess", usageAccess)
                putBoolean("accessibility", accessibility)
                putBoolean("notifications", notifications)
                putBoolean("location", location)
            }

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("GET_ANDROID_PERMISSION_STATES_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAndroidUsageAccessSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("OPEN_USAGE_ACCESS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAndroidAccessibilitySettings(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val serviceComponent = ComponentName(
                ctx.packageName,
                ScreenGuardianAccessibilityService::class.java.name
            )

            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                putExtra("component_name", serviceComponent)

                if (Build.VERSION.SDK_INT >= 34) {
                    putExtra(Intent.EXTRA_COMPONENT_NAME, serviceComponent)
                }
            }

            ctx.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("OPEN_ACCESSIBILITY_SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAndroidAppNotificationSettings(promise: Promise) {
        try {
            val ctx = reactApplicationContext

            val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                    putExtra(Settings.EXTRA_APP_PACKAGE, ctx.packageName)
                    putExtra("android.provider.extra.APP_PACKAGE", ctx.packageName)
                }
            } else {
                Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = Uri.fromParts("package", ctx.packageName, null)
                }
            }.apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            ctx.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("OPEN_NOTIFICATION_SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAndroidLocationSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("OPEN_LOCATION_SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager

            val installedApps = packageManager.getInstalledApplications(
                PackageManager.GET_META_DATA
            )

            val result = Arguments.createArray()

            installedApps.forEach { appInfo ->
                val packageName = appInfo.packageName

                if (packageName == reactApplicationContext.packageName) {
                    return@forEach
                }

                val launchIntent =
                    packageManager.getLaunchIntentForPackage(packageName)

                if (launchIntent == null) {
                    return@forEach
                }

                val isSystemApp =
                    (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

                val isUpdatedSystemApp =
                    (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0

                if (isSystemApp && !isUpdatedSystemApp) {
                    return@forEach
                }

                val appName = packageManager
                    .getApplicationLabel(appInfo)
                    .toString()

                val item = Arguments.createMap().apply {
                    putString("name", appName)
                    putString("packageName", packageName)
                    putString("icon", "default.png")
                    putBoolean("isSystemApp", isSystemApp)
                }

                result.pushMap(item)
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_INSTALLED_APPS_ERROR", e.message, e)
        }
    }
    @ReactMethod
fun getAppUsageStats(promise: Promise) {
    try {
        val result = UsageStatsHelper.getTodayUsageByApp(reactApplicationContext)
        promise.resolve(result)
    } catch (e: Exception) {
        promise.reject("GET_APP_USAGE_STATS_ERROR", e.message, e)
    }
}
}