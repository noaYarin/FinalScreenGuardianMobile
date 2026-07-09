package com.screenguardianmobile

import android.content.Context
import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

/**
 * NativeSocketManager
 *
 * Manages the native Socket.IO connection on the Android child device.
 *
 * Main responsibilities:
 * - Create and maintain one socket connection.
 * - Join both:
 *   1. child room for general child-level events.
 *   2. device room for device-specific policy events.
 * - Listen for real-time policy updates from the server.
 * - Listen for forced logout / device removal events.
 * - Apply incoming policy updates only if they belong to this specific device.
 * - Trigger a callback so the AccessibilityService can re-evaluate lock state.
 */
object NativeSocketManager {

    private const val TAG = "NativeSocketManager"

    // Single active socket instance
    private var socket: Socket? = null

    // Tracks which child/device this socket is currently bound to
    private var boundChildId: String? = null
    private var boundDeviceId: String? = null

    /**
     * Ensures the socket is connected for the current child device.
     */
    fun ensureConnected(
        context: Context,
        onPolicyUpdated: (() -> Unit)?
    ) {
        val baseUrl = PolicyStore.getHeartbeatBaseUrl(context) ?: return
        val childId = PolicyStore.getChildId(context) ?: return
        val parentId = PolicyStore.getParentId(context) ?: return
        val deviceId = PolicyStore.getDeviceId(context) ?: return

        // Already connected for this exact child + device -> nothing to do
        if (
            socket?.connected() == true &&
            boundChildId == childId &&
            boundDeviceId == deviceId
        ) {
            return
        }

        // Clean previous connection before creating a new one
        disconnect()

        try {
            val options = IO.Options.builder()
                .setReconnection(true)
                .setForceNew(false)
                .build()

            socket = IO.socket(baseUrl.trimEnd('/'), options)

            boundChildId = childId
            boundDeviceId = deviceId

            // When socket connects, join the device room on the backend.
            // The backend may also add this socket to child room for general events.
            socket?.on(Socket.EVENT_CONNECT) {
                Log.d(TAG, "Socket connected")

                val payload = JSONObject().apply {
                    put("childId", childId)
                    put("parentId", parentId)
                    put("deviceId", deviceId)
                }

                socket?.emit("JOIN_DEVICE", payload)

                Log.d(
                    TAG,
                    "JOIN_DEVICE emitted childId=$childId parentId=$parentId deviceId=$deviceId"
                )
            }

            // Real-time policy update from server.
            // Important:
            // Even if the server accidentally sends a policy to the child room,
            // this device ignores policies that belong to another deviceId.
            socket?.on("POLICY_UPDATED") { args ->
                try {
                    val payload = args.firstOrNull() as? JSONObject ?: return@on

                    val currentDeviceId = PolicyStore.getDeviceId(context) ?: return@on
                    val payloadDeviceId = payload.optString("deviceId", "")

                    if (payloadDeviceId.isNotBlank() && payloadDeviceId != currentDeviceId) {
                        Log.d(
                            TAG,
                            "Ignoring POLICY_UPDATED for another device. payloadDeviceId=$payloadDeviceId currentDeviceId=$currentDeviceId"
                        )
                        return@on
                    }

                    DevicePolicySyncHelper.applyPolicyData(context, payload)

                    onPolicyUpdated?.invoke()

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to handle POLICY_UPDATED", e)
                }
            }

            // Forced logout / device unlink event.
            // If deviceId exists in payload, only the matching device should clear state.
            socket?.on("FORCE_CHILD_LOGOUT") { args ->
                try {
                    val payload = args.firstOrNull() as? JSONObject

                    val currentDeviceId = PolicyStore.getDeviceId(context)
                    val payloadDeviceId = payload?.optString("deviceId", "") ?: ""

                    if (
                        !currentDeviceId.isNullOrBlank() &&
                        payloadDeviceId.isNotBlank() &&
                        payloadDeviceId != currentDeviceId
                    ) {
                        Log.d(
                            TAG,
                            "Ignoring FORCE_CHILD_LOGOUT for another device. payloadDeviceId=$payloadDeviceId currentDeviceId=$currentDeviceId"
                        )
                        return@on
                    }

                    PolicyStore.clearAll(context)

                    DeviceServerSyncHelper.clearSessionCache()

                    onPolicyUpdated?.invoke()

                } catch (e: Exception) {
                    Log.e(TAG, "Failed to handle FORCE_CHILD_LOGOUT", e)
                }
            }

            socket?.on(Socket.EVENT_DISCONNECT) {
                Log.d(TAG, "Socket disconnected")
            }

            socket?.on(Socket.EVENT_CONNECT_ERROR) { args ->
                Log.e(TAG, "Socket connect error: ${args.joinToString()}")
            }

            socket?.connect()

        } catch (e: Exception) {
            Log.e(TAG, "Socket connection failed", e)
        }
    }

    /**
     * Disconnects the current socket and clears local socket references.
     */
    fun disconnect() {
        try {
            socket?.off()
            socket?.disconnect()
        } catch (_: Exception) {
            // Ignore socket cleanup errors
        } finally {
            socket = null
            boundChildId = null
            boundDeviceId = null
        }
    }

    /**
     * Returns true if the socket is currently connected.
     */
    fun isConnected(): Boolean {
        return socket?.connected() == true
    }
}