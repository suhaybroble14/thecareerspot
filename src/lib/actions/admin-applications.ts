"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  applicationUnderReviewEmail,
  applicationApprovedEmail,
  applicationRejectedEmail,
  adminApplicationApprovedEmail,
  adminApplicationRejectedEmail,
} from "@/lib/email/templates";
import { logAudit } from "@/lib/audit";
import type { MembershipApplication } from "@/lib/supabase/types";

export async function getAllApplications(
  statusFilter?: string
): Promise<MembershipApplication[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from("membership_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fetch applications error:", error);
    return [];
  }

  return data as MembershipApplication[];
}

export async function getApplicationDetail(id: string) {
  const supabase = createAdminClient();

  const [appRes, notesRes] = await Promise.all([
    supabase
      .from("membership_applications")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("admin_notes")
      .select("*")
      .eq("target_type", "application")
      .eq("target_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    application: appRes.data as MembershipApplication | null,
    notes: notesRes.data || [],
  };
}

export async function getCapacityPreview() {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { count } = await supabase
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("membership_type", "30_day")
    .eq("is_active", true)
    .gte("expires_at", now);

  const activeMonthly = count ?? 0;
  const newCapacity = 14 - (activeMonthly + 1);

  return {
    currentActiveMonthly: activeMonthly,
    afterApproval: activeMonthly + 1,
    newDayPassCapacity: Math.max(0, newCapacity),
  };
}

export async function updateApplicationStatus(
  id: string,
  status: "under_review" | "approved" | "rejected"
) {
  const supabase = createAdminClient();
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  // Get application for email
  const { data: application } = await supabase
    .from("membership_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!application) {
    return { success: false, error: "Application not found" };
  }

  const { error } = await supabase
    .from("membership_applications")
    .update({
      status,
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update application status error:", error);
    return { success: false, error: "Failed to update status" };
  }

  // Audit log
  if (user) {
    logAudit(
      user.id,
      `application.${status}` as "application.approve" | "application.reject" | "application.under_review",
      "application",
      id,
      { applicant_email: application.email }
    ).catch(() => {});
  }

  // Get admin profile for notification emails
  const adminEmail = user?.email || "";
  const { data: adminProfile } = user
    ? await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()
    : { data: null };
  const adminName = adminProfile?.full_name || adminProfile?.email || "Admin";

  // Get all admins for notifications
  const { data: admins } = await supabase
    .from("profiles")
    .select("email")
    .eq("role", "admin");

  // Send email based on new status
  if (status === "under_review") {
    sendEmail({
      to: application.email,
      subject: "Application update - The Spot",
      html: applicationUnderReviewEmail(application.full_name),
    }).catch(() => {});
  } else if (status === "approved") {
    // Create membership directly on approval
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .insert({
        user_id: application.user_id,
        membership_type: "30_day",
        amount_paid: 0,
        purchased_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select("id")
      .single();

    if (membershipError) {
      console.error("Membership creation error:", membershipError);
      // Don't fail the whole operation - application is already approved
    }

    // Email applicant with membership details
    sendEmail({
      to: application.email,
      subject: "You're approved - The Spot",
      html: applicationApprovedEmail(
        application.full_name,
        now.toISOString(),
        expiresAt.toISOString()
      ),
    }).catch(() => {});

    // Notify all admins
    if (admins) {
      for (const admin of admins) {
        if (admin.email && admin.email !== adminEmail) {
          sendEmail({
            to: admin.email,
            subject: `Application approved: ${application.full_name}`,
            html: adminApplicationApprovedEmail(
              application.full_name,
              application.email,
              adminName
            ),
          }).catch(() => {});
        }
      }
    }

    if (membership) {
      logAudit(
        user?.id || "",
        "membership.created",
        "membership",
        membership.id,
        { applicant: application.email }
      ).catch(() => {});
    }
  } else if (status === "rejected") {
    sendEmail({
      to: application.email,
      subject: "Application update - The Spot",
      html: applicationRejectedEmail(application.full_name),
    }).catch(() => {});

    // Notify all admins
    if (admins) {
      for (const admin of admins) {
        if (admin.email && admin.email !== adminEmail) {
          sendEmail({
            to: admin.email,
            subject: `Application rejected: ${application.full_name}`,
            html: adminApplicationRejectedEmail(
              application.full_name,
              application.email,
              adminName
            ),
          }).catch(() => {});
        }
      }
    }
  }

  return { success: true };
}

export async function addAdminNote(
  targetType: "application" | "booking" | "membership" | "user",
  targetId: string,
  note: string
) {
  const supabase = createAdminClient();
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  const { error } = await supabase.from("admin_notes").insert({
    target_type: targetType,
    target_id: targetId,
    note,
    created_by: user?.id || null,
  });

  if (error) {
    console.error("Add admin note error:", error);
    return { success: false, error: "Failed to add note" };
  }

  if (user) {
    logAudit(user.id, "member.note_added", targetType, targetId).catch(
      () => {}
    );
  }

  return { success: true };
}
