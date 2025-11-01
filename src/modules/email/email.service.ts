import { Injectable } from '@nestjs/common';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{ filename: string; path: string }>;
}

@Injectable()
export class EmailService {
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    // TODO: Implement actual email sending using nodemailer or AWS SES
    console.log('Email would be sent:', options);

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }

  async sendIssueAssignmentEmail(issueKey: string, assigneeName: string, assigneeEmail: string): Promise<void> {
    await this.sendEmail({
      to: assigneeEmail,
      subject: `You have been assigned to ${issueKey}`,
      body: `Hello ${assigneeName},\n\nYou have been assigned to issue ${issueKey}.\n\nView issue: ${process.env.APP_URL}/issues/${issueKey}`,
    });
  }

  async sendCommentNotificationEmail(issueKey: string, commenterName: string, recipientEmail: string, comment: string): Promise<void> {
    await this.sendEmail({
      to: recipientEmail,
      subject: `New comment on ${issueKey}`,
      body: `${commenterName} commented on ${issueKey}:\n\n${comment}\n\nView issue: ${process.env.APP_URL}/issues/${issueKey}`,
    });
  }

  async sendSprintStartEmail(sprintName: string, teamEmails: string[]): Promise<void> {
    await this.sendEmail({
      to: teamEmails,
      subject: `Sprint ${sprintName} has started`,
      body: `The sprint "${sprintName}" has started.\n\nGood luck team!`,
    });
  }

  async sendDailyDigest(userEmail: string, summary: {
    assignedIssues: number;
    recentComments: number;
    dueIssues: number;
  }): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'Your daily Jira digest',
      body: `Daily Summary:\n\n- Assigned issues: ${summary.assignedIssues}\n- Recent comments: ${summary.recentComments}\n- Due soon: ${summary.dueIssues}`,
    });
  }
}
