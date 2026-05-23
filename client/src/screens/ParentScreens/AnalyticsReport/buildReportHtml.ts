import type { ParentAnalyticsReport } from "@/src/api/parent";
import { formatReportHours } from "./reportUtils";

export function buildAnalyticsReportHtml(report: ParentAnalyticsReport): string {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          h2 { font-size: 16px; margin-top: 24px; color: #4F46E5; }
          .meta { color: #6B7280; font-size: 13px; line-height: 1.5; }
          .indicators { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
          .indicator { border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; min-width: 140px; }
          .indicator-label { font-size: 12px; color: #6B7280; }
          .indicator-value { font-size: 18px; font-weight: bold; margin-top: 4px; }
        </style>
      </head>
      <body>
        <h1>Screen Guardian —  Usage Report</h1>
        <p class="meta">For: ${report.childName}<br/>
        Period: ${report.fromLabel} – ${report.toLabel}<br/>
        Generated: ${report.generatedAtLabel}</p>

        <h2>Executive summary</h2>
        <p style="white-space: pre-line; line-height: 1.5;">${report.executiveSummary}</p>

        <h2>Key metrics</h2>
        <div class="indicators">
          <div class="indicator"><div class="indicator-label">Total screen time</div><div class="indicator-value">${formatReportHours(report.indicators.totalMinutes)}</div></div>
          <div class="indicator"><div class="indicator-label">Daily average</div><div class="indicator-value">${formatReportHours(report.indicators.dailyAverageMinutes)}</div></div>
          <div class="indicator"><div class="indicator-label">Limit exceedances</div><div class="indicator-value">${report.indicators.limitExceededDays}</div></div>
          <div class="indicator"><div class="indicator-label">Tasks approved</div><div class="indicator-value">${report.indicators.tasksApprovedCount}</div></div>
        </div>
      </body>
    </html>
  `;
}
