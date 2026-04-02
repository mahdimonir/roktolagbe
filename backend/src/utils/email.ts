import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async (opts: {
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: `"RoktoLagbe" <${env.EMAIL_FROM}>`,
    ...opts,
  });
};
