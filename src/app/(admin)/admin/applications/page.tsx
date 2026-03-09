"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllApplications } from "@/lib/actions/admin-applications";
import type { MembershipApplication } from "@/lib/supabase/types";

const statusFilters = ["all", "submitted", "under_review", "approved", "rejected"];

const statusStyles: Record<string, string> = {
  submitted: "bg-camel/20 text-cocoa",
  under_review: "bg-camel/20 text-cocoa",
  approved: "bg-sage/20 text-sage",
  rejected: "bg-forest/10 text-forest/40",
};

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("all");
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllApplications(filter);
      setApplications(data);
      setLoading(false);
    }
    load();
  }, [filter]);

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Applications</h1>
      <p className="text-forest/50 text-sm mb-8">
        Membership applications inbox.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
              filter === s
                ? "bg-forest text-cream"
                : "border border-forest/20 text-forest/60 hover:bg-forest/5"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-forest/20 border-t-forest rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 text-sm">
            No applications{filter !== "all" ? ` with status "${filter.replace("_", " ")}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="block bg-white border border-forest/10 p-6 hover:border-camel transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  {/* Name + status */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-sage/15 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sage text-sm font-semibold">
                        {(app.full_name || "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-forest font-medium">{app.full_name}</p>
                      <p className="text-forest/40 text-xs">
                        Applied{" "}
                        {new Date(app.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3 text-sm">
                    <span className="text-forest/50">
                      Email: <span className="text-forest">{app.email}</span>
                    </span>
                    {app.phone && (
                      <span className="text-forest/50">
                        Phone: <span className="text-forest">{app.phone}</span>
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  {app.message && (
                    <p className="text-sm text-forest/60 border-l-2 border-forest/10 pl-3 italic line-clamp-2">
                      &ldquo;{app.message}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs tracking-widest uppercase px-3 py-1 ${statusStyles[app.status] || "bg-forest/10 text-forest/50"}`}>
                    {app.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-forest/30">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
