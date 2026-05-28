import { sendSosAlertService } from "../services/sos.service.js";

export async function sendSosAlertController(req, res, next) {
  try {
    const parentId = req.user?.parentId;
    const childId = req.user?.childId;
    const deviceId = req.body?.deviceId || null;

    const data = await sendSosAlertService({
      parentId,
      childId,
      deviceId,
    });

    return res.status(201).json({
      ok: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}