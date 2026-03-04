"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import { checkRateLimit } from "@/lib/rateLimit";

type HireEnquiryInput = {
  fullName: string;
  email: string;
  phone?: string;
  eventType: string;
  preferredDate?: string;
  guestCount?: string;
  message?: string;
};

export async function submitHireEnquiry(input: HireEnquiryInput) {
  try {
    const { allowed } = await checkRateLimit(`hire:${input.email}`, 3, 60);
    if (!allowed) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }

    const supabase = createAdminClient();

    // Store as a lead
    await supabase.from("leads").insert({
      full_name: input.fullName,
      email: input.email,
      source: "hire_enquiry",
    }).throwOnError();

    // Email the admin
    const { data: admins } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "admin");

    const body = `
      <p><strong>Name:</strong> ${input.fullName}</p>
      <p><strong>Email:</strong> ${input.email}</p>
      ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ""}
      <p><strong>Event type:</strong> ${input.eventType}</p>
      ${input.preferredDate ? `<p><strong>Preferred date:</strong> ${input.preferredDate}</p>` : ""}
      ${input.guestCount ? `<p><strong>Number of guests:</strong> ${input.guestCount}</p>` : ""}
      ${input.message ? `<p><strong>Details:</strong> ${input.message}</p>` : ""}
    `;

    if (admins) {
      for (const admin of admins) {
        if (admin.email) {
          sendEmail({
            to: admin.email,
            subject: `Space hire enquiry: ${input.fullName} — ${input.eventType}`,
            html: body,
          }).catch(() => {});
        }
      }
    }

    // Confirmation to enquirer
    sendEmail({
      to: input.email,
      subject: "Enquiry received — The Career Spot",
      html: `<p>Hi ${input.fullName},</p><p>Thanks for your enquiry. We'll be in touch shortly to discuss hiring the space.</p><p>— The Career Spot team</p>`,
    }).catch(() => {});

    return { success: true };
  } catch (err) {
    console.error("Hire enquiry error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
