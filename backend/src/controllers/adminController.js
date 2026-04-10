import {
  sendSmtpHealthProbeEmail,
  verifySmtpConnection,
} from "../services/contactEmailService.js";
import { db } from "../db/client.js";

const validMessageStatuses = new Set(["unread", "read", "archived"]);
const validMessageSorts = new Set(["newest", "oldest", "name-az", "name-za"]);

const getMessageSortClause = (sortBy) => {
  if (sortBy === "oldest") {
    return "ORDER BY datetime(created_at) ASC, id ASC";
  }

  if (sortBy === "name-az") {
    return "ORDER BY lower(name) ASC, datetime(created_at) DESC, id DESC";
  }

  if (sortBy === "name-za") {
    return "ORDER BY lower(name) DESC, datetime(created_at) DESC, id DESC";
  }

  return "ORDER BY datetime(created_at) DESC, id DESC";
};

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
    const sortParam = req.query?.sort?.trim().toLowerCase() || "newest";
    const requestedPage = Number(req.query?.page);
    const requestedLimit = Number(req.query?.limit);

    const page = Number.isFinite(requestedPage)
      ? Math.max(1, Math.floor(requestedPage))
      : 1;

    const limit = Number.isFinite(requestedLimit)
      ? Math.max(1, Math.min(Math.floor(requestedLimit), 100))
      : 20;

    if (statusParam !== "all" && !validMessageStatuses.has(statusParam)) {
      return res.status(400).json({
        error: "Invalid status filter. Use all, unread, read, or archived.",
      });
    }

    if (!validMessageSorts.has(sortParam)) {
      return res.status(400).json({
        error: "Invalid sort option. Use newest, oldest, name-az, or name-za.",
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

    const countResult = await db.execute({
      sql: `SELECT COUNT(*) AS total
            FROM contact_messages
            ${whereClause}`,
      args,
    });

    const totalItems = Number(countResult.rows?.[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const orderByClause = getMessageSortClause(sortParam);

    const result = await db.execute({
      sql: `SELECT id, name, email, phone, subject, message, status, read_at, archived_at, created_at
            FROM contact_messages
            ${whereClause}
            ${orderByClause}
            LIMIT ? OFFSET ?`,
      args: [...args, limit, offset],
    });

    const stats = await getMessageStats();

    res.status(200).json({
      success: true,
      count: result.rows.length,
      stats,
      sort: sortParam,
      pagination: {
        page: safePage,
        limit,
        totalItems,
        totalPages,
        hasPreviousPage: safePage > 1,
        hasNextPage: safePage < totalPages,
      },
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
