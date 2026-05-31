import moment from "moment-timezone";
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import logger from "../utils/logger.js";
import { findDevicesByChildId } from "../dal/device.dal.js";
import { buildParentAnalyticsReport } from "./parentAnalyticsReport.service.js";
import { JERUSALEM_TZ } from "../utils/time.js";

const DEFAULT_MAX_INSIGHTS = 3;

function normalizeNumber(value, fallback = 0) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : fallback;
}

function pickRepresentativeDevice(devices) {
    if (!Array.isArray(devices) || devices.length === 0) {
        return null;
    }

    const activeDevices = devices.filter((device) => device?.isActive !== false);

    if (activeDevices.length === 0) {
        return devices[0];
    }

    const lockedDevice = activeDevices.find((device) => device?.isLocked === true);
    if (lockedDevice) {
        return lockedDevice;
    }

    return activeDevices[0];
}

function buildWeeklyRanges(now = new Date()) {
    const today = moment(now).tz(JERUSALEM_TZ).startOf("day");

    const currentTo = today.format("YYYY-MM-DD");
    const currentFrom = today.clone().subtract(6, "days").format("YYYY-MM-DD");

    const previousTo = today.clone().subtract(7, "days").format("YYYY-MM-DD");
    const previousFrom = today.clone().subtract(13, "days").format("YYYY-MM-DD");

    return {
        currentFrom,
        currentTo,
        previousFrom,
        previousTo,
    };
}

function percentChange(current, previous) {
    const safeCurrent = normalizeNumber(current);
    const safePrevious = normalizeNumber(previous);

    if (safePrevious <= 0) {
        return null;
    }

    return Math.round(((safeCurrent - safePrevious) / safePrevious) * 100);
}

function buildDeviceContext(device) {
    if (!device) {
        return null;
    }

    const screenTime = device.screenTime || {};

    return {
        isActive: device.isActive !== false,
        lastSeenAt: device.lastSeenAt || null,
        lockState: {
            isLocked: device.isLocked === true,
            manualLockEnabled: device.manualLockEnabled === true,
            dailyLimitLockActive: device.dailyLimitLockActive === true,
            weeklyLimitLockActive: device.weeklyLimitLockActive === true,
            scheduleLockActive: device.scheduleLockActive === true,
        },
        permissions: {
            usageAccessEnabled:
                typeof device.usageAccessEnabled === "boolean"
                    ? device.usageAccessEnabled
                    : null,
            accessibilityEnabled:
                typeof device.accessibilityEnabled === "boolean"
                    ? device.accessibilityEnabled
                    : null,
        },
        screenTimePolicy: {
            isLimitEnabled: screenTime.isLimitEnabled === true,
            limitMode: screenTime.limitMode || "NONE",
            dailyLimitMinutes: normalizeNumber(screenTime.dailyLimitMinutes),
            extraMinutesToday: normalizeNumber(screenTime.extraMinutesToday),
            weeklyLimitMinutes: normalizeNumber(screenTime.weeklyLimitMinutes),
            usedTodayMinutes: normalizeNumber(screenTime.usedTodayMinutes),
            usedWeekMinutes: normalizeNumber(screenTime.usedWeekMinutes),
            weeklyScheduleDays: Array.isArray(screenTime.weeklySchedule)
                ? screenTime.weeklySchedule.length
                : 0,
        },
    };
}

function extractComparableReport(report) {
    const indicators = report?.indicators || {};

    return {
        fromKey: report?.fromKey,
        toKey: report?.toKey,
        totalMinutes: normalizeNumber(indicators.totalMinutes),
        dailyAverageMinutes: normalizeNumber(indicators.dailyAverageMinutes),
        limitExceededDays: normalizeNumber(indicators.limitExceededDays),
        tasksApprovedCount: normalizeNumber(indicators.tasksApprovedCount),
        extensionRequestsCount: normalizeNumber(
            indicators.extensionRequestsCount
        ),
    };
}

function buildComparison(currentReport, previousReport) {
    const current = extractComparableReport(currentReport);
    const previous = extractComparableReport(previousReport);

    return {
        totalMinutesChangePercent: percentChange(
            current.totalMinutes,
            previous.totalMinutes
        ),
        dailyAverageChangePercent: percentChange(
            current.dailyAverageMinutes,
            previous.dailyAverageMinutes
        ),
        limitExceededDaysChange:
            current.limitExceededDays - previous.limitExceededDays,
        extensionRequestsChange:
            current.extensionRequestsCount - previous.extensionRequestsCount,
        tasksApprovedChange:
            current.tasksApprovedCount - previous.tasksApprovedCount,
    };
}

function buildAiContext({ currentReport, previousReport, device }) {
    return {
        analysisType: "LAST_7_DAYS_VS_PREVIOUS_7_DAYS",
        currentPeriod: extractComparableReport(currentReport),
        previousPeriod: extractComparableReport(previousReport),
        comparison: buildComparison(currentReport, previousReport),
        device: buildDeviceContext(device),
    };
}

function buildFallbackInsights(aiContext, reason = "fallback") {
    const current = aiContext.currentPeriod;
    const comparison = aiContext.comparison;
    const insights = [];

    if (!aiContext.device) {
        insights.push({
            title: "No linked device",
            message: "Connect a child device to generate smart screen-time insights.",
            type: "info",
        });
    } else if (aiContext.device.permissions.usageAccessEnabled === false) {
        insights.push({
            title: "Usage access is disabled",
            message:
                "Usage tracking may be incomplete because Usage Access is not enabled on the child device.",
            type: "warning",
        });
    } else if (current.totalMinutes <= 0) {
        insights.push({
            title: "Not enough usage data",
            message:
                "After a few days of usage, weekly insights will become more accurate.",
            type: "info",
        });
    } else {
        if (comparison.totalMinutesChangePercent != null) {
            const change = comparison.totalMinutesChangePercent;

            if (change < 0) {
                insights.push({
                    title: "Positive weekly trend",
                    message: `Screen time decreased by ${Math.abs(
                        change
                    )}% compared with the previous 7 days.`,
                    type: "positive",
                });
            } else if (change > 0) {
                insights.push({
                    title: "Screen time increased",
                    message: `Screen time increased by ${change}% compared with the previous 7 days.`,
                    type: "warning",
                });
            }
        }

        if (comparison.limitExceededDaysChange < 0) {
            insights.push({
                title: "Fewer limit exceedances",
                message:
                    "The child exceeded the screen-time limit on fewer days than in the previous week.",
                type: "positive",
            });
        } else if (comparison.limitExceededDaysChange > 0) {
            insights.push({
                title: "More limit exceedances",
                message:
                    "The child exceeded the screen-time limit on more days than in the previous week.",
                type: "recommendation",
            });
        }

        if (comparison.extensionRequestsChange > 0) {
            insights.push({
                title: "More extension requests",
                message:
                    "Extension requests increased this week. It may be worth checking which days felt harder to follow.",
                type: "recommendation",
            });
        }

        if (insights.length === 0) {
            insights.push({
                title: "Stable weekly usage",
                message:
                    "No major weekly change was detected. Continue monitoring the trend over time.",
                type: "info",
            });
        }
    }

    const riskLevel =
        current.limitExceededDays >= 3 ||
            (comparison.totalMinutesChangePercent != null &&
                comparison.totalMinutesChangePercent > 20)
            ? "HIGH"
            : current.limitExceededDays > 0
                ? "MEDIUM"
                : "LOW";

    return {
        source: reason,
        analysisType: aiContext.analysisType,
        summary:
            insights[0]?.message ||
            "Weekly smart insights are based on the last 7 days compared with the previous 7 days.",
        riskLevel,
        insights: insights.slice(0, DEFAULT_MAX_INSIGHTS),
        recommendedActions: [
            {
                label: "Continue monitoring",
                actionType: "NONE",
            },
        ],
    };
}

function buildPrompt(aiContext) {
    return `
You are generating short, safe, parent-facing screen-time insights for a parental-control app.

Important rules:
- Write in English.
- Analyze the last 7 days compared with the previous 7 days.
- If the previous period has 0 total minutes, do not describe a percentage increase or decrease. Explain that there is not enough previous-week data for a reliable trend comparison.
- If no screen-time limit is enabled, mention that limit exceedance analysis is not available.
- Do not diagnose mental health or make emotional assumptions.
- Do not mention private personal details.
- Be practical, calm, and non-judgmental.
- Do not tell the parent to punish the child.
- Do not change limits automatically. Only suggest actions.
- Use screen-time totals, daily averages, limit exceedances, extension requests, tasks, permissions and lock state.
- If permissions are disabled or unknown, mention that usage data may be incomplete.
- Return JSON only. No markdown.

Data:
${JSON.stringify(aiContext, null, 2)}

Return exactly this JSON shape:
{
  "summary": "short English summary, max 2 sentences",
  "riskLevel": "LOW | MEDIUM | HIGH",
  "insights": [
    {
      "title": "short English title",
      "message": "short English message",
      "type": "positive | warning | recommendation | info"
    }
  ],
  "recommendedActions": [
    {
      "label": "short English button/action label",
      "actionType": "CHANGE_LIMIT | SUGGEST_ACTIVITY | SEND_ENCOURAGEMENT | CHECK_PERMISSIONS | NONE"
    }
  ]
}

Maximum 3 insights and maximum 2 recommendedActions.
`;
}

function cleanJsonText(text) {
    return String(text || "")
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();
}

function normalizeGeminiResult(parsed, fallback, aiContext) {
    const allowedRiskLevels = ["LOW", "MEDIUM", "HIGH"];
    const allowedInsightTypes = [
        "positive",
        "warning",
        "recommendation",
        "info",
    ];
    const allowedActionTypes = [
        "CHANGE_LIMIT",
        "SUGGEST_ACTIVITY",
        "SEND_ENCOURAGEMENT",
        "CHECK_PERMISSIONS",
        "NONE",
    ];

    const summary =
        typeof parsed?.summary === "string" && parsed.summary.trim()
            ? parsed.summary.trim()
            : fallback.summary;

    const riskLevel = allowedRiskLevels.includes(parsed?.riskLevel)
        ? parsed.riskLevel
        : fallback.riskLevel;

    const insights = Array.isArray(parsed?.insights)
        ? parsed.insights
            .map((item) => ({
                title:
                    typeof item?.title === "string" && item.title.trim()
                        ? item.title.trim()
                        : "Insight",
                message:
                    typeof item?.message === "string" && item.message.trim()
                        ? item.message.trim()
                        : "",
                type: allowedInsightTypes.includes(item?.type)
                    ? item.type
                    : "info",
            }))
            .filter((item) => item.message)
            .slice(0, DEFAULT_MAX_INSIGHTS)
        : fallback.insights;

    const recommendedActions = Array.isArray(parsed?.recommendedActions)
        ? parsed.recommendedActions
            .map((item) => ({
                label:
                    typeof item?.label === "string" && item.label.trim()
                        ? item.label.trim()
                        : "Continue monitoring",
                actionType: allowedActionTypes.includes(item?.actionType)
                    ? item.actionType
                    : "NONE",
            }))
            .slice(0, 2)
        : fallback.recommendedActions;

    return {
        source: "gemini",
        analysisType: aiContext.analysisType,
        summary,
        riskLevel,
        insights: insights.length > 0 ? insights : fallback.insights,
        recommendedActions:
            recommendedActions.length > 0
                ? recommendedActions
                : fallback.recommendedActions,
    };
}

export async function buildParentAiInsights(parentId, childId, now = new Date()) {
    const ranges = buildWeeklyRanges(now);

    const [currentReport, previousReport, devices] = await Promise.all([
        buildParentAnalyticsReport(
            parentId,
            childId,
            ranges.currentFrom,
            ranges.currentTo,
            now
        ),
        buildParentAnalyticsReport(
            parentId,
            childId,
            ranges.previousFrom,
            ranges.previousTo,
            now
        ),
        findDevicesByChildId(childId),
    ]);

    const device = pickRepresentativeDevice(devices);
    const aiContext = buildAiContext({ currentReport, previousReport, device });
    const fallback = buildFallbackInsights(aiContext);

    logAiInsightsContext(childId, aiContext);

    if (!env.AI_INSIGHTS_ENABLED) {
        logger.info("AI insights fallback used", {
            childId,
            reason: "disabled",
        });

        return buildFallbackInsights(aiContext, "disabled");
    }

    if (!env.GEMINI_API_KEY) {
        return buildFallbackInsights(aiContext, "missing_api_key");
    }

    if (!device || currentReport?.indicators?.totalMinutes <= 0) {
        logger.info("AI insights fallback used", {
            childId,
            reason: !device ? "no_device" : "not_enough_usage_data",
            totalMinutes: currentReport?.indicators?.totalMinutes ?? null,
        });

        return fallback;
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: env.GEMINI_MODEL,
            contents: buildPrompt(aiContext),
            config: {
                responseMimeType: "application/json",
            },
        });

        const rawText = cleanJsonText(response.text);
        const parsed = JSON.parse(rawText);

        const result = normalizeGeminiResult(parsed, fallback, aiContext);

        logger.info("AI insights generated by Gemini", {
            childId,
            source: result.source,
            analysisType: result.analysisType,
            riskLevel: result.riskLevel,
            insightsCount: result.insights.length,
            actionsCount: result.recommendedActions.length,
        });

        return result;

    } catch (err) {
        logger.error("Gemini AI insights failed", {
            message: err?.message,
            childId,
        });

        return buildFallbackInsights(aiContext, "gemini_error");
    }
}

function logAiInsightsContext(childId, aiContext) {
    logger.info("AI insights context prepared", {
        childId,
        analysisType: aiContext.analysisType,
        currentPeriod: aiContext.currentPeriod,
        previousPeriod: aiContext.previousPeriod,
        comparison: aiContext.comparison,
        device: {
            hasDevice: Boolean(aiContext.device),
            isActive: aiContext.device?.isActive ?? null,
            usageAccessEnabled:
                aiContext.device?.permissions?.usageAccessEnabled ?? null,
            accessibilityEnabled:
                aiContext.device?.permissions?.accessibilityEnabled ?? null,
            isLocked: aiContext.device?.lockState?.isLocked ?? null,
            limitMode: aiContext.device?.screenTimePolicy?.limitMode ?? null,
            dailyLimitMinutes:
                aiContext.device?.screenTimePolicy?.dailyLimitMinutes ?? null,
            weeklyLimitMinutes:
                aiContext.device?.screenTimePolicy?.weeklyLimitMinutes ?? null,
        },
    });
}