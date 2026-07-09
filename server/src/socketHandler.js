import { Server } from "socket.io";
import { 
  REQUEST_CHILD_LOCATION, 
  REQUEST_REFRESH_FROM_PARENT, 
  LOCATION_LIVE_UPDATE, 
  PARENT_LOGOUT, 
  DELETE_DEVICE,
  FORCE_CHILD_LOGOUT,
  JOIN_PARENT,
  JOIN_CHILD,
  JOIN_DEVICE,
  POLICY_UPDATED,
  DEVICE_STATUS_UPDATED
} from "./constants/socketEvents.js";
import { formatJerusalemOffsetIsoNow } from "./utils/time.js";
let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New connection established: ${socket.id}`);

    // Join Parent Room
    socket.on(JOIN_PARENT, (parentId) => {
      if (!parentId) return;
      const room = `parent_${parentId}`;
      socket.data.parentId = String(parentId);
      socket.join(room);
      console.log(`[Join] Parent ${parentId} joined room: ${room}`);
    });

    // Join Child Room
    socket.on(JOIN_CHILD, (payload) => {
      const childId =
        payload && typeof payload === "object" ? payload.childId : payload;
      const parentId =
        payload && typeof payload === "object" ? payload.parentId : null;

      if (!childId) return;
      const room = `child_${childId}`;
      socket.data.childId = String(childId);
      if (parentId) socket.data.parentId = String(parentId);
      socket.join(room);
      console.log(`[Join] Child ${childId} joined room: ${room}`);
    });

    // Join Device Room
socket.on(JOIN_DEVICE, (payload) => {
  const childId = payload?.childId;
  const parentId = payload?.parentId;
  const deviceId = payload?.deviceId;

  if (!childId || !deviceId) return;

  const childRoom = `child_${String(childId)}`;
  const deviceRoom = `device_${String(deviceId)}`;

  socket.data.childId = String(childId);
  socket.data.deviceId = String(deviceId);

  if (parentId) {
    socket.data.parentId = String(parentId);
  }

  // Keep child room for general child events, such as location request.
  socket.join(childRoom);

  // Device-specific room for lock/app-limit/policy updates.
  socket.join(deviceRoom);

  console.log(
    `[Join] Device ${deviceId} joined room: ${deviceRoom} and child room: ${childRoom}`
  );
});

    // Parent requesting location from child
    socket.on(REQUEST_REFRESH_FROM_PARENT, (data) => {
      const { parentId, childId } = data;
      console.log(`[Request] Parent ${parentId} requesting location from child ${childId}`);
      io.to(`child_${childId}`).emit(REQUEST_CHILD_LOCATION, { parentId });
    });
  
    // Child sending location to parent
    socket.on(REQUEST_CHILD_LOCATION, (data) => {
      const { parentId, location, childId, lastUpdated } = data ?? {};
      console.log(`[LocationUpdate] Child ${childId} sending location to parent ${parentId}`);

      const effectiveLastUpdated =
        lastUpdated != null
          ? formatJerusalemOffsetIsoNow(new Date(lastUpdated))
          : formatJerusalemOffsetIsoNow();
      
      io.to(`parent_${parentId}`).emit(LOCATION_LIVE_UPDATE, {
        childId,
        location,
        lastUpdated: effectiveLastUpdated
      });
    });

    // Parent Logout - Force disconnect all linked children
    socket.on(PARENT_LOGOUT, (data) => {
      const { parentId, childrenIds } = data;
      console.log(`[Logout] Parent ${parentId} logged out. Processing children disconnection...`);
      
      if (childrenIds && Array.isArray(childrenIds)) {
        childrenIds.forEach(childId => {
          const childRoom = `child_${childId}`;
          console.log(`[ForceLogout] Emitting logout to child room: ${childRoom}`);
          
          io.to(childRoom).emit(FORCE_CHILD_LOGOUT, {
            message: "The parent logged out, the application will close now."
          });
        });
      }
    });

socket.on(DELETE_DEVICE, (data) => {
  const { deviceId, childId } = data ?? {}; 
  
  if (!childId || !deviceId) {
    console.log("[DeleteDevice] Missing childId or deviceId");
    return;
  }

  const deviceRoom = `device_${String(deviceId)}`;

  console.log(
    `[DeleteDevice] Parent requesting delete for device ${deviceId} in room: ${deviceRoom}`
  );

  io.to(deviceRoom).emit(FORCE_CHILD_LOGOUT, { 
    deviceId: String(deviceId),
    childId: String(childId),
    reason: "DEVICE_DELETED",
    message: "This device has been disconnected by the parent." 
  });
});

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

    });
  });

  return io;
}

export function getIO() {
  return io;
}

// Emits a real-time policy update to a specific child device room
export function emitPolicyUpdated(deviceId, policyPayload) {
  if (!io || !deviceId || !policyPayload) return;

  const room = `device_${String(deviceId)}`;
  io.to(room).emit(POLICY_UPDATED, policyPayload);
}

// Emits a real-time device status update to the parent room
export function emitDeviceStatusUpdated(parentId, payload) {
  if (!io || !parentId || !payload) return;

  const room = `parent_${parentId}`;
  io.to(room).emit(DEVICE_STATUS_UPDATED, payload);
}
