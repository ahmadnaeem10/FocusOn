import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('email', () => ({
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpFrom: process.env.SMTP_FROM,
}));
