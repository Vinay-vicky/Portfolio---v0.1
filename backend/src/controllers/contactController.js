import { db } from "../db/client.js";

export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone = "", subject = "", message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "name, email and message are required",
      });
    }

    await db.execute({
      sql: `INSERT INTO contact_messages (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)`,
      args: [name, email, phone, subject, message],
    });

    res.status(201).json({ success: true, message: "Message saved successfully." });
  } catch (error) {
    next(error);
  }
};
