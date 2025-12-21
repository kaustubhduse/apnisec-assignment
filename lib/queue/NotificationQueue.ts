import { getRabbitMQChannel } from './rabbitmq';
import { EmailService } from '../services/EmailService';

export interface EmailNotification {
  type: 'welcome' | 'issue_created' | 'profile_updated';
  to: string;
  data: any;
}

export class NotificationQueue {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async publishEmailNotification(notification: EmailNotification) {
    const channel = await getRabbitMQChannel();

    // In serverless environments (like Vercel), consumers don't run reliably
    // So we send emails directly instead of queueing them
    const isServerless = process.env.VERCEL || process.env.NEXT_RUNTIME === 'edge';
    const useQueue = process.env.USE_EMAIL_QUEUE === 'true';
    
    if (!channel || (isServerless && !useQueue)){
      console.log('Sending email directly (serverless or queue unavailable)...');
      await this.processEmail(notification);
      return;
    }

    try{
      const message = JSON.stringify(notification);
      channel.publish(
        'notifications',
        'email',
        Buffer.from(message),
        { persistent: true }
      );
      console.log(`Email notification queued: ${notification.type}`);
    } 
    catch (error){
      console.error('Failed to publish to queue, sending directly:', error);
      await this.processEmail(notification);
    }
  }

  async startConsumer(){
    const channel = await getRabbitMQChannel();
    
    if (!channel){
      console.log('Queue consumer not started (RabbitMQ unavailable)');
      return;
    }

    console.log('Starting email notification consumer...');

    channel.consume('email_queue', async (msg) => {
      if (!msg) return;

      try{
        const notification: EmailNotification = JSON.parse(msg.content.toString());
        await this.processEmail(notification);
        channel.ack(msg);
        console.log(`Email processed: ${notification.type}`);
      } 
      catch (error){
        console.error('Error processing email:', error);
        channel.nack(msg, false, false); // Don't requeue
      }
    });
  }

  private async processEmail(notification: EmailNotification){
    console.log('\n[NotificationQueue] processEmail CALLED');
    console.log('   Type:', notification.type);
    console.log('   To:', notification.to);
    console.log('   Data:', JSON.stringify(notification.data));
    
    try{
      switch (notification.type) {
        case 'welcome':
          await this.emailService.sendWelcomeEmail(
            notification.to,
            notification.data.name
          );
          break;

        case 'issue_created':
          await this.emailService.sendIssueCreatedEmail(
            notification.to,
            notification.data
          );
          break;

        case 'profile_updated':
          await this.emailService.sendProfileUpdatedEmail(
            notification.to,
            notification.data.name
          );
          break;

        default:
          console.warn(`Unknown notification type: ${notification.type}`);
      }
    } 
    catch(error){
      console.error(`Error in processEmail for ${notification.type}:`, error);
      throw error;
    }
  }
}

export const notificationQueue = new NotificationQueue();
