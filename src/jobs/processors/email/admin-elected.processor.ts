import type { Job } from "bullmq";
import type { AdminElectedPayload } from "@/jobs/types";
import { FROM_EMAIL, getMailer } from "@/lib/mailer";
import { ORGANISATION_NAME } from "@/config/contants";

export async function processAdminElected(
  job: Job<AdminElectedPayload>,
): Promise<void> {
  const { name, email } = job.data;
  const mailer = getMailer();

  await mailer.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: `You've been elected as an Admin on ${ORGANISATION_NAME}`,
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <tr>
              <td style="background:#f97316;padding:32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:.5px;">
                  ${ORGANISATION_NAME}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 40px 24px;">
                <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">
                  Congratulations, ${name}! 🎉
                </h2>
                <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
                  You have been granted <strong>Admin access</strong> on
                  <strong>${ORGANISATION_NAME}</strong>. You can now log in to the
                  admin dashboard to manage deals, stores, categories, and more.
                </p>
                <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                  If you believe this was assigned by mistake, please contact our
                  support team immediately.
                </p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard"
                  style="display:inline-block;background:#f97316;color:#fff;
                         text-decoration:none;padding:12px 28px;border-radius:6px;
                         font-size:15px;font-weight:600;">
                  Go to Dashboard →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 32px;border-top:1px solid #f3f4f6;">
                <p style="margin:0;color:#9ca3af;font-size:13px;">
                  You received this email because an admin action was performed on
                  your account at ${ORGANISATION_NAME}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim(),
    text: `Congratulations, ${name}! You have been granted Admin access on ${ORGANISATION_NAME}. Log in at ${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard. If this was a mistake, contact support immediately.`,
  });
}
