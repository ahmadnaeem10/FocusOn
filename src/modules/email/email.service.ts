import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get('email');
    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: parseInt(emailConfig.smtpPort),
      secure: true,
      auth: {
        user: emailConfig.smtpEmail,
        pass: emailConfig.smtpPassword,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: {
        name: this.configService.get('email.smtpFrom'),
        address: this.configService.get('email.smtpEmail'),
      },
      to,
      subject,
      html: text,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to: ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}: ${error}`);
    }
  }
}
