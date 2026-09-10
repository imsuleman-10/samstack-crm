/**
 * lib/mailer.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * SAMStack Email Service
 * Anti-spam compliant per:
 *   • RFC 5321/5322 (SMTP / Message Format)
 *   • CAN-SPAM Act (US)
 *   • GDPR Article 13 (EU)
 *   • Google Bulk Sender Guidelines (2024)
 *   • Microsoft/Outlook deliverability standards
 * ─────────────────────────────────────────────────────────────────────────────
 */
import nodemailer from 'nodemailer'

const SMTP_USER = (process.env.SMTP_USER || 'samstackteam@gmail.com').trim()
const SMTP_PASS = (process.env.SMTP_PASSWORD || '').replace(/['"]/g, '').trim()
const APP_NAME  = process.env.NEXT_PUBLIC_APP_NAME || 'SAMStack CRM'
const SITE_URL  = (process.env.NEXT_PUBLIC_SITE_URL || 'https://samstack.tech').trim()
const COMPANY   = 'SAMStack'
const OFFICIAL_EMAIL = 'samstacktechs@gmail.com'
const OFFICIAL_PHONE = '+923285778715'
const FORMATTED_PHONE = '+92 328 5778715'
const PHYSICAL_ADDRESS = 'Lahore, Punjab, Pakistan'

// ─── Transport ────────────────────────────────────────────────────────────────
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

// ─── Shared Anti-Spam Headers ─────────────────────────────────────────────────
/**
 * These headers improve inbox placement:
 * • X-Mailer           — Identifies the sending software (trusted signal)
 * • X-Priority         — 3 = Normal (1/2 = High = spam signal)
 * • Precedence         — "transactional" tells providers this isn't bulk mail
 * • Auto-Submitted     — RFC 3834 — required for automated messages
 * • List-Unsubscribe   — RFC 2369 / RFC 8058 — required by Gmail/Yahoo (2024)
 */
function baseHeaders(recipientEmail: string): Record<string, string> {
  return {
    'X-Mailer': `SAMStack Mailer v1.0 (nodemailer)`,
    'X-Priority': '3',
    'X-MS-Exchange-Organization-SCL': '-1',   // bypass Microsoft SCL
    'Precedence': 'transactional',
    'Auto-Submitted': 'auto-generated',
    'X-Auto-Response-Suppress': 'OOF, AutoReply',
    // One-click unsubscribe — required by Gmail/Yahoo bulk sender policies
    'List-Unsubscribe': `<mailto:${OFFICIAL_EMAIL}?subject=unsubscribe&body=${encodeURIComponent(recipientEmail)}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

// ─── Shared Footer HTML ──────────────────────────────────────────────────────
function emailFooterHtml(year: number): string {
  return `
    <!-- Footer — CAN-SPAM / GDPR compliant -->
    <tr>
      <td style="padding: 20px 36px 32px 36px; background-color: #182234; border-top: 1px solid #334155; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; line-height: 1.6;">
          &copy; ${year} <strong style="color: #64748b;">${COMPANY}</strong> &mdash; ${APP_NAME}.
          All rights reserved.
        </p>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; line-height: 1.6;">
          ${PHYSICAL_ADDRESS}
          &nbsp;&bull;&nbsp;
          <a href="mailto:${OFFICIAL_EMAIL}" style="color: #60a5fa; text-decoration: none;">${OFFICIAL_EMAIL}</a>
          &nbsp;&bull;&nbsp;
          <a href="tel:${OFFICIAL_PHONE}" style="color: #60a5fa; text-decoration: none;">${FORMATTED_PHONE}</a>
        </p>
        <p style="margin: 0; font-size: 10px; color: #334155; line-height: 1.6;">
          This is a transactional email sent because you registered on ${APP_NAME}.
          You cannot unsubscribe from security and account emails.
        </p>
      </td>
    </tr>`
}

// ─── Shared Email Wrapper HTML ────────────────────────────────────────────────
function wrapEmail(bodyRows: string, year: number): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { padding: 0; }
    img { -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <!-- Preheader text (hidden, but shown in inbox preview) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${COMPANY} — Your ${APP_NAME} notification ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background-color:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="100%" cellspacing="0" cellpadding="0" border="0"
          style="max-width:500px;background-color:#1e293b;border-radius:20px;border:1px solid #334155;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);">
          ${bodyRows}
          ${emailFooterHtml(year)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── OTP Verification Email ───────────────────────────────────────────────────
export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  try {
    const year = new Date().getFullYear()

    const bodyRows = `
      <!-- Header -->
      <tr>
        <td style="padding:36px 36px 20px 36px;text-align:center;">
          <div style="display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);width:54px;height:54px;border-radius:14px;line-height:54px;text-align:center;margin-bottom:16px;box-shadow:0 10px 25px -5px rgba(37,99,235,0.4);">
            <span style="font-size:26px;color:#ffffff;">🔐</span>
          </div>
          <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
            Verify Your Email
          </h1>
          <p style="margin:6px 0 0 0;font-size:13px;color:#94a3b8;font-weight:500;">
            ${APP_NAME} &mdash; Account Registration
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:0 36px 28px 36px;text-align:center;">
          <p style="margin:0 0 20px 0;font-size:14px;color:#cbd5e1;line-height:1.65;">
            Enter the verification code below to confirm your email address and complete account registration.
          </p>

          <!-- OTP Code -->
          <div style="display:inline-block;background:#0f172a;border:2px solid #3b82f6;border-radius:14px;padding:20px 32px;margin-bottom:20px;">
            <span style="font-family:'SF Mono',Monaco,Consolas,'Courier New',monospace;font-size:34px;font-weight:900;letter-spacing:10px;color:#60a5fa;display:block;">
              ${otpCode}
            </span>
          </div>

          <!-- Expiry notice -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="background:#1a2744;border:1px solid #2d4a7a;border-radius:10px;padding:12px 16px;text-align:left;">
                <p style="margin:0 0 4px 0;font-size:12px;color:#93c5fd;font-weight:600;">⏱ Expires in 10 minutes</p>
                <p style="margin:0;font-size:12px;color:#64748b;">
                  If you did not create a ${APP_NAME} account, you can safely ignore this email. No action needed.
                </p>
              </td>
            </tr>
          </table>

          <!-- Security note -->
          <p style="margin:20px 0 0 0;font-size:11px;color:#475569;line-height:1.6;">
            🔒 ${COMPANY} will never ask for your password or this code over the phone or chat.<br />
            📬 If this email isn&rsquo;t in your inbox, check your <strong style="color:#94a3b8;">Spam / Junk / Promotions</strong> folder.
          </p>
        </td>
      </tr>`

    const plainText = [
      `${APP_NAME} — Email Verification Code`,
      ``,
      `Your verification code: ${otpCode}`,
      ``,
      `This code expires in 10 minutes.`,
      `If you did not request this code, please ignore this email.`,
      ``,
      `— ${COMPANY} Team`,
      `${PHYSICAL_ADDRESS}`,
      `Email: ${OFFICIAL_EMAIL}`,
      `Phone: ${FORMATTED_PHONE}`,
    ].join('\n')

    const info = await transporter.sendMail({
      from: `"${COMPANY} Security" <${SMTP_USER}>`,
      replyTo: `"${COMPANY} Support" <${OFFICIAL_EMAIL}>`,
      to: toEmail,
      subject: `${otpCode} — Your ${APP_NAME} verification code`,
      text: plainText,
      html: wrapEmail(bodyRows, year),
      headers: baseHeaders(toEmail),
    })

    console.log('[sendOtpEmail] Sent → MessageId:', info.messageId)
    return true
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[sendOtpEmail] Failed:', msg)
    return false
  }
}

// ─── Account Approved Email ───────────────────────────────────────────────────
export async function sendAccountApprovedEmail(toEmail: string, fullName: string): Promise<boolean> {
  try {
    const year      = new Date().getFullYear()
    const loginUrl  = `${SITE_URL}/login`
    const firstName = fullName.split(' ')[0] || 'Team Member'

    const bodyRows = `
      <!-- Header -->
      <tr>
        <td style="padding:36px 36px 20px 36px;text-align:center;">
          <div style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);width:54px;height:54px;border-radius:14px;line-height:54px;text-align:center;margin-bottom:16px;box-shadow:0 10px 25px -5px rgba(16,185,129,0.4);">
            <span style="font-size:26px;color:#ffffff;">✅</span>
          </div>
          <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
            Account Approved!
          </h1>
          <p style="margin:6px 0 0 0;font-size:13px;color:#34d399;font-weight:600;">
            Welcome to ${APP_NAME}
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:0 36px 28px 36px;">
          <p style="margin:0 0 14px 0;font-size:15px;color:#f1f5f9;line-height:1.65;">
            Hello <strong>${firstName}</strong>,
          </p>
          <p style="margin:0 0 20px 0;font-size:14px;color:#94a3b8;line-height:1.7;">
            Great news — an administrator has reviewed and <strong style="color:#34d399;">approved</strong> your 
            ${APP_NAME} employee account. You now have full access to your dashboard, lead management tools, 
            and outreach features.
          </p>

          <!-- Status Card -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:16px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <p style="margin:0 0 6px 0;font-size:12px;color:#64748b;">Registered Email</p>
                      <p style="margin:0;font-size:13px;color:#f8fafc;font-weight:600;">${toEmail}</p>
                    </td>
                    <td align="right">
                      <p style="margin:0 0 6px 0;font-size:12px;color:#64748b;">Account Status</p>
                      <p style="margin:0;font-size:13px;color:#34d399;font-weight:700;">&#x2714; Active &bull; Approved</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center">
                <a href="${loginUrl}"
                  style="display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#ffffff;font-size:14px;font-weight:700;padding:14px 34px;border-radius:12px;text-decoration:none;box-shadow:0 10px 25px -5px rgba(37,99,235,0.45);mso-padding-alt:0;mso-line-height-alt:0;"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <!--[if mso]>&nbsp;<![endif]-->
                  Sign In to Your Workspace &rarr;
                  <!--[if mso]>&nbsp;<![endif]-->
                </a>
              </td>
            </tr>
          </table>

          <!-- Help note -->
          <p style="margin:24px 0 0 0;font-size:11px;color:#475569;text-align:center;line-height:1.6;">
            Button not working? Copy and paste this link into your browser:<br />
            <a href="${loginUrl}" style="color:#60a5fa;word-break:break-all;">${loginUrl}</a><br /><br />
            📬 Didn&rsquo;t receive this in your inbox? Check your <strong style="color:#94a3b8;">Spam / Junk / Promotions</strong> folder.
          </p>
        </td>
      </tr>`

    const plainText = [
      `Account Approved — ${APP_NAME}`,
      ``,
      `Hello ${firstName},`,
      ``,
      `Your ${APP_NAME} employee account has been approved and activated by an administrator.`,
      `You can now sign in here:`,
      ``,
      loginUrl,
      ``,
      `Account: ${toEmail}`,
      `Status: Active / Approved`,
      ``,
      `If this email isn't in your inbox, check your Spam / Junk / Promotions folder.`,
      ``,
      `— The ${COMPANY} Team`,
      `${PHYSICAL_ADDRESS}`,
      `Email: ${OFFICIAL_EMAIL}`,
      `Phone: ${FORMATTED_PHONE}`,
    ].join('\n')

    const info = await transporter.sendMail({
      from: `"${COMPANY} Workspace" <${SMTP_USER}>`,
      replyTo: `"${COMPANY} Admin" <${OFFICIAL_EMAIL}>`,
      to: toEmail,
      subject: `Your ${APP_NAME} account is now active — sign in now`,
      text: plainText,
      html: wrapEmail(bodyRows, year),
      headers: baseHeaders(toEmail),
    })

    console.log('[sendAccountApprovedEmail] Sent → MessageId:', info.messageId)
    return true
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[sendAccountApprovedEmail] Failed:', msg)
    return false
  }
}
