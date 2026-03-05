"use server";

import { sendEmail } from "@/lib/email/sendEmail";
import { checkRateLimit } from "@/lib/rateLimit";

type ContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function submitContactForm(input: ContactInput) {
  try {
    const { allowed } = await checkRateLimit(`contact:${input.email}`, 3, 60);
    if (!allowed) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }

    const body = `
      <p><strong>Name:</strong> ${input.name}</p>
      <p><strong>Email:</strong> ${input.email}</p>
      ${input.subject ? `<p><strong>Subject:</strong> ${input.subject}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${input.message.replace(/\n/g, "<br>")}</p>
    `;

    sendEmail({
      to: "thecareerspot0@mail.com",
      subject: `Contact form: ${input.subject || "General Enquiry"} — ${input.name}`,
      html: body,
    }).catch(() => {});

    sendEmail({
      to: input.email,
      subject: "We got your message — The Career Spot",
      html: `<p>Hi ${input.name},</p><p>Thanks for getting in touch. We'll get back to you as soon as we can.</p><p>— The Career Spot team</p>`,
    }).catch(() => {});

    return { success: true };
  } catch (err) {
    console.error("Contact form error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
