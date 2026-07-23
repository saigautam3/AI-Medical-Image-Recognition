export const exportReportToPDF = (report) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to download/print the PDF report.");
    return;
  }
  
  const dateStr = new Date(report.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = new Date(report.timestamp).toLocaleTimeString();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Clinical Analysis Report - ${report.id.substring(0, 8)}</title>
      <style>
        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          margin: 40px;
          line-height: 1.6;
          background: #ffffff;
        }
        .header {
          border-bottom: 2px solid #0ea5e9;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #0284c7;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .meta-info {
          font-size: 13px;
          color: #64748b;
          text-align: right;
          line-height: 1.4;
        }
        .title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #0f172a;
        }
        .badge-row {
          margin-bottom: 25px;
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badge-valid {
          background-color: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }
        .section-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 12px;
          color: #0369a1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 6px;
        }
        .content {
          font-size: 14.5px;
          white-space: pre-wrap;
          color: #334155;
        }
        .disclaimer {
          margin-top: 40px;
          padding: 20px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 8px;
          font-size: 12px;
          color: #9f1239;
          font-style: italic;
          line-height: 1.5;
        }
        .footer {
          margin-top: 60px;
          border-top: 1px solid #e2e8f0;
          padding-top: 15px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
          .section-card {
            page-break-inside: avoid;
            background: #ffffff !important;
            border: 1px solid #e2e8f0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">🏥 AI Medical Vision</div>
          <div style="font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px;">Advanced Diagnostic Assistant</div>
        </div>
        <div class="meta-info">
          <div><strong>Report UUID:</strong> ${report.id}</div>
          <div><strong>Date Analyzed:</strong> ${dateStr}</div>
          <div><strong>Time:</strong> ${timeStr}</div>
        </div>
      </div>

      <div class="title">Clinical Description Report</div>

      <div class="badge-row">
        <span class="badge badge-valid">✓ Medical Validation: Valid Content</span>
        <span style="font-size: 13px; color: #64748b;"><strong>Model:</strong> ${report.modelUsed || 'Gemini 3.1 Flash Lite'}</span>
      </div>

      <div class="section-card">
        <h3 class="section-title">Observations & AI Diagnostics</h3>
        <div class="content">${report.rawResponse}</div>
      </div>

      <div class="disclaimer">
        <strong>Medical Disclaimer:</strong> ${report.disclaimer}
      </div>

      <div class="footer">
        This automated documentation was prepared via the AI Medical Image Recognition System.
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const exportReportToTXT = (report) => {
  const dateStr = new Date(report.timestamp).toLocaleString();
  const textContent = `
=========================================
🏥 AI MEDICAL VISION ANALYSIS REPORT
=========================================
Report ID: ${report.id}
Timestamp: ${dateStr}
Model Used: ${report.modelUsed || 'Gemini 3.1 Flash Lite'}
Medical Status: VALID MEDICAL CONTENT
-----------------------------------------

CLINICAL DESCRIPTION & OBSERVATIONS:
${report.rawResponse}

-----------------------------------------
MEDICAL DISCLAIMER:
${report.disclaimer}

=========================================
End of Report
=========================================
  `.trim();

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `medical_report_${report.id.substring(0, 8)}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportReportToMD = (report) => {
  const dateStr = new Date(report.timestamp).toLocaleString();
  const markdownContent = `
# 🏥 AI Medical Vision Analysis Report

- **Report ID:** \`${report.id}\`
- **Timestamp:** ${dateStr}
- **Model Used:** \`${report.modelUsed || 'Gemini 3.1 Flash Lite'}\`
- **Medical Status:** **VALID MEDICAL CONTENT**

---

## Clinical Description & Observations

${report.rawResponse}

---

> [!CAUTION]
> **Medical Disclaimer:**
> ${report.disclaimer}

---
*Prepared via AI Medical Vision System.*
  `.trim();

  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `medical_report_${report.id.substring(0, 8)}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
