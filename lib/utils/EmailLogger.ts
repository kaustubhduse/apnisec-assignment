export interface EmailLog {
  timestamp: string;
  type: 'welcome' | 'issue_created' | 'profile_updated';
  to: string;
  from: string;
  subject: string;
  status: 'sent' | 'failed' | 'skipped';
  error?: string;
  environment: 'development' | 'production';
}

export class EmailLogger {
  private static logs: EmailLog[] = [];

  static logEmail(log: EmailLog) {
    this.logs.push(log);
    
    const border = '='.repeat(80);
    const statusEmoji = log.status === 'sent' ? '✅' : log.status === 'failed' ? '❌' : '⚠️';
    
    console.log('\n' + border);
    console.log(`${statusEmoji} EMAIL ${log.status.toUpperCase()}: ${log.type}`);
    console.log(border);
    console.log(`📧 To:          ${log.to}`);
    console.log(`📤 From:        ${log.from}`);
    console.log(`📝 Subject:     ${log.subject}`);
    console.log(`⏰ Timestamp:   ${log.timestamp}`);
    console.log(`🌍 Environment: ${log.environment}`);
    
    if (log.error) {
      console.log(`❗ Error:       ${log.error}`);
    }
    
    console.log(border + '\n');
  }

  static getRecentLogs(limit: number = 10): EmailLog[] {
    return this.logs.slice(-limit);
  }

  static getAllLogs(): EmailLog[] {
    return this.logs;
  }

  static clearLogs() {
    this.logs = [];
  }
}
