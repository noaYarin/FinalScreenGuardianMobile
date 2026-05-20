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
import android.content.Context
import java.util.Calendar

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

    private const val KEY_MANUAL_LOCK_ENABLED = "manualLockEnabled"
    private const val KEY_DAILY_LIMIT_LOCK_ACTIVE = "dailyLimitLockActive"
    private const val KEY_WEEKLY_LIMIT_LOCK_ACTIVE = "weeklyLimitLockActive"
    private const val KEY_SCHEDULE_LOCK_ACTIVE = "scheduleLockActive"

    private const val KEY_HEARTBEAT_BASE_URL = "heartbeatBaseUrl"
    private const val KEY_HEARTBEAT_DEVICE_ID = "heartbeatDeviceId"
    private const val KEY_HEARTBEAT_TOKEN = "heartbeatToken"

    private const val KEY_CHILD_ID = "childId"
    private const val KEY_PARENT_ID = "parentId"
    
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

    val serverLock = isServerLocked(context)

    val automaticLock =
        isDailyLimitLockActive(context) ||
            isWeeklyLimitLockActive(context) ||
            isScheduleLockActive(context)

    if (manualLock) return true
    if (serverLock) return true
    if (automaticLock) return true

    return isLimitReached(context)
}

fun resolveBlockReason(context: Context): String {
    if (isLockNow(context) || isManualLockEnabled(context)) {
        return BLOCK_REASON_LOCK_NOW
    }

    if (isScheduleLockActive(context)) {
        return BLOCK_REASON_SCHEDULE_BLOCKED
    }

    if (isWeeklyLimitLockActive(context)) {
        return BLOCK_REASON_WEEKLY_LIMIT_REACHED
    }

    if (isDailyLimitLockActive(context)) {
        return BLOCK_REASON_DAILY_LIMIT_REACHED
    }

    if (isLimitReached(context)) {
        return when (getLimitMode(context)) {
            LIMIT_MODE_WEEKLY -> BLOCK_REASON_WEEKLY_LIMIT_REACHED
            LIMIT_MODE_DAILY -> BLOCK_REASON_DAILY_LIMIT_REACHED
            LIMIT_MODE_SCHEDULE -> BLOCK_REASON_SCHEDULE_BLOCKED
            else -> ""
        }
    }

    return ""
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