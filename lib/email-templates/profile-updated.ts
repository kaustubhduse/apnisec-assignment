export function getProfileUpdatedEmailTemplate(name: string, profileUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 2px solid #06b6d4; border-radius: 12px; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; margin: 0; font-size: 32px; font-weight: bold;">✅ Profile Updated</h1>
          </div>
          <div style="line-height: 1.8; color: #ffffff;">
            <h2 style="color: #06b6d4; font-size: 24px; margin-bottom: 20px;">Hi ${name},</h2>
            <div style="background-color: #14532d; border: 2px solid #22c55e; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #22c55e; font-weight: 600; font-size: 16px;">✅ Your profile has been updated successfully.</p>
            </div>
            <p style="color: #ffffff; font-size: 16px; margin: 15px 0;">If you didn't make this change, please contact our support team immediately.</p>
            <a href="${profileUrl}/profile" style="display: inline-block; background-color: #06b6d4; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 25px 0; font-size: 16px;">View Profile</a>
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
