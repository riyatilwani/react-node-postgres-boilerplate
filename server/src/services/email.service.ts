import sgMail from "@sendgrid/mail";
import { log } from "../startup/logger";

const sendingEmail = process.env.SENDING_EMAIL || "";

// Initialize SendGrid API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  log.error("SendGrid API Key is not defined in environment variables.");
}
sgMail.setApiKey(SENDGRID_API_KEY! || "SG.test");

/**
 * Creates a Reset Password Email
 * @param receiverEmail - Recipient's email address
 * @param resetTokenValue - Unique reset token
 * @returns SendGrid MailDataRequired object
 */
const createResetPasswordEmail = (
  receiverEmail: string,
  resetLink: string
): sgMail.MailDataRequired => {
  return {
    to: receiverEmail,
    from: sendingEmail,
    subject: "Reset Your Password",
    text: "Reset your password by clicking the link below.",
    html: `<p>You are receiving this because you (or someone else) requested the reset of the password for your account.<br><br>
    Please click on the following link, or paste this into your browser to complete the process:<br><br>
    <a href="${resetLink}">Reset Password</a><br><br>
    If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };
};

/**
 * Creates a Reset Confirmation Email
 * @param receiverEmail - Recipient's email address
 * @returns SendGrid MailDataRequired object
 */
const createResetConfirmationEmail = (
  receiverEmail: string
): sgMail.MailDataRequired => {
  return {
    to: receiverEmail,
    from: sendingEmail,
    subject: "Your Password Has Been Changed",
    text: "This is a confirmation that the password for your account has just been changed.",
    html: `<p>This is a confirmation that the password for your account <strong>${receiverEmail}</strong> has just been changed.</p>`,
  };
};

/**
 * Sends an email using SendGrid
 * @param email - SendGrid MailDataRequired object
 */
const sendEmail = async (email: sgMail.MailDataRequired) => {
  if (process.env.NODE_ENV !== "production") {
    email.mailSettings = {
      sandboxMode: {
        enable: true,
      },
    };
  }

  log.info("Sending email:", email);
  try {
    await sgMail.send(email);
    log.info(`Email sent to ${email.to}`);
  } catch (error: any) {
    log.error("Error sending email:", error);
    if (error.response) {
      log.error(error.response.body);
    }
    throw new Error("Failed to send email.");
  }
};

/**
 * Sends a Reset Password Email
 * @param receiverEmail - Recipient's email address
 * @param resetTokenValue - Unique reset token
 */
const sendResetPasswordEmail = async (
  receiverEmail: string,
  resetLink: string
) => {
  const email = createResetPasswordEmail(receiverEmail, resetLink);
  await sendEmail(email);
};

/**
 * Sends a Reset Confirmation Email
 * @param receiverEmail - Recipient's email address
 */
const sendResetConfirmationEmail = async (
  receiverEmail: string
) => {
  const email = createResetConfirmationEmail(receiverEmail);
  await sendEmail(email);
};

export default {
  sendResetPasswordEmail,
  sendResetConfirmationEmail,
};
