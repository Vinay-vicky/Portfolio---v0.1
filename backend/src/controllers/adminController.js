import {
  sendSmtpHealthProbeEmail,
  verifySmtpConnection,
} from "../services/contactEmailService.js";
import { db } from "../db/client.js";

const validMessageStatuses = new Set(["unread", "read", "archived"]);

const getMessageStats = async () => {
  const result = await db.execute({
    sql: `SELECT status, COUNT(*) AS count
          FROM contact_messages
          GROUP BY status`,
  });

  const stats = {
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
  };

  for (const row of result.rows) {
    const statusKey = String(row.status || "").toLowerCase();
    const count = Number(row.count || 0);

    if (validMessageStatuses.has(statusKey)) {
      stats[statusKey] = count;
      stats.total += count;
    }
  }

  return stats;
};

const buildStatusTimestamps = (status) => {
  const now = new Date().toISOString();

  if (status === "unread") {
    return {
      readAt: null,
      archivedAt: null,
    };
  }

  if (status === "read") {
    return {
      readAt: now,
      archivedAt: null,
    };
  }

  return {
    readAt: now,
    archivedAt: now,
  };
};

export const listContactMessages = async (req, res, next) => {
  try {
    const q = req.query?.q?.trim() || "";
    const statusParam = req.query?.status?.trim().toLowerCase() || "all";
    const requestedLimit = Number(req.query?.limit);
    const limit = Number.isFinite(requestedLimit)
      ? Math.max(1, Math.min(requestedLimit, 500))
      : 100;

    if (statusParam !== "all" && !validMessageStatuses.has(statusParam)) {
      return res.status(400).json({
        error: "Invalid status filter. Use all, unread, read, or archived.",
      });
    }

    const whereParts = [];
    const args = [];

    if (statusParam !== "all") {
      whereParts.push(`status = ?`);
      args.push(statusParam);
    }

    if (q) {
      whereParts.push(`(
        lower(name) LIKE lower(?)
        OR lower(email) LIKE lower(?)
        OR lower(phone) LIKE lower(?)
        OR lower(subject) LIKE lower(?)
        OR lower(message) LIKE lower(?)
      )`);

      args.push(...Array(5).fill(`%${q}%`));
    }

    const whereClause = whereParts.length > 0
      ? `WHERE ${whereParts.join(" AND ")}`
      : "";

    const result = await db.execute({
      sql: `SELECT id, name, email, phone, subject, message, status, read_at, archived_at, created_at
            FROM contact_messages
            ${whereClause}
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ?`,
      args: [...args, limit],
    });

    const stats = await getMessageStats();

    res.status(200).json({
      success: true,
      count: result.rows.length,
      stats,
      messages: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = req.body?.status?.trim().toLowerCase();

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Valid message id is required." });
    }

    if (!status || !validMessageStatuses.has(status)) {
      return res.status(400).json({
        error: "Invalid status. Use unread, read, or archived.",
      });
    }

    const { readAt, archivedAt } = buildStatusTimestamps(status);

    const updateResult = await db.execute({
      sql: `UPDATE contact_messages
            SET status = ?, read_at = ?, archived_at = ?
            WHERE id = ?`,
      args: [status, readAt, archivedAt, id],
    });

    if (!updateResult.rowsAffected) {
      return res.status(404).json({ error: "Message not found." });
    }

    const messageResult = await db.execute({
      sql: `SELECT id, name, email, phone, subject, message, status, read_at, archived_at, created_at
            FROM contact_messages
            WHERE id = ?`,
      args: [id],
    });

    const stats = await getMessageStats();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      data: messageResult.rows[0] || null,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllMessagesRead = async (_req, res, next) => {
  try {
    const now = new Date().toISOString();

    const updateResult = await db.execute({
      sql: `UPDATE contact_messages
            SET status = 'read', read_at = ?, archived_at = NULL
            WHERE status = 'unread'`,
      args: [now],
    });

    const stats = await getMessageStats();

    return res.status(200).json({
      success: true,
      message: `Marked ${updateResult.rowsAffected || 0} message(s) as read.`,
      rowsAffected: updateResult.rowsAffected || 0,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Valid message id is required." });
    }

    const deleteResult = await db.execute({
      sql: `DELETE FROM contact_messages WHERE id = ?`,
      args: [id],
    });

    if (!deleteResult.rowsAffected) {
      return res.status(404).json({ error: "Message not found." });
    }

    const stats = await getMessageStats();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export const runSmtpHealthCheck = async (req, res, next) => {
  try {
    const sendTestEmail = req.body?.sendTestEmail !== false;

    const connection = await verifySmtpConnection();
    if (!connection.ok) {
      return res.status(400).json({
        ok: false,
        error: "SMTP configuration check failed.",
        reason: connection.reason,
        missingKeys: connection.missingKeys || [],
      });
    }

    if (!sendTestEmail) {
      return res.status(200).json({
        ok: true,
        message: "SMTP connection verified successfully.",
        connection,
      });
    }

    const probe = await sendSmtpHealthProbeEmail({
      triggeredBy: req.admin?.role || "admin",
    });

    if (!probe.delivered) {
      return res.status(502).json({
        ok: false,
        error: "SMTP connection is valid, but sending the test email failed.",
        reason: probe.reason,
        missingKeys: probe.missingKeys || [],
        connection,
      });
    }

    return res.status(200).json({
      ok: true,
      message: `SMTP is healthy and test email was sent to ${probe.toAddress}.`,
      connection,
      probe,
    });
  } catch (error) {
    next(error);
  }
};
