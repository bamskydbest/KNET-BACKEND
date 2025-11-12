import nodemailer from "nodemailer";

type MailPayload = {
  to?: string;
  subject: string;
  text: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn("⚠️ Missing SMTP credentials — using console transport.");
    transporter = nodemailer.createTransport({ jsonTransport: true });
  } else {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporter;
};

export const sendContactEmail = async (payload: MailPayload) => {
  const transporter = getTransporter();
  const mailFrom = payload.html?.includes("Email:")
    ? payload.text.match(/Email:\s*(.*)/)?.[1]?.trim() || process.env.EMAIL_FROM
    : process.env.EMAIL_FROM;

  const mail = await transporter.sendMail({
    from: mailFrom,
    to: payload.to || process.env.CONTACT_EMAIL,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  console.log("✅ Email sent:", mail.messageId);
  return mail;
};
