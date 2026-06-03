import type {
  ParentAiInsights,
  ParentAnalyticsReport,
  ParentAnalyticsTopApplication,
} from "@/src/api/parent";
import { formatReportHours } from "./reportUtils";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAttentionLabel(riskLevel?: string): string {
  switch (riskLevel) {
    case "HIGH":
      return "Needs attention";
    case "MEDIUM":
      return "Worth checking";
    case "LOW":
      return "Low concern";
    default:
      return "Not available";
  }
}

function getSelectedPeriodAppMinutes(app: ParentAnalyticsTopApplication): number {
  return Number(app.usedRangeMinutes ?? 0);
}

function buildTopApplicationsHtml(report: ParentAnalyticsReport): string {
  const apps = Array.isArray(report.topApplications)
    ? report.topApplications
    : [];

  if (apps.length === 0) {
    return `<p class="muted">No application usage was recorded for the selected period.</p>`;
  }

  return `
    <div class="apps-card">
      <div class="table-header">
        <span>App</span>
        <span>Usage</span>
      </div>

      ${apps
        .map(
          (app, index) => `
            <div class="app-row">
              <div class="app-left">
                <span class="rank">${index + 1}</span>
                <div>
                  <div class="app-name">${escapeHtml(app.name)}</div>
                  <div class="app-package">${escapeHtml(app.packageName)}</div>
                </div>
              </div>

              <div class="app-time">
                ${formatReportHours(getSelectedPeriodAppMinutes(app))}
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function buildAiInsightsHtml(aiInsights?: ParentAiInsights | null): string {
  if (!aiInsights) {
    return `
      <div class="ai-section">
        <div class="section-header ai-header">
          <div class="header-title-row">
            <span class="ai-icon">✨</span>
            <div>
              <h2>AI insights</h2>
              <p>Based on the last 7 days compared with the previous 7 days</p>
            </div>
          </div>
        </div>

        <div class="ai-content">
          <p class="muted">AI insights were not available when this PDF was generated.</p>
        </div>
      </div>
    `;
  }

  const insights = Array.isArray(aiInsights.insights)
    ? aiInsights.insights.slice(0, 3)
    : [];

  const actions = Array.isArray(aiInsights.recommendedActions)
    ? aiInsights.recommendedActions.slice(0, 2)
    : [];

  return `
    <div class="ai-section">
      <div class="section-header ai-header">
        <div class="header-title-row">
          <span class="ai-icon">✨</span>
          <div>
            <h2>AI insights</h2>
            <p>Based on the last 7 days compared with the previous 7 days</p>
          </div>
        </div>
      </div>

      <div class="ai-content">
        <div class="attention-row">
          <div class="attention-badge">
            ${escapeHtml(getAttentionLabel(aiInsights.riskLevel))}
          </div>
        </div>

        <p class="ai-summary">${escapeHtml(aiInsights.summary)}</p>

        ${
          insights.length > 0
            ? `
              <div class="insights-list">
                ${insights
                  .map(
                    (insight) => `
                      <div class="insight-card">
                        <strong>${escapeHtml(insight.title)}</strong>
                        <p>${escapeHtml(insight.message)}</p>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            `
            : `<p class="muted">No AI insights were generated.</p>`
        }

        ${
          actions.length > 0
            ? `
              <h3>Recommended actions</h3>
              <ul>
                ${actions
                  .map((action) => `<li>${escapeHtml(action.label)}</li>`)
                  .join("")}
              </ul>
            `
            : ""
        }
      </div>
    </div>
  `;
}

export function buildAnalyticsReportHtml(
  report: ParentAnalyticsReport,
  aiInsights?: ParentAiInsights | null
): string {
  return `
    <html>
      <head>
        <meta charset="utf-8" />

        <style>
          body {
            font-family: Arial, sans-serif;
            color: #111827;
            padding: 24px;
            line-height: 1.45;
            background: #FFFFFF;
          }

          h1 {
            font-size: 22px;
            margin-bottom: 4px;
          }

          h2 {
            font-size: 16px;
            margin: 0;
            color: #111827;
          }

          h3 {
            font-size: 14px;
            margin-top: 16px;
            margin-bottom: 8px;
          }

          .meta {
            color: #6B7280;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 20px;
          }

          .section {
            margin-top: 22px;
          }

          .section-header {
            border-radius: 14px;
            border: 1px solid #E5E7EB;
            padding: 14px;
            margin-bottom: 12px;
            background: #F8FAFC;
          }

          .section-header p {
            margin: 4px 0 0;
            color: #6B7280;
            font-size: 12px;
          }

          .metrics-header {
            background: #EEF2FF;
            border-color: #C7D2FE;
          }

          .apps-header {
            background: #F0FDF4;
            border-color: #BBF7D0;
          }

          .ai-header {
            background: #FAF5FF;
            border-color: #E9D5FF;
          }

          .summary-card {
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 14px;
            padding: 14px;
          }

          .summary-text {
            white-space: pre-line;
            color: #374151;
            font-size: 14px;
            margin: 0;
          }

          .metrics-card {
            background: #F8FAFF;
            border: 1px solid #E0E7FF;
            border-radius: 16px;
            padding: 12px;
          }

          .indicators {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .indicator {
            border: 1px solid #C7D2FE;
            border-radius: 12px;
            padding: 12px;
            width: 44%;
            background: #FFFFFF;
          }

          .indicator-label {
            font-size: 12px;
            color: #6B7280;
          }

          .indicator-value {
            font-size: 18px;
            font-weight: bold;
            margin-top: 4px;
          }

          .apps-card {
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            padding: 10px;
          }

          .table-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #6B7280;
            font-weight: bold;
            padding: 8px 4px;
            border-bottom: 1px solid #E5E7EB;
          }

          .app-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 10px 4px;
            border-bottom: 1px solid #F3F4F6;
          }

          .app-row:last-child {
            border-bottom: none;
          }

          .app-left {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
          }

          .rank {
            width: 24px;
            height: 24px;
            border-radius: 12px;
            background: #EEF2FF;
            color: #4F46E5;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          }

          .app-name {
            font-size: 13px;
            font-weight: bold;
          }

          .app-package {
            font-size: 11px;
            color: #6B7280;
            margin-top: 2px;
          }

          .app-time {
            font-size: 13px;
            font-weight: bold;
            white-space: nowrap;
          }

          .ai-section {
            margin-top: 22px;
            background: #FDF4FF;
            border: 1px solid #E9D5FF;
            border-radius: 18px;
            padding: 14px;
          }

          .header-title-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .ai-icon {
            width: 34px;
            height: 34px;
            border-radius: 17px;
            background: #F3E8FF;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }

          .ai-content {
            background: #FFFFFF;
            border: 1px solid #F3E8FF;
            border-radius: 14px;
            padding: 12px;
          }

          .attention-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }

          .attention-title {
            font-size: 14px;
            font-weight: bold;
          }

          .attention-subtitle {
            font-size: 12px;
            color: #6B7280;
            margin-top: 2px;
          }

          .attention-badge {
            background: #EEF2FF;
            color: #4F46E5;
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
          }

          .ai-summary {
            margin-top: 12px;
            color: #374151;
            font-size: 13px;
          }

          .insights-list {
            margin-top: 12px;
          }

          .insight-card {
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 10px;
            margin-top: 8px;
            background: #F9FAFB;
          }

          .insight-card p {
            margin: 4px 0 0;
            color: #374151;
            font-size: 13px;
          }

          .muted {
            color: #6B7280;
            font-size: 13px;
          }
        </style>
      </head>

      <body>
        <h1>Screen Guardian — Usage Report</h1>

        <p class="meta">
          For: ${escapeHtml(report.childName)}<br/>
          Selected period: ${escapeHtml(report.fromLabel)} – ${escapeHtml(report.toLabel)}<br/>
          Generated: ${escapeHtml(report.generatedAtLabel)}
        </p>

        <div class="section">
          <div class="section-header">
            <h2>Selected period summary</h2>
            <p>Based on the dates selected by the parent</p>
          </div>

          <div class="summary-card">
            <p class="summary-text">${escapeHtml(report.executiveSummary)}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-header metrics-header">
            <h2>Report highlights</h2>
            <p>Key numbers from the selected period</p>
          </div>

          <div class="metrics-card">
            <div class="indicators">
              <div class="indicator">
                <div class="indicator-label">Total screen time</div>
                <div class="indicator-value">${formatReportHours(report.indicators.totalMinutes)}</div>
              </div>

              <div class="indicator">
                <div class="indicator-label">Daily average</div>
                <div class="indicator-value">${formatReportHours(report.indicators.dailyAverageMinutes)}</div>
              </div>

              <div class="indicator">
                <div class="indicator-label">Extension requests</div>
                <div class="indicator-value">${report.indicators.extensionRequestsCount}</div>
              </div>

              <div class="indicator">
                <div class="indicator-label">Tasks approved</div>
                <div class="indicator-value">${report.indicators.tasksApprovedCount}</div>
              </div>

              <div class="indicator">
                <div class="indicator-label">Limit exceedances</div>
                <div class="indicator-value">${report.indicators.limitExceededDays}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header apps-header">
            <h2>Top applications in selected period</h2>
            <p>
              Apps with the highest recorded usage between
              ${escapeHtml(report.fromLabel)} and ${escapeHtml(report.toLabel)}
            </p>
          </div>

          ${buildTopApplicationsHtml(report)}
        </div>

        ${buildAiInsightsHtml(aiInsights)}
      </body>
    </html>
  `;
}