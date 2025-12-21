import { Resend } from "resend";
import {
  getWelcomeEmailTemplate,
  getIssueCreatedEmailTemplate,
  getProfileUpdatedEmailTemplate,
  getPasswordResetEmailTemplate,
  type IssueData,
} from "../email-templates";
import { EmailLogger } from "../utils/EmailLogger";

export class EmailService {
  private resend: Resend | null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.resend = this.apiKey ? new Resend(this.apiKey) : null;
  }

  async sendWelcomeEmail(email: string, name: string) {
    const fromEmail = process.env.EMAIL_FROM_WELCOME || "onboarding@resend.dev";
    const subject = "Welcome to ApniSec - Your Security Partner";
    const environment = process.env.VERCEL ? 'production' : 'development';
    
    if (!this.resend) {
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'welcome',
        to: email,
        from: fromEmail,
        subject,
        status: 'skipped',
        error: 'RESEND_API_KEY not configured',
        environment: environment as 'production' | 'development',
      });
      return;
    }

    const dashboardUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html: getWelcomeEmailTemplate(name, dashboardUrl),
      });
      
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'welcome',
        to: email,
        from: fromEmail,
        subject,
        status: 'sent',
        environment: environment as 'production' | 'development',
      });
    } catch (error: any) {
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'welcome',
        to: email,
        from: fromEmail,
        subject,
        status: 'failed',
        error: error?.message || 'Unknown error',
        environment: environment as 'production' | 'development',
      });
    }
  }

  async sendIssueCreatedEmail(email: string, issue: IssueData) {
    const fromEmail = process.env.EMAIL_FROM_ALERTS || "alerts@resend.dev";
    const subject = `New Issue Created: ${issue.title}`;
    const environment = process.env.VERCEL ? 'production' : 'development';
    
    if (!this.resend) {
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'issue_created',
        to: email,
        from: fromEmail,
        subject,
        status: 'skipped',
        error: 'RESEND_API_KEY not configured',
        environment: environment as 'production' | 'development',
      });
      return;
    }

    const dashboardUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html: getIssueCreatedEmailTemplate(issue, dashboardUrl),
      });
      
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'issue_created',
        to: email,
        from: fromEmail,
        subject,
        status: 'sent',
        environment: environment as 'production' | 'development',
      });
    } catch (error: any) {
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'issue_created',
        to: email,
        from: fromEmail,
        subject,
        status: 'failed',
        error: error?.message || 'Unknown error',
        environment: environment as 'production' | 'development',
      });
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

  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const fromEmail = process.env.EMAIL_FROM_ALERTS || "alerts@resend.dev";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    const subject = "Reset Your Password - ApniSec";
    const environment = process.env.VERCEL ? 'production' : 'development';
    
    if (!this.resend) {
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'welcome', // Reusing 'welcome' type for now, can extend EmailLog interface later
        to: email,
        from: fromEmail,
        subject,
        status: 'skipped',
        error: 'RESEND_API_KEY not configured',
        environment: environment as 'production' | 'development',
      });
      return;
    }

    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html: getPasswordResetEmailTemplate(name, resetUrl),
      });
      
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'welcome', // Can extend types later
        to: email,
        from: fromEmail,
        subject,
        status: 'sent',
        environment: environment as 'production' | 'development',
      });
    } catch (error: any) {
      EmailLogger.logEmail({
        timestamp: new Date().toISOString(),
        type: 'welcome',
        to: email,
        from: fromEmail,
        subject,
        status: 'failed',
        error: error?.message || 'Unknown error',
        environment: environment as 'production' | 'development',
      });
    }
  }
}
