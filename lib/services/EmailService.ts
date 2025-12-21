import { Resend } from "resend";
import {
  getWelcomeEmailTemplate,
  getIssueCreatedEmailTemplate,
  getProfileUpdatedEmailTemplate,
  type IssueData,
} from "../email-templates";

export class EmailService {
  private resend: Resend | null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.resend = this.apiKey ? new Resend(this.apiKey) : null;
  }

  async sendWelcomeEmail(email: string, name: string) {
    console.log('\n=== [EmailService] sendWelcomeEmail called ===');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Resend configured:', !!this.resend);
    console.log('API Key exists:', !!this.apiKey);
    
    if (!this.resend) {
      console.warn("⚠️ Email service not configured. RESEND_API_KEY missing. Skipping welcome email.");
      return;
    }

    const fromEmail = process.env.EMAIL_FROM_WELCOME || "onboarding@resend.dev";
    console.log('From email:', fromEmail);

    const dashboardUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Welcome to ApniSec - Your Security Partner",
        html: getWelcomeEmailTemplate(name, dashboardUrl),
      });
      console.log(`✅ Welcome email sent successfully to ${email}`);
      console.log('Resend result:', JSON.stringify(result));
    } catch (error: any) {
      console.error(`❌ Failed to send welcome email to ${email}:`);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Full error:', error);
      // Don't throw - just log to prevent breaking the flow
    }
  }

  async sendIssueCreatedEmail(email: string, issue: IssueData) {
    console.log('\n=== [EmailService] sendIssueCreatedEmail called ===');
    console.log('To:', email);
    console.log('Issue:', issue);
    console.log('Resend configured:', !!this.resend);
    
    if (!this.resend) {
      console.warn(
        "⚠️ Email service not configured. RESEND_API_KEY missing. Skipping issue notification email."
      );
      return;
    }

    const fromEmail = process.env.EMAIL_FROM_ALERTS || "alerts@resend.dev";
    console.log('From email:', fromEmail);
    const dashboardUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `New Issue Created: ${issue.title}`,
        html: getIssueCreatedEmailTemplate(issue, dashboardUrl),
      });
      console.log(
        `✅ Issue notification email sent successfully to ${email}`
      );
      console.log('Resend result:', JSON.stringify(result));
    } catch (error: any) {
      console.error(
        `❌ Failed to send issue notification email to ${email}:`
      );
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Full error:', error);
      // Don't throw - just log to prevent breaking the flow
    }
  }

  async sendProfileUpdatedEmail(email: string, data: { name: string }) {
    if (!this.resend) {
      console.warn(
        "Email service not configured. Skipping profile update email."
      );
      return;
    }

    const fromEmail = process.env.EMAIL_FROM_ALERTS || "alerts@resend.dev";
    const profileUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Profile Updated Successfully",
        html: getProfileUpdatedEmailTemplate(data.name, profileUrl),
      });
      console.log(`Profile update email sent successfully to ${email}`, result);
    } catch (error) {
      console.error(`Failed to send profile update email to ${email}:`, error);
      throw error;
    }
  }
}
