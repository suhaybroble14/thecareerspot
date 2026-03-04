"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMemberDetail } from "@/lib/actions/admin";
import { addAdminNote } from "@/lib/actions/admin-applications";
import type { Profile, Booking, Membership, CheckIn, AdminNote } from "@/lib/supabase/types";

export default function MemberDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getMemberDetail(userId);
      setProfile(data.profile as Profile | null);
      setBookings(data.bookings as Booking[]);
      setMemberships(data.memberships as Membership[]);
      setCheckIns(data.checkIns as CheckIn[]);
      setNotes(data.notes as AdminNote[]);
      setLoading(false);
    }
    load();
  }, [userId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    const result = await addAdminNote("user", userId, newNote.trim());
    if (result.success) {
      setNotes((prev) => [
        {
          id: Date.now().toString(),
          target_type: "user",
          target_id: userId,
          note: newNote.trim(),
          created_by: null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewNote("");
    }
    setAddingNote(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-forest/40 mb-4">Member not found.</p>
        <Link href="/admin/members" className="text-camel text-sm hover:underline">
          Back to members
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/admin/members"
        className="text-forest/40 text-sm hover:text-forest transition-colors inline-flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        All Members
      </Link>

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-forest mb-1">
            {profile.full_name || "Unnamed"}
          </h1>
          <p className="text-forest/50 text-sm">{profile.email}</p>
          {profile.phone && (
            <p className="text-forest/40 text-sm">{profile.phone}</p>
          )}
        </div>
        <span
          className={`text-xs tracking-widest uppercase px-3 py-1 ${
            profile.role === "admin"
              ? "bg-cocoa/10 text-cocoa"
              : "bg-forest/5 text-forest/50"
          }`}
        >
          {profile.role}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Bookings</p>
          <p className="font-serif text-2xl text-forest">{bookings.length}</p>
        </div>
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Memberships</p>
          <p className="font-serif text-2xl text-forest">{memberships.length}</p>
        </div>
        <div className="bg-white border border-forest/10 p-5">
          <p className="text-xs tracking-widest uppercase text-forest/40 mb-1">Check-ins</p>
          <p className="font-serif text-2xl text-forest">{checkIns.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Memberships */}
        {memberships.length > 0 && (
          <div>
            <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
              Memberships
            </h2>
            <div className="bg-white border border-forest/10 divide-y divide-forest/5">
              {memberships.map((m) => (
                <div key={m.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest capitalize">
                      {m.membership_type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-forest/40">
                      Expires {new Date(m.expires_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span
                    className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                      m.is_active && new Date(m.expires_at) > new Date()
                        ? "bg-sage/20 text-sage"
                        : "bg-forest/10 text-forest/40"
                    }`}
                  >
                    {m.is_active && new Date(m.expires_at) > new Date()
                      ? "Active"
                      : "Expired"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent bookings */}
        {bookings.length > 0 && (
          <div>
            <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
              Recent Bookings
            </h2>
            <div className="bg-white border border-forest/10 divide-y divide-forest/5">
              {bookings.slice(0, 10).map((b) => (
                <div key={b.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-forest">
                      {new Date(b.booking_date + "T00:00:00").toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-forest/40">
                      £{b.amount_paid.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs text-forest/40 capitalize">
                    {b.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent check-ins */}
        {checkIns.length > 0 && (
          <div>
            <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
              Recent Check-ins
            </h2>
            <div className="bg-white border border-forest/10 divide-y divide-forest/5">
              {checkIns.slice(0, 10).map((c) => (
                <div key={c.id} className="px-5 py-4 flex items-center justify-between">
                  <p className="text-sm text-forest capitalize">
                    {c.check_in_type.replace("_", " ")}
                  </p>
                  <p className="text-xs text-forest/40">
                    {new Date(c.checked_in_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin notes */}
        <div>
          <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-3">
            Admin Notes
          </h2>
          <div className="bg-white border border-forest/10 p-5">
            <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-white border border-forest/10 px-4 py-2 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
                placeholder="Add a note about this member..."
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="bg-forest text-cream px-4 py-2 text-sm hover:bg-forest-light transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>
            {notes.length === 0 ? (
              <p className="text-forest/30 text-sm">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-forest/10 pl-3">
                    <p className="text-sm text-forest">{note.note}</p>
                    <p className="text-xs text-forest/30 mt-1">
                      {new Date(note.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
