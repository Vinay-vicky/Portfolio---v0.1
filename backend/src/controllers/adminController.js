import {
  sendSmtpHealthProbeEmail,
  verifySmtpConnection,
} from "../services/contactEmailService.js";

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
