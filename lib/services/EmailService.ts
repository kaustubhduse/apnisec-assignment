import { Resend } from 'resend';

export class EmailService {
  private resend: Resend | null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.resend = this.apiKey ? new Resend(this.apiKey) : null;
    
    if (!this.apiKey) {
      console.warn('RESEND_API_KEY is not configured. Email sending will be disabled.');
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    if (!this.resend) {
      console.warn('Email service not configured. Skipping welcome email.');
      return;
    }
    
    await this.resend.emails.send({
      from: 'onboarding@apnisec.com',
      to: email,
      subject: 'Welcome to ApniSec',
      html: `
        <h2>Welcome, ${name}</h2>
        <p>Thanks for joining ApniSec. We're excited to have you.</p>
      `,
    });
  }

  async sendIssueCreatedEmail(
    email: string,
    issue: { type: string; title: string; description: string }
  ) {
    if (!this.resend) {
      console.warn('Email service not configured. Skipping issue notification email.');
      return;
    }
    
    await this.resend.emails.send({
      from: 'alerts@apnisec.com',
      to: email,
      subject: 'New Issue Created',
      html: `
        <h3>Issue Created</h3>
        <p><b>Type:</b> ${issue.type}</p>
        <p><b>Title:</b> ${issue.title}</p>
        <p>${issue.description}</p>
      `,
    });
  }
}
