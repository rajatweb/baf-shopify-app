import "dotenv/config";

import nodemailer from "nodemailer";
import { emailTemplates } from './emailTemplates';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || "support@indusenigma.net",
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  // Template-based email methods
  async sendWelcomeEmail(to: string, shopName: string): Promise<void> {
    const template = emailTemplates.welcome;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ shopName })
    });
  }

  async sendErrorNotification(to: string, shopName: string, error: string): Promise<void> {
    const template = emailTemplates.errorNotification;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ error, shopName })
    });
  }

  async sendTrialEndingEmail(to: string, shopName: string, daysLeft: number): Promise<void> {
    const template = emailTemplates.trialEnding;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ shopName, daysLeft })
    });
  }

  async sendAccountDeactivatedEmail(to: string, shopName: string): Promise<void> {
    const template = emailTemplates.accountDeactivated;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ shopName })
    });
  }

  async sendPasswordResetEmail(to: string, shopName: string, resetLink: string): Promise<void> {
    const template = emailTemplates.passwordReset;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ shopName, resetLink })
    });
  }

  async sendPlanUpgradedEmail(to: string, shopName: string, planName: string): Promise<void> {
    const template = emailTemplates.planUpgraded;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ shopName, planName })
    });
  }

  async sendPlanDowngradedEmail(to: string, shopName: string): Promise<void> {
    const template = emailTemplates.planDowngraded;
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html({ shopName })
    });
  }
}

export const emailService = new EmailService();
