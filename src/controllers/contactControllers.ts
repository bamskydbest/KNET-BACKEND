import { Request, Response } from "express";
import Contact from "../models/Contact.js";
import { validateContact } from "../validation/contactSchema.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";
import { sendContactEmail } from "../utils/email.js";

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { value, error } = validateContact(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((d) => d.message).join(", ") });
    }

    const token = req.body.recaptchaToken;
    if (!token)
      return res.status(400).json({ error: "reCAPTCHA token missing" });

    const recaptchaOk = await verifyRecaptcha(token, req.ip);
    if (!recaptchaOk.success || (recaptchaOk.score && recaptchaOk.score < 0.3)) {
      return res.status(400).json({ error: "Failed reCAPTCHA verification" });
    }

    const contact = new Contact({
      name: value.name,
      company: value.company,
      email: value.email,
      phone: value.phone,
      country: value.country,
      message: value.comment,
    });

    await contact.save();

    // Respond immediately
    res.status(201).json({ message: "Contact received" });

    // Send email asynchronously
    sendContactEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_FROM,
      subject: `New contact from ${value.name}`,
      text: `
Name: ${value.name}
Company: ${value.company || "N/A"}
Email: ${value.email}
Phone: ${value.phone || "N/A"}
Country: ${value.country || "N/A"}

Message:
${value.comment}
      `,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${value.name}</p>
        <p><strong>Company:</strong> ${value.company || "N/A"}</p>
        <p><strong>Email:</strong> ${value.email}</p>
        <p><strong>Phone:</strong> ${value.phone || "N/A"}</p>
        <p><strong>Country:</strong> ${value.country || "N/A"}</p>
        <p><strong>Message:</strong><br>${value.comment}</p>
      `,
    }).catch((err) => console.error("Email sending failed:", err));

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error" });
    }
  }
};

