"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllMembers } from "@/lib/actions/admin";
import type { Profile } from "@/lib/supabase/types";

export default function MembersPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllMembers();
      setMembers(data as Profile[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.full_name?.toLowerCase().includes(q) ?? false) ||
      (m.email?.toLowerCase().includes(q) ?? false) ||
      m.role.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Members</h1>
      <p className="text-forest/50 text-sm mb-8">
        All registered users on the platform.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white border border-forest/10 px-5 py-3 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:border-camel transition-colors"
          placeholder="Search by name, email, or role..."
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 text-sm">
            {search ? "No members match your search." : "No members registered yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-forest/10 divide-y divide-forest/5">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-4 px-5 py-3 text-xs tracking-widest uppercase text-forest/40">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
          </div>

          {filtered.map((member) => (
            <Link
              key={member.id}
              href={`/admin/members/${member.id}`}
              className="block px-5 py-4 hover:bg-forest/[0.02] transition-colors"
            >
              <div className="sm:grid sm:grid-cols-4 sm:items-center">
                <p className="text-sm text-forest font-medium">
                  {member.full_name || "-"}
                </p>
                <p className="text-sm text-forest/60">{member.email}</p>
                <p className="text-xs">
                  <span
                    className={`tracking-widest uppercase px-2 py-0.5 ${
                      member.role === "admin"
                        ? "bg-cocoa/10 text-cocoa"
                        : "bg-forest/5 text-forest/50"
                    }`}
                  >
                    {member.role}
                  </span>
                </p>
                <p className="text-xs text-forest/40">
                  {new Date(member.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
