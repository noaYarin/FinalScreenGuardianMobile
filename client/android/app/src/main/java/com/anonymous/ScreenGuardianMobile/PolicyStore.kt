package com.screenguardianmobile

/**
 * PolicyStore
 *
 * This object is the local persistence layer for device policy and usage data.
 * It uses SharedPreferences to store and retrieve all enforcement-related data.
 *
 * Main responsibilities:
 * - Store policy data received from the server (lock state, limits).
 * - Store local usage data (used minutes, extra time).
 * - Provide calculated values (remaining time, effective limit).
 * - Decide whether the device should be locked.
 * - Support offline behavior when the server is unavailable.
 *
 * Architecture role:
 * - This is the single source of truth on the device.
 * - It allows the app to enforce restrictions even without network connectivity.
 * - It works together with:
 *   - DevicePolicySyncHelper (server → device)
 *   - DeviceServerSyncHelper (device → server)
 *
 * Key features:
 *
 * 1. Lock Management:
 *    - lockNow → manual lock triggered locally
 *    - serverLocked → lock triggered by backend
 *
 * 2. Screen Time Limits:
 *    - dailyLimit → base limit set by parent
 *    - extraMinutes → additional time granted (e.g. extension request)
 *    - effectiveLimit = dailyLimit + extraMinutes
 *
 * 3. Usage Tracking:
 *    - usedToday → minutes used today
 *    - automatically resets at the start of a new day
 *
 * 4. Lock Decision Logic:
 *    shouldLockDevice() returns true if:
 *      - manual lock is active
 *      - server lock is active
 *      - OR limit is enabled AND usage reached the limit
 *
 * 5. Offline Support:
 *    - All data is stored locally
 *    - Device can enforce limits without server connection
 *    - Sync happens later when network is available
 *
 * Important notes:
 * - getRemainingMinutes() returns Int.MAX_VALUE if limit is disabled
 * - Values are clamped to avoid invalid states
 *
 * Heartbeat configuration:
 * - Stores baseUrl, deviceId, token for server communication
 *
 * This class is critical for ensuring reliable and consistent behavior
 * across online and offline scenarios.
 */
import org.json.JSONArray
import org.json.JSONObject
import android.content.Context
import java.util.Calendar
import android.content.Intent
import android.content.pm.PackageManager

object PolicyStore {

    private const val PREFS_NAME = "ScreenGuardianPolicy"

    private const val KEY_LOCK_NOW = "lockNow"
    private const val KEY_SERVER_LOCKED = "serverLocked"
    private const val KEY_LIMIT_ENABLED = "limitEnabled"
    private const val KEY_DAILY_LIMIT = "dailyLimit"
    private const val KEY_USED_TODAY = "usedToday"
    private const val KEY_EXTRA_MINUTES = "extraMinutes"
    private const val KEY_BLOCK_REASON = "blockReason"

    private const val KEY_LIMIT_MODE = "limitMode"
    private const val KEY_WEEKLY_LIMIT = "weeklyLimit"
    private const val KEY_USED_WEEK = "usedWeek"
    private const val KEY_WEEKLY_SCHEDULE = "weeklySchedule"

    private const val KEY_MANUAL_LOCK_ENABLED = "manualLockEnabled"
    private const val KEY_DAILY_LIMIT_LOCK_ACTIVE = "dailyLimitLockActive"
    private const val KEY_WEEKLY_LIMIT_LOCK_ACTIVE = "weeklyLimitLockActive"
    private const val KEY_SCHEDULE_LOCK_ACTIVE = "scheduleLockActive"

    private const val KEY_HEARTBEAT_BASE_URL = "heartbeatBaseUrl"
    private const val KEY_HEARTBEAT_DEVICE_ID = "heartbeatDeviceId"
    private const val KEY_HEARTBEAT_TOKEN = "heartbeatToken"

    private const val KEY_CHILD_ID = "childId"
    private const val KEY_PARENT_ID = "parentId"

    // Stores the last foreground package reported by the AccessibilityService.
    // BlockScreenActivity uses this value to know if it should stay open or close.
    private const val KEY_LAST_FOREGROUND_PACKAGE = "lastForegroundPackage"
    
    private const val KEY_BLOCKED_APPS = "blockedApps"

    const val LIMIT_MODE_NONE = "NONE"
    const val LIMIT_MODE_DAILY = "DAILY"
    const val LIMIT_MODE_WEEKLY = "WEEKLY"
    const val LIMIT_MODE_SCHEDULE = "SCHEDULE"

    const val BLOCK_REASON_LOCK_NOW = "LOCK_NOW"
    const val BLOCK_REASON_DAILY_LIMIT_REACHED = "DAILY_LIMIT_REACHED"
    const val BLOCK_REASON_WEEKLY_LIMIT_REACHED = "WEEKLY_LIMIT_REACHED"
    const val BLOCK_REASON_SCHEDULE_BLOCKED = "SCHEDULE_BLOCKED"
    
    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        // ---------- Foreground Package ----------

    // Saves the latest foreground package so the block screen can decide
    // whether it is still allowed to stay visible.
  fun setLastForegroundPackage(context: Context, packageName: String?) {
      prefs(context)
          .edit()
          .putString(KEY_LAST_FOREGROUND_PACKAGE, packageName ?: "")
          .apply()
  }

  // Returns the latest foreground package detected by the AccessibilityService.
  fun getLastForegroundPackage(context: Context): String {
      return prefs(context).getString(KEY_LAST_FOREGROUND_PACKAGE, "") ?: ""
  }

    // ---------- Lock State ----------

    fun setLockNow(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_LOCK_NOW, value).apply()
    }

    fun isLockNow(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_LOCK_NOW, false)
    }

    fun setServerLocked(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_SERVER_LOCKED, value).apply()
    }

    fun isServerLocked(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_SERVER_LOCKED, false)
    }

    fun setManualLockEnabled(context: Context, value: Boolean) {
    prefs(context).edit().putBoolean(KEY_MANUAL_LOCK_ENABLED, value).apply()
}

fun isManualLockEnabled(context: Context): Boolean {
    return prefs(context).getBoolean(KEY_MANUAL_LOCK_ENABLED, false)
}

fun setDailyLimitLockActive(context: Context, value: Boolean) {
    prefs(context).edit().putBoolean(KEY_DAILY_LIMIT_LOCK_ACTIVE, value).apply()
}

fun isDailyLimitLockActive(context: Context): Boolean {
    return prefs(context).getBoolean(KEY_DAILY_LIMIT_LOCK_ACTIVE, false)
}

fun setWeeklyLimitLockActive(context: Context, value: Boolean) {
    prefs(context).edit().putBoolean(KEY_WEEKLY_LIMIT_LOCK_ACTIVE, value).apply()
}

fun isWeeklyLimitLockActive(context: Context): Boolean {
    return prefs(context).getBoolean(KEY_WEEKLY_LIMIT_LOCK_ACTIVE, false)
}

 fun setScheduleLockActive(context: Context, value: Boolean) {
    prefs(context).edit().putBoolean(KEY_SCHEDULE_LOCK_ACTIVE, value).apply()
 }

 fun isScheduleLockActive(context: Context): Boolean {
    return prefs(context).getBoolean(KEY_SCHEDULE_LOCK_ACTIVE, false)
 }

    // ---------- Limit ----------

    fun setLimitEnabled(context: Context, value: Boolean) {
        prefs(context).edit().putBoolean(KEY_LIMIT_ENABLED, value).apply()
    }

    fun isLimitEnabled(context: Context): Boolean {
        return prefs(context).getBoolean(KEY_LIMIT_ENABLED, false)
    }

    fun setLimitMode(context: Context, value: String) {
    val safeMode = when (value) {
        LIMIT_MODE_DAILY,
        LIMIT_MODE_WEEKLY,
        LIMIT_MODE_SCHEDULE,
        LIMIT_MODE_NONE -> value
        else -> LIMIT_MODE_NONE
    }

    prefs(context).edit().putString(KEY_LIMIT_MODE, safeMode).apply()
}

fun getLimitMode(context: Context): String {
    return prefs(context).getString(KEY_LIMIT_MODE, LIMIT_MODE_NONE)
        ?: LIMIT_MODE_NONE
}

  fun setDailyLimit(context: Context, minutes: Int) {
    prefs(context)
        .edit()
        .putInt(KEY_DAILY_LIMIT, minutes.coerceAtLeast(0))
        .apply()
}

    fun getDailyLimit(context: Context): Int {
        return prefs(context).getInt(KEY_DAILY_LIMIT, 0)
    }


    fun setWeeklyLimit(context: Context, minutes: Int) {
    prefs(context)
        .edit()
        .putInt(KEY_WEEKLY_LIMIT, minutes.coerceAtLeast(0))
        .apply()
}

fun getWeeklyLimit(context: Context): Int {
    return prefs(context).getInt(KEY_WEEKLY_LIMIT, 0)
}

fun setWeeklySchedule(context: Context, schedule: JSONArray) {
    prefs(context)
        .edit()
        .putString(KEY_WEEKLY_SCHEDULE, schedule.toString())
        .apply()
}

fun getWeeklySchedule(context: Context): JSONArray {
    val raw = prefs(context).getString(KEY_WEEKLY_SCHEDULE, null)
        ?: return JSONArray()

    return try {
        JSONArray(raw)
    } catch (_: Exception) {
        JSONArray()
    }
}

private fun timeToMinutes(value: String): Int? {
    val parts = value.split(":")
    if (parts.size != 2) return null

    val hours = parts[0].toIntOrNull() ?: return null
    val minutes = parts[1].toIntOrNull() ?: return null

    if (hours !in 0..23 || minutes !in 0..59) return null

    return hours * 60 + minutes
}

private fun isMinuteInsideWindow(
    nowMinutes: Int,
    startMinutes: Int,
    endMinutes: Int
): Boolean {
    return if (startMinutes < endMinutes) {
        nowMinutes >= startMinutes && nowMinutes < endMinutes
    } else {
        nowMinutes >= startMinutes || nowMinutes < endMinutes
    }
}

fun isNowInsideBlockedSchedule(context: Context): Boolean {
    if (!isLimitEnabled(context)) {
        return false
    }

    if (getLimitMode(context) != LIMIT_MODE_SCHEDULE) {
        return false
    }

    val schedule = getWeeklySchedule(context)

    if (schedule.length() == 0) {
        return false
    }

    val now = Calendar.getInstance()

    // Calendar.SUNDAY = 1, so this converts Sunday to 0, Monday to 1, etc.
    val currentDayOfWeek = now.get(Calendar.DAY_OF_WEEK) - 1
    val currentMinutes =
        now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)

    for (i in 0 until schedule.length()) {
        val day = schedule.optJSONObject(i) ?: continue

        val isEnabled = day.optBoolean("isEnabled", false)
        if (!isEnabled) continue

        val dayOfWeek = day.optInt("dayOfWeek", -1)
        if (dayOfWeek != currentDayOfWeek) continue

        val startMinutes = timeToMinutes(day.optString("startTime", ""))
            ?: continue

        val endMinutes = timeToMinutes(day.optString("endTime", ""))
            ?: continue

        if (startMinutes == endMinutes) continue

        if (isMinuteInsideWindow(currentMinutes, startMinutes, endMinutes)) {
            return true
        }
    }

    return false
}

fun isScheduleLockCurrentlyActive(context: Context): Boolean {
    if (!isLimitEnabled(context)) {
        return false
    }

    if (getLimitMode(context) != LIMIT_MODE_SCHEDULE) {
        return false
    }

    val schedule = getWeeklySchedule(context)

    if (schedule.length() == 0) {
        return isScheduleLockActive(context)
    }

    return isNowInsideBlockedSchedule(context)
}
    // ---------- Usage ----------

   fun setUsedToday(context: Context, minutes: Int) {
    prefs(context)
        .edit()
        .putInt(KEY_USED_TODAY, minutes.coerceAtLeast(0))
        .apply()
}

    fun getUsedToday(context: Context): Int {
        return prefs(context).getInt(KEY_USED_TODAY, 0)
    }


    fun setUsedWeek(context: Context, minutes: Int) {
    prefs(context)
        .edit()
        .putInt(KEY_USED_WEEK, minutes.coerceAtLeast(0))
        .apply()
}

fun getUsedWeek(context: Context): Int {
    return prefs(context).getInt(KEY_USED_WEEK, 0)
}

 fun setExtraMinutes(context: Context, minutes: Int) {
    prefs(context)
        .edit()
        .putInt(KEY_EXTRA_MINUTES, minutes.coerceAtLeast(0))
        .apply()
}

fun addExtraMinutes(context: Context, minutes: Int) {
    val current = getExtraMinutes(context)
    val newValue = (current + minutes).coerceIn(0, 600)
    setExtraMinutes(context, newValue)
}
    fun getExtraMinutes(context: Context): Int {
        return prefs(context).getInt(KEY_EXTRA_MINUTES, 0)
    }

    // ---------- Block Reason ----------

    fun setBlockReason(context: Context, reason: String) {
        prefs(context).edit().putString(KEY_BLOCK_REASON, reason).apply()
    }

    fun getBlockReason(context: Context): String {
        return prefs(context).getString(KEY_BLOCK_REASON, "") ?: ""
    }

    fun clearBlockReason(context: Context) {
    prefs(context).edit().remove(KEY_BLOCK_REASON).apply()
    }

    // ---------- Calculations ----------

    fun getEffectiveLimit(context: Context): Int {
       return getDailyLimit(context) + getExtraMinutes(context)
    }

  fun getRemainingMinutes(context: Context): Int {
    if (!isLimitEnabled(context)) {
        return Int.MAX_VALUE
    }

    val remaining = when (getLimitMode(context)) {
        LIMIT_MODE_DAILY -> {
            getEffectiveLimit(context) - getUsedToday(context)
        }

        LIMIT_MODE_WEEKLY -> {
            getWeeklyLimit(context) - getUsedWeek(context)
        }

        LIMIT_MODE_SCHEDULE -> {
            Int.MAX_VALUE
        }

        else -> {
            Int.MAX_VALUE
        }
    }

    return remaining.coerceAtLeast(0)
}

   fun isLimitReached(context: Context): Boolean {
    if (!isLimitEnabled(context)) {
        return false
    }

    return when (getLimitMode(context)) {
        LIMIT_MODE_DAILY -> {
            getDailyLimit(context) > 0 &&
                getRemainingMinutes(context) <= 0
        }

        LIMIT_MODE_WEEKLY -> {
            getWeeklyLimit(context) > 0 &&
                getRemainingMinutes(context) <= 0
        }

        else -> false
    }
}
fun shouldLockDevice(context: Context): Boolean {
    val manualLock =
        isLockNow(context) ||
            isManualLockEnabled(context)

    val automaticLock =
        isDailyLimitLockActive(context) ||
            isWeeklyLimitLockActive(context) ||
            isScheduleLockCurrentlyActive(context)

    if (manualLock) return true
    if (automaticLock) return true

    return isLimitReached(context)
}

fun resolveBlockReason(context: Context): String {
    if (isLockNow(context) || isManualLockEnabled(context)) {
        return BLOCK_REASON_LOCK_NOW
    }

    if (isDailyLimitLockActive(context)) {
        return BLOCK_REASON_DAILY_LIMIT_REACHED
    }

    if (isWeeklyLimitLockActive(context)) {
        return BLOCK_REASON_WEEKLY_LIMIT_REACHED
    }

    if (isScheduleLockCurrentlyActive(context)) {
        return BLOCK_REASON_SCHEDULE_BLOCKED
    }

    if (isLimitReached(context)) {
        return when (getLimitMode(context)) {
            LIMIT_MODE_WEEKLY -> BLOCK_REASON_WEEKLY_LIMIT_REACHED
            LIMIT_MODE_DAILY -> BLOCK_REASON_DAILY_LIMIT_REACHED
            else -> ""
        }
    }

    return ""
}

// ---------- Block Screen Visibility ----------

// Returns true for packages that must never be covered by the block screen,
// such as our own app, the home launcher, phone calls, settings and system UI.
fun isPackageAllowed(context: Context, packageName: String?): Boolean {
    if (packageName.isNullOrBlank()) return true

    if (packageName == context.packageName) return true

    val allowedPackages = setOf(
        "com.google.android.dialer",
        "com.samsung.android.dialer",
        "com.android.dialer",
        "com.android.server.telecom",
        "com.android.incallui",
        "com.android.settings",
        "com.android.systemui",
        "com.google.android.permissioncontroller",
        "com.android.permissioncontroller",
        "com.google.android.googlequicksearchbox"
    )

    if (allowedPackages.contains(packageName)) return true

    if (isLauncherPackage(context, packageName)) return true

    return false
}

// Detects the current Android launcher/home package.
// This is better than relying only on hardcoded launcher package names.
private fun isLauncherPackage(context: Context, packageName: String): Boolean {
    return try {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
        }

        val resolveInfo = context.packageManager.resolveActivity(
            intent,
            PackageManager.MATCH_DEFAULT_ONLY
        )

        val launcherPackage = resolveInfo?.activityInfo?.packageName

        packageName == launcherPackage ||
            packageName.startsWith("com.android.launcher") ||
            packageName.startsWith("com.google.android.apps.nexuslauncher") ||
            packageName.startsWith("com.sec.android.app.launcher") ||
            packageName.startsWith("com.samsung.android.launcher") ||
            packageName.startsWith("com.miui.home") ||
            packageName.startsWith("com.huawei.android.launcher") ||
            packageName.startsWith("com.oppo.launcher") ||
            packageName.startsWith("com.vivo.launcher") ||
            packageName.startsWith("com.oneplus.launcher")
    } catch (_: Exception) {
        packageName.startsWith("com.android.launcher") ||
            packageName.startsWith("com.google.android.apps.nexuslauncher") ||
            packageName.startsWith("com.sec.android.app.launcher") ||
            packageName.startsWith("com.samsung.android.launcher") ||
            packageName.startsWith("com.miui.home") ||
            packageName.startsWith("com.huawei.android.launcher") ||
            packageName.startsWith("com.oppo.launcher") ||
            packageName.startsWith("com.vivo.launcher") ||
            packageName.startsWith("com.oneplus.launcher")
    }
}

// Central decision for whether BlockScreenActivity should be visible now.
// A lock policy alone is not enough: the current foreground package must also be blockable.
fun shouldShowBlockScreen(context: Context, currentPackage: String?): Boolean {
    if (currentPackage.isNullOrBlank()) return false

    if (isPackageAllowed(context, currentPackage)) return false

    val deviceLocked = shouldLockDevice(context)
    val appBlocked = isAppBlocked(context, currentPackage)

    return deviceLocked || appBlocked
}

// Resolves the reason that should be shown to the child.
// Device-level locks have priority over app-specific blocks.
fun resolveBlockReasonForPackage(context: Context, currentPackage: String?): String {
    val deviceReason = resolveBlockReason(context)

    if (deviceReason.isNotBlank()) {
        return deviceReason
    }

    if (!currentPackage.isNullOrBlank() && isAppBlocked(context, currentPackage)) {
        return "APP_BLOCKED"
    }

    return ""
}


private fun formatMinutesAsTime(minutes: Int): String {
    val normalized = minutes.coerceIn(0, 23 * 60 + 59)
    val hours = normalized / 60
    val mins = normalized % 60

    return String.format("%02d:%02d", hours, mins)
}

fun getScheduleStatusForChildHome(context: Context): JSONObject {
    val result = JSONObject()

    result.put("isScheduleMode", false)
    result.put("isBlockedNow", false)
    result.put("nextBlockAt", JSONObject.NULL)
    result.put("blockEndsAt", JSONObject.NULL)

    if (!isLimitEnabled(context) || getLimitMode(context) != LIMIT_MODE_SCHEDULE) {
        return result
    }

    result.put("isScheduleMode", true)

    val schedule = getWeeklySchedule(context)
    if (schedule.length() == 0) {
        return result
    }

    val now = Calendar.getInstance()
    val currentDayOfWeek = now.get(Calendar.DAY_OF_WEEK) - 1
    val currentMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)

    var nextBlockStart: Int? = null

    for (i in 0 until schedule.length()) {
        val day = schedule.optJSONObject(i) ?: continue

        if (!day.optBoolean("isEnabled", false)) continue

        val dayOfWeek = day.optInt("dayOfWeek", -1)
        if (dayOfWeek != currentDayOfWeek) continue

        val startMinutes = timeToMinutes(day.optString("startTime", "")) ?: continue
        val endMinutes = timeToMinutes(day.optString("endTime", "")) ?: continue

        // For now we do not support cross-midnight windows in the child UI.
        if (startMinutes >= endMinutes) continue

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
            result.put("isBlockedNow", true)
            result.put("blockEndsAt", formatMinutesAsTime(endMinutes))
            result.put("nextBlockAt", JSONObject.NULL)
            return result
        }

        if (currentMinutes < startMinutes) {
            if (nextBlockStart == null || startMinutes < nextBlockStart) {
                nextBlockStart = startMinutes
            }
        }
    }

    if (nextBlockStart != null) {
        result.put("nextBlockAt", formatMinutesAsTime(nextBlockStart))
    }

    return result
}

    // ---------- Heartbeat ----------

    fun setHeartbeatBaseUrl(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_BASE_URL, value).apply()
    }

    fun getHeartbeatBaseUrl(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_BASE_URL, null)
    }

    fun setHeartbeatDeviceId(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_DEVICE_ID, value).apply()
    }

    fun getHeartbeatDeviceId(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_DEVICE_ID, null)
    }

    fun setHeartbeatToken(context: Context, value: String) {
        prefs(context).edit().putString(KEY_HEARTBEAT_TOKEN, value).apply()
    }

    fun getHeartbeatToken(context: Context): String? {
        return prefs(context).getString(KEY_HEARTBEAT_TOKEN, null)
    }


        // ---------- Sockets IDs ----------

    fun setChildId(context: Context, value: String) {
    prefs(context).edit().putString(KEY_CHILD_ID, value).apply()
}

fun getChildId(context: Context): String? {
    return prefs(context).getString(KEY_CHILD_ID, null)
}

fun setParentId(context: Context, value: String) {
    prefs(context).edit().putString(KEY_PARENT_ID, value).apply()
}

fun getParentId(context: Context): String? {
    return prefs(context).getString(KEY_PARENT_ID, null)
}

// ---------- Blocked Applications ----------

fun setBlockedApps(
    context: Context,
    packageNames: List<String>
) {
    val jsonArray = JSONArray()

    packageNames.forEach {
        jsonArray.put(it)
    }

    prefs(context)
        .edit()
        .putString(KEY_BLOCKED_APPS, jsonArray.toString())
        .apply()
}

fun getBlockedApps(context: Context): Set<String> {
    val raw = prefs(context)
        .getString(KEY_BLOCKED_APPS, null)
        ?: return emptySet()

    return try {
        val jsonArray = JSONArray(raw)

        buildSet {
            for (i in 0 until jsonArray.length()) {
                add(jsonArray.getString(i))
            }
        }
    } catch (_: Exception) {
        emptySet()
    }
}

fun isAppBlocked(
    context: Context,
    packageName: String
): Boolean {
    return getBlockedApps(context)
        .contains(packageName)
}

    // ---------- Clear ----------

    fun clearAll(context: Context) {
        prefs(context).edit().clear().apply()
    }
}