export interface IssueData {
  type: string;
  title: string;
  description: string;
  priority?: string;
  status?: string;
}

export function getIssueCreatedEmailTemplate(issue: IssueData, dashboardUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 2px solid #06b6d4; border-radius: 12px; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; margin: 0; font-size: 32px; font-weight: bold;">🔔 New Issue Created</h1>
          </div>
          <div style="line-height: 1.8; color: #ffffff;">
            <p style="color: #ffffff; font-size: 16px; margin: 15px 0;">A new security issue has been created in your ApniSec account.</p>
            <div style="background-color: #0f172a; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #334155;">
              <h3 style="color: #06b6d4; margin-top: 0; font-size: 22px; margin-bottom: 15px;">${issue.title}</h3>
              <div style="margin: 15px 0;">
                <span style="display: inline-block; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: bold; margin-right: 8px; background-color: #14b8a6; color: #000000;">${issue.type}</span>
                ${issue.priority ? `<span style="display: inline-block; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: bold; margin-right: 8px; background-color: #f97316; color: #000000;">${issue.priority}</span>` : ''}
                ${issue.status ? `<span style="display: inline-block; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: bold; margin-right: 8px; background-color: #3b82f6; color: #ffffff;">${issue.status}</span>` : ''}
              </div>
              <p style="color: #e5e7eb; font-size: 15px; line-height: 1.6; margin-top: 15px;">${issue.description}</p>
            </div>
            <a href="${dashboardUrl}/dashboard" style="display: inline-block; background-color: #06b6d4; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 25px 0; font-size: 16px;">View in Dashboard</a>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin: 8px 0;">ApniSec - Your Trusted Cybersecurity Partner</p>
            <p style="color: #94a3b8; font-size: 13px; margin: 8px 0;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
