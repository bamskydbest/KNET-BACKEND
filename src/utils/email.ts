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

  const host = process.env.SMTP_HOST || "smtp-relay.brevo.com";
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525; // default 2525 for Brevo
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn(
      "⚠️ Missing SMTP credentials — using console transport. Emails won't actually send."
    );
    transporter = nodemailer.createTransport({ jsonTransport: true });
  } else {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true only for 465, false for 587 or 2525
      auth: { user, pass },
      //  increase connection timeout for cloud servers like Render
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
    });
  }

  return transporter;
};

export const sendContactEmail = async (payload: MailPayload) => {
  const transporter = getTransporter();

  // Determine "from" dynamically
  const mailFrom =
    payload.html?.includes("Email:") && payload.text.match(/Email:\s*(.*)/)
      ? payload.text.match(/Email:\s*(.*)/)?.[1]?.trim() || process.env.EMAIL_FROM
      : process.env.EMAIL_FROM;

  try {
    const mail = await transporter.sendMail({
      from: mailFrom,
      to: payload.to || process.env.CONTACT_EMAIL,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    console.log("✅ Email sent:", mail.messageId);
    return mail;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err; 
  }
};
