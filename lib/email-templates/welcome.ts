export function getWelcomeEmailTemplate(name: string, dashboardUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 2px solid #06b6d4; border-radius: 12px; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; margin: 0; font-size: 32px; font-weight: bold;">🛡️ ApniSec</h1>
          </div>
          <div style="line-height: 1.8; color: #ffffff;">
            <h2 style="color: #06b6d4; font-size: 24px; margin-bottom: 20px;">Welcome, ${name}! 👋</h2>
            <p style="color: #ffffff; font-size: 16px; margin: 15px 0;">
              Thank you for joining <strong style="color: #06b6d4; font-weight: 600;">ApniSec</strong>. We're excited to have you on board.
            </p>
            <p style="color: #ffffff; font-size: 16px; margin: 15px 0;">With ApniSec, you can:</p>
            <ul style="color: #ffffff; font-size: 16px; line-height: 1.8;">
              <li style="color: #ffffff; margin: 8px 0;">Report and track security issues</li>
              <li style="color: #ffffff; margin: 8px 0;">Manage cloud security assessments</li>
              <li style="color: #ffffff; margin: 8px 0;">Conduct vulnerability testing (VAPT)</li>
              <li style="color: #ffffff; margin: 8px 0;">Collaborate with your security team</li>
            </ul>
            <p style="color: #ffffff; font-size: 16px; margin: 15px 0;">Get started by logging in to your dashboard:</p>
            <a href="${dashboardUrl}/dashboard" style="display: inline-block; background-color: #06b6d4; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 25px 0; font-size: 16px;">Go to Dashboard</a>
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
