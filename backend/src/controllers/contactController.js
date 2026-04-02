import { db } from "../db/client.js";
import { sendContactNotificationEmail } from "../services/contactEmailService.js";

export const createContactMessage = async (req, res, next) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim();
    const phone = req.body?.phone?.trim() || "";
    const subject = req.body?.subject?.trim() || "";
    const message = req.body?.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "name, email and message are required",
      });
    }

    const submittedAt = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO contact_messages (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)`,
      args: [name, email, phone, subject, message],
    });

    let emailDelivered = false;
    let emailIssue = null;

    try {
      const mailResult = await sendContactNotificationEmail({
        name,
        email,
        phone,
        subject,
        message,
        submittedAt,
      });

      emailDelivered = Boolean(mailResult.delivered);
      if (!emailDelivered && mailResult.reason) {
        emailIssue = mailResult.reason;
      }
    } catch (mailError) {
      emailIssue = mailError.message;
      console.error("Contact email delivery failed:", mailError);
    }

    const responseMessage = emailDelivered
      ? "Message sent successfully and stored in database."
      : "Message stored in database, but email notification could not be delivered. Please verify SMTP settings.";

    res.status(201).json({
      success: true,
      emailDelivered,
      message: responseMessage,
      ...(emailIssue ? { emailIssue } : {}),
    });
  } catch (error) {
    next(error);
  }
};
