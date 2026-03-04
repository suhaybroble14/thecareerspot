"use server";

import { createClient } from "@/lib/supabase/server";

type UpdateProfileInput = {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  dob?: string;
};

export async function updateProfile(input: UpdateProfileInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const updates: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.full_name !== undefined) updates.full_name = input.full_name || null;
  if (input.first_name !== undefined) updates.first_name = input.first_name || null;
  if (input.last_name !== undefined) updates.last_name = input.last_name || null;
  if (input.phone !== undefined) updates.phone = input.phone || null;
  if (input.dob !== undefined) updates.dob = input.dob || null;

  // Auto-build full_name from first+last if provided
  if (input.first_name !== undefined || input.last_name !== undefined) {
    const combined = `${input.first_name ?? ""} ${input.last_name ?? ""}`.trim();
    if (combined) updates.full_name = combined;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }

  return { success: true };
}
