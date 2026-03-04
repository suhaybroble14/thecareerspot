"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  applicationReceivedEmail,
  adminNewApplicationEmail,
} from "@/lib/email/templates";
import { checkRateLimit } from "@/lib/rateLimit";
import type { MembershipApplication } from "@/lib/supabase/types";

type SubmitApplicationInput = {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
};

export async function submitApplication(input: SubmitApplicationInput) {
  try {
    const supabase = createAdminClient();

    // Rate limit: 3 applications per email per hour
    const { allowed } = await checkRateLimit(
      `app_submit:${input.email}`,
      3,
      60
    );
    if (!allowed) {
      return {
        success: false,
        error: "Too many submissions. Please try again later.",
      };
    }

    // Check for existing pending application with this email
    const { data: existing } = await supabase
      .from("membership_applications")
      .select("id, status")
      .eq("email", input.email)
      .in("status", ["submitted", "under_review"])
      .limit(1)
      .single();

    if (existing) {
      return {
        success: false,
        error: "You already have a pending application. We'll be in touch soon.",
      };
    }

    // Try to link to existing user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", input.email)
      .single();

    const { data: application, error } = await supabase
      .from("membership_applications")
      .insert({
        full_name: input.fullName,
        email: input.email,
        phone: input.phone || null,
        message: input.message || null,
        status: "submitted",
        user_id: profile?.id || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Application submission error:", error);
      return { success: false, error: error.message || "Something went wrong. Please try again." };
    }

    // Send confirmation email to applicant (non-blocking)
    sendEmail({
      to: input.email,
      subject: "Application received - The Spot",
      html: applicationReceivedEmail(input.fullName),
    }).catch(() => {});

    // Notify admins (non-blocking)
    const { data: admins } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "admin");

    if (admins) {
      for (const admin of admins) {
        if (admin.email) {
          sendEmail({
            to: admin.email,
            subject: `New application: ${input.fullName}`,
            html: adminNewApplicationEmail(
              input.fullName,
              input.email,
              application?.id || ""
            ),
          }).catch(() => {});
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Application submission unexpected error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message || "Something went wrong. Please try again." };
  }
}

export async function getMyApplications(): Promise<MembershipApplication[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch applications error:", error);
    return [];
  }

  return data as MembershipApplication[];
}
