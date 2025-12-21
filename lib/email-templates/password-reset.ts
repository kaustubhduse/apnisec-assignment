export function getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #020617;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                🔒 Reset Your Password
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 16px; line-height: 1.6;">
                Hi <strong style="color: #22d3ee;">${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your <strong style="color: #22d3ee;">ApniSec</strong> account. 
              </p>
              
              <p style="margin: 0 0 30px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                Click the button below to reset your password. This link will expire in <strong style="color: #f59e0b;">15 minutes</strong>.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              
              <div style="padding: 15px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; margin-bottom: 30px;">
                <p style="margin: 0; color: #22d3ee; font-size: 14px; word-break: break-all;">
                  ${resetUrl}
                </p>
              </div>
              
              <div style="padding: 20px; background-color: #7f1d1d; border-left: 4px solid #dc2626; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #fca5a5; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact our support team immediately.
                </p>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                Need help? Contact us at <a href="mailto:support@apnisec.com" style="color: #22d3ee; text-decoration: none;">support@apnisec.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0f1e; border-top: 1px solid #1e293b;">
              <p style="margin: 0 0 10px 0; color: #475569; font-size: 12px; text-align: center; line-height: 1.5;">
                © 2024 ApniSec. All rights reserved.
              </p>
              <p style="margin: 0; color: #475569; font-size: 12px; text-align: center; line-height: 1.5;">
                Your trusted cybersecurity partner
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
