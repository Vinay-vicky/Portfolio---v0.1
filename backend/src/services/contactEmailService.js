import nodemailer from "nodemailer";

const requiredEnvKeys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_RECEIVER_EMAIL",
];

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;

  return fallback;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getMissingMailKeys = () =>
  requiredEnvKeys.filter((key) => !process.env[key] || process.env[key].trim() === "");

const buildMailConfig = () => {
  const missingMailKeys = getMissingMailKeys();

  if (missingMailKeys.length > 0) {
    return {
      ok: false,
      reason: `Missing mail configuration: ${missingMailKeys.join(", ")}`,
      missingKeys: missingMailKeys,
    };
  }

  const smtpHost = process.env.SMTP_HOST.trim();
  const smtpPort = Number(process.env.SMTP_PORT);
  const smtpUser = process.env.SMTP_USER.trim();
  const smtpPass = process.env.SMTP_PASS.trim();
  const toAddress = process.env.CONTACT_RECEIVER_EMAIL.trim();
  const fromAddress =
    process.env.SMTP_FROM?.trim() || `Portfolio Contact <${smtpUser}>`;
  const secure = parseBoolean(process.env.SMTP_SECURE, smtpPort === 465);

  if (!Number.isFinite(smtpPort) || smtpPort <= 0) {
    return {
      ok: false,
      reason: "Invalid SMTP_PORT value.",
      missingKeys: [],
    };
  }

  return {
    ok: true,
    config: {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      toAddress,
      fromAddress,
      secure,
    },
  };
};

const createMailTransport = () => {
  const configResult = buildMailConfig();

  if (!configResult.ok) {
    return configResult;
  }

  const transporter = nodemailer.createTransport({
    host: configResult.config.smtpHost,
    port: configResult.config.smtpPort,
    secure: configResult.config.secure,
    auth: {
      user: configResult.config.smtpUser,
      pass: configResult.config.smtpPass,
    },
  });

  return {
    ok: true,
    config: configResult.config,
    transporter,
  };
};

export const verifySmtpConnection = async () => {
  const transportResult = createMailTransport();

  if (!transportResult.ok) {
    return transportResult;
  }

  try {
    await transportResult.transporter.verify();

    return {
      ok: true,
      host: transportResult.config.smtpHost,
      port: transportResult.config.smtpPort,
      secure: transportResult.config.secure,
      toAddress: transportResult.config.toAddress,
      fromAddress: transportResult.config.fromAddress,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error.message || "Unable to verify SMTP configuration.",
      missingKeys: [],
    };
  }
};

export const sendSmtpHealthProbeEmail = async ({ triggeredBy = "admin" } = {}) => {
  const transportResult = createMailTransport();

  if (!transportResult.ok) {
    return {
      delivered: false,
      reason: transportResult.reason,
      missingKeys: transportResult.missingKeys,
    };
  }

  const sentAt = new Date().toISOString();

  try {
    const info = await transportResult.transporter.sendMail({
      from: transportResult.config.fromAddress,
      to: transportResult.config.toAddress,
      subject: "[Portfolio] SMTP health check",
      text: `SMTP health check was triggered by ${triggeredBy} at ${sentAt}.`,
      html: `<p>SMTP health check was triggered by <strong>${escapeHtml(
        triggeredBy
      )}</strong> at <strong>${escapeHtml(sentAt)}</strong>.</p>`,
    });

    return {
      delivered: true,
      messageId: info.messageId,
      toAddress: transportResult.config.toAddress,
      sentAt,
    };
  } catch (error) {
    return {
      delivered: false,
      reason: error.message || "Failed to send SMTP health check email.",
      missingKeys: [],
    };
  }
};

export const sendContactNotificationEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
  submittedAt,
}) => {
  const transportResult = createMailTransport();

  if (!transportResult.ok) {
    return {
      delivered: false,
      reason: transportResult.reason,
      missingKeys: transportResult.missingKeys,
    };
  }

  const normalizedSubject = subject?.trim()
    ? subject.trim()
    : `New portfolio message from ${name}`;

  const sentAt = submittedAt || new Date().toISOString();

  const textBody = [
    "You received a new portfolio contact message:",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Subject: ${normalizedSubject}`,
    `Sent at: ${sentAt}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: Inter, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin: 0 0 10px;">New portfolio contact message</h2>
      <p style="margin: 0 0 12px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 12px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 12px;"><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
      <p style="margin: 0 0 12px;"><strong>Subject:</strong> ${escapeHtml(normalizedSubject)}</p>
      <p style="margin: 0 0 16px;"><strong>Sent at:</strong> ${escapeHtml(sentAt)}</p>
      <div style="padding: 14px; border: 1px solid #dbeafe; border-radius: 10px; background: #f8fbff; white-space: pre-wrap;">${escapeHtml(
        message
      )}</div>
    </div>
  `;

  const info = await transportResult.transporter.sendMail({
    from: transportResult.config.fromAddress,
    to: transportResult.config.toAddress,
    replyTo: email,
    subject: `[Portfolio] ${normalizedSubject}`,
    text: textBody,
    html: htmlBody,
  });

  return {
    delivered: true,
    messageId: info.messageId,
  };
};
