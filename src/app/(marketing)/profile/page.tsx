"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/lib/supabase/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", dob: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data as Profile);
        setForm({
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          phone: data.phone ?? "",
          dob: data.dob ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const fullName = profile?.full_name ||
    (profile?.first_name ? `${profile.first_name} ${profile.last_name ?? ""}`.trim() : null) ||
    "Your Profile";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const result = await updateProfile(form);
    if (result.success) {
      setSaved(true);
      setEditing(false);
      // Re-fetch profile
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) setProfile(data as Profile);
      }
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error ?? "Failed to save");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls = "w-full bg-white border border-forest/10 px-5 py-3.5 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors";

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">

        {/* Hero header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-full bg-forest flex items-center justify-center shrink-0">
            <span className="text-cream text-2xl font-bold tracking-wide">{getInitials(fullName)}</span>
          </div>
          <div>
            <h1 className="font-serif text-4xl text-forest leading-tight">{fullName}</h1>
            <p className="text-forest/50 text-sm mt-1">{profile?.email}</p>
            <p className="text-forest/40 text-xs mt-1 tracking-wide uppercase">
              Member since {formatDate(profile?.created_at ?? null)}
            </p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 bg-sage/10 border border-sage/20 px-5 py-3 text-sage text-sm">
            Profile updated successfully.
          </div>
        )}

        {/* Personal details card */}
        <div className="bg-white border border-forest/10 mb-6">
          <div className="flex items-center justify-between px-6 py-4 border-b border-forest/10">
            <h2 className="text-xs tracking-widest uppercase text-forest/60">Personal Details</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs tracking-widest uppercase text-camel hover:text-camel/80 transition-colors">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/50 mb-2">First name</label>
                  <input type="text" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Jane" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-forest/50 mb-2">Last name</label>
                  <input type="text" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Smith" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-forest/50 mb-2">Date of birth</label>
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-forest/50 mb-2">Phone number</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7700 000000" className={inputCls} />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-forest text-cream py-3.5 text-xs tracking-widest uppercase hover:bg-forest/90 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => { setEditing(false); setError(""); }} className="flex-1 border border-forest/20 text-forest py-3.5 text-xs tracking-widest uppercase hover:bg-forest/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-forest/5">
              {[
                { label: "First name", value: profile?.first_name || "—" },
                { label: "Last name", value: profile?.last_name || "—" },
                { label: "Date of birth", value: formatDate(profile?.dob ?? null) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-6 py-4">
                  <span className="text-xs tracking-widest uppercase text-forest/40">{label}</span>
                  <span className="text-sm text-forest">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact card */}
        <div className="bg-white border border-forest/10 mb-6">
          <div className="px-6 py-4 border-b border-forest/10">
            <h2 className="text-xs tracking-widest uppercase text-forest/60">Contact</h2>
          </div>
          <div className="divide-y divide-forest/5">
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-xs tracking-widest uppercase text-forest/40">Email</span>
              <span className="text-sm text-forest/70">{profile?.email || "—"}</span>
            </div>
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-xs tracking-widest uppercase text-forest/40">Phone</span>
              <span className="text-sm text-forest">{profile?.phone || "—"}</span>
            </div>
          </div>
        </div>

        {/* Account card */}
        <div className="bg-white border border-forest/10">
          <div className="px-6 py-4 border-b border-forest/10">
            <h2 className="text-xs tracking-widest uppercase text-forest/60">Account</h2>
          </div>
          <div className="divide-y divide-forest/5">
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-xs tracking-widest uppercase text-forest/40">Member since</span>
              <span className="text-sm text-forest">{formatDate(profile?.created_at ?? null)}</span>
            </div>
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-xs tracking-widest uppercase text-forest/40">Role</span>
              <span className="text-sm text-forest capitalize">{profile?.role || "member"}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/dashboard" className="text-forest/40 text-xs tracking-widest uppercase hover:text-forest transition-colors">
            ← Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
