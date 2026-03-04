const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function layout(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #F0EDE8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2F3D38; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid rgba(47,61,56,0.1); margin-bottom: 32px; }
    .logo { font-family: 'Georgia', serif; font-size: 24px; color: #2F3D38; text-decoration: none; }
    .logo span { color: #9BA298; }
    .content { padding-bottom: 32px; }
    h1 { font-family: 'Georgia', serif; font-size: 28px; margin: 0 0 16px 0; color: #2F3D38; font-weight: normal; }
    p { font-size: 15px; line-height: 1.6; color: rgba(47,61,56,0.7); margin: 0 0 16px 0; }
    .button { display: inline-block; background: #2F3D38; color: #F0EDE8 !important; padding: 14px 28px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin: 8px 0; }
    .button-camel { background: #B8A88A; color: #2F3D38 !important; }
    .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid rgba(47,61,56,0.06); }
    .detail-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4); min-width: 100px; }
    .detail-value { font-size: 14px; color: #2F3D38; }
    .info-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid rgba(47,61,56,0.08); }
    .footer { text-align: center; padding-top: 32px; border-top: 1px solid rgba(47,61,56,0.1); }
    .footer p { font-size: 12px; color: rgba(47,61,56,0.35); }
    .footer a { color: rgba(47,61,56,0.5); text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${APP_URL}" class="logo">THE <b>SP<span>O</span>T</b></a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>The Career Spot, 14 King Square, BS2 8JH, Bristol</p>
      <p>Questions? <a href="mailto:thecareerspot0@mail.com">thecareerspot0@mail.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── APPLICATION EMAILS ───

export function applicationReceivedEmail(name: string) {
  return layout(`
    <h1>Application received</h1>
    <p>Hi ${name},</p>
    <p>Thanks for applying to join The Spot. We review every application personally and will be in touch within a few days.</p>
    <p>In the meantime, if you have any questions, feel free to reply to this email.</p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 24px;">The Spot Team</p>
  `);
}

export function applicationUnderReviewEmail(name: string) {
  return layout(`
    <h1>Your application is being reviewed</h1>
    <p>Hi ${name},</p>
    <p>Just a quick note to let you know your membership application is currently being reviewed by the team.</p>
    <p>We'll be in touch soon with a decision. Hang tight.</p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 24px;">The Spot Team</p>
  `);
}

export function applicationApprovedEmail(name: string, startsAt: string, expiresAt: string) {
  const start = new Date(startsAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const expiry = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return layout(`
    <h1>You're approved</h1>
    <p>Hi ${name},</p>
    <p>Your membership application has been approved. Welcome to The Spot. Your monthly membership is now active.</p>
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Membership</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">Monthly (24/7 Access)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Starts</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${start}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Expires</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${expiry}</td>
        </tr>
      </table>
    </div>
    <p>Your QR code for check-in is available in your dashboard:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${APP_URL}/dashboard/membership" class="button">View Dashboard</a>
    </p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 24px;">The Spot Team</p>
  `);
}

export function applicationRejectedEmail(name: string) {
  return layout(`
    <h1>Application update</h1>
    <p>Hi ${name},</p>
    <p>Thanks again for your interest in joining The Spot. After reviewing your application, we're not able to offer a membership at this time.</p>
    <p>This doesn't mean you can't use The Spot. You're always welcome to book a day pass and work with us whenever you like.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${APP_URL}/day-pass" class="button button-camel">Book a Day Pass</a>
    </p>
    <p>If you'd like to discuss this further, just reply to this email.</p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 24px;">The Spot Team</p>
  `);
}

// ─── PAYMENT LINK EMAIL ───

export function paymentLinkEmail(name: string, paymentUrl: string) {
  return layout(`
    <h1>Complete your membership</h1>
    <p>Hi ${name},</p>
    <p>Your membership application has been approved. Use the link below to complete payment and activate your 30-day membership.</p>
    <p style="text-align: center; margin: 28px 0;">
      <a href="${paymentUrl}" class="button">Complete Payment</a>
    </p>
    <p>Once payment is confirmed, you'll receive your membership QR code and have 24/7 access to the workspace.</p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 24px;">The Spot Team</p>
  `);
}

// ─── MEMBERSHIP ACTIVATED ───

export function membershipActivatedEmail(name: string, expiresAt: string) {
  const expiry = new Date(expiresAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return layout(`
    <h1>Membership activated</h1>
    <p>Hi ${name},</p>
    <p>Your monthly membership is now active. You have 24/7 access to The Spot workspace.</p>
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Membership</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">Monthly (24/7 Access)</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Expires</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${expiry}</td>
        </tr>
      </table>
    </div>
    <p>Your QR code for check-in is available in your dashboard:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${APP_URL}/dashboard/membership" class="button">View Dashboard</a>
    </p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 24px;">The Spot Team</p>
  `);
}

// ─── DAY PASS EMAILS ───

export function dayPassConfirmationEmail(
  name: string,
  bookingDate: string,
  qrCode: string
) {
  const formattedDate = new Date(bookingDate + "T00:00:00").toLocaleDateString(
    "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  return layout(`
    <h1>Day pass confirmed</h1>
    <p>Hi ${name || "there"},</p>
    <p>Your day pass for The Spot is confirmed. Here are the details:</p>
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Date</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Duration</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">10 hours</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Check-in Code</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right; font-family: monospace;">${qrCode.slice(0, 8).toUpperCase()}</td>
        </tr>
      </table>
    </div>
    <p>Show your QR code at check-in. You can find it in your dashboard:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${APP_URL}/dashboard/bookings" class="button">View My Bookings</a>
    </p>
    <p style="font-size: 13px; color: rgba(47,61,56,0.4);">14 King Square, BS2 8JH, Bristol</p>
    <p style="color: rgba(47,61,56,0.4); font-size: 13px; margin-top: 16px;">The Spot Team</p>
  `);
}

// ─── ADMIN NOTIFICATION ───

export function adminNewApplicationEmail(
  applicantName: string,
  applicantEmail: string,
  applicationId: string
) {
  return layout(`
    <h1>New membership application</h1>
    <p>A new membership application has been submitted.</p>
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Name</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${applicantName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Email</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${applicantEmail}</td>
        </tr>
      </table>
    </div>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${APP_URL}/admin/applications/${applicationId}" class="button">Review Application</a>
    </p>
  `);
}

export function adminApplicationApprovedEmail(
  applicantName: string,
  applicantEmail: string,
  approvedBy: string
) {
  return layout(`
    <h1>Application approved</h1>
    <p>A membership application has been approved and the membership is now active.</p>
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Member</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${applicantName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Email</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${applicantEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Approved by</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${approvedBy}</td>
        </tr>
      </table>
    </div>
  `);
}

export function adminApplicationRejectedEmail(
  applicantName: string,
  applicantEmail: string,
  rejectedBy: string
) {
  return layout(`
    <h1>Application rejected</h1>
    <p>A membership application has been rejected.</p>
    <div class="info-box">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Applicant</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${applicantName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Email</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${applicantEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(47,61,56,0.4);">Rejected by</td>
          <td style="padding: 8px 0; font-size: 14px; text-align: right;">${rejectedBy}</td>
        </tr>
      </table>
    </div>
  `);
}
