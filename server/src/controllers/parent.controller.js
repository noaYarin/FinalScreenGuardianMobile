import {
  getChildScreenTimeReports,
  getParentHomeSummary
} from "../services/parent.service.js";
import { buildParentAnalyticsReport } from "../services/parentAnalyticsReport.service.js";
import { buildParentAiInsights } from "../services/aiInsights.service.js";

export async function getParentHomeSummaryController(req, res, next) {
  try {
    const parentId = req.user.parentId;

    const data = await getParentHomeSummary(parentId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getChildScreenTimeReportsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const deviceId =
      typeof req.query.deviceId === "string" && req.query.deviceId.trim()
        ? req.query.deviceId.trim()
        : null;

    const data = await getChildScreenTimeReports(parentId, childId, deviceId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParentAnalyticsReportController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const { from, to } = req.query;

    const data = await buildParentAnalyticsReport(
      parentId,
      childId,
      from,
      to
    );

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParentAiInsightsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const data = await buildParentAiInsights(parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}