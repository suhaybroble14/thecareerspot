import { createAdminClient } from "./supabase/admin";

type AuditAction =
  | "application.approve"
  | "application.reject"
  | "application.under_review"
  | "application.payment_link"
  | "check_in.day_pass"
  | "check_in.monthly"
  | "check_in.failed"
  | "membership.created"
  | "capacity.override"
  | "member.note_added";

export async function logAudit(
  adminId: string,
  action: AuditAction,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("audit_logs").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: metadata || {},
  });

  if (error) {
    console.error("[Audit] Failed to log:", error);
  }
}
