import nodemailer from "nodemailer";

// Lazy singleton — created once on first use
let _transporter: nodemailer.Transporter | null = null;

export function getMailer(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true", // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return _transporter;
}

export const FROM_EMAIL =
  process.env.SMTP_FROM ?? `"ShoppeeIndia" <noreply@shoppeeindia.com>`;
