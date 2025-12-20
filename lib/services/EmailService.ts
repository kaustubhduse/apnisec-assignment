import { Resend } from 'resend';
import { 
  getWelcomeEmailTemplate,
  getIssueCreatedEmailTemplate,
  getProfileUpdatedEmailTemplate,
  type IssueData
} from '../email-templates';

export class EmailService {
  private resend: Resend | null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.resend = this.apiKey ? new Resend(this.apiKey) : null;
  }

  async sendWelcomeEmail(email: string, name: string) {
    if (!this.resend) {
      console.warn('Email service not configured. Skipping welcome email.');
      return;
    }
    
    const fromEmail = process.env.EMAIL_FROM_WELCOME || 'onboarding@resend.dev';
    
    const dashboardUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Welcome to ApniSec - Your Security Partner',
        html: getWelcomeEmailTemplate(name, dashboardUrl),
      });
      console.log(`Welcome email sent successfully to ${email}`, result);
    } 
    catch(error){
      console.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }

  async sendIssueCreatedEmail(
    email: string,
    issue: IssueData
  ) {
    if (!this.resend) {
      console.warn('Email service not configured. Skipping issue notification email.');
      return;
    }
    
    const fromEmail = process.env.EMAIL_FROM_ALERTS || 'alerts@resend.dev';
    const dashboardUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `New Issue Created: ${issue.title}`,
        html: getIssueCreatedEmailTemplate(issue, dashboardUrl),
      });
      console.log(`Issue notification email sent successfully to ${email}`, result);
    } 
    catch(error){
      console.error(`Failed to send issue notification email to ${email}:`, error);
      throw error;
    }
  }

  async sendProfileUpdatedEmail(email: string, name: string) {
    if (!this.resend) {
      console.warn('Email service not configured. Skipping profile update email.');
      return;
    }
    
    const fromEmail = process.env.EMAIL_FROM_ALERTS || 'alerts@resend.dev';
    const profileUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    try {
      const result = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Profile Updated Successfully',
        html: getProfileUpdatedEmailTemplate(name, profileUrl),
      });
      console.log(`Profile update email sent successfully to ${email}`, result);
    } 
    catch(error){
      console.error(`Failed to send profile update email to ${email}:`, error);
      throw error;
    }
  }
}
