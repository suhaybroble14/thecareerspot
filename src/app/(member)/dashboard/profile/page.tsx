"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/supabase/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data as Profile);
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
          });
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const result = await updateProfile({
      full_name: formData.full_name,
      phone: formData.phone,
    });

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Profile</h1>
      <p className="text-forest/50 text-sm mb-10">
        Update your personal details.
      </p>

      <div className="bg-white border border-forest/10 p-6 sm:p-8 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full bg-cream/50 border border-forest/10 px-5 py-4 text-sm text-forest/50 cursor-not-allowed"
            />
            <p className="text-forest/30 text-xs mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label
              htmlFor="full_name"
              className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
            >
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs tracking-widest uppercase text-forest/60 mb-2"
            >
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-white border border-forest/10 px-5 py-4 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
              placeholder="Optional"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {saved && (
            <p className="text-sage text-sm">Profile updated successfully.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-forest text-cream px-6 py-4 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}
