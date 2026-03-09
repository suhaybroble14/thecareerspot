import { getHireEnquiries } from "@/lib/actions/admin";
import type { Lead } from "@/lib/supabase/types";

export default async function HireEnquiriesPage() {
  const enquiries = (await getHireEnquiries().catch(() => [])) as Lead[];

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Hire Enquiries</h1>
      <p className="text-forest/50 text-sm mb-8">
        {enquiries.length} enquir{enquiries.length !== 1 ? "ies" : "y"} received.
      </p>

      {enquiries.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 text-sm">No hire enquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((lead) => (
            <div key={lead.id} className="bg-white border border-forest/10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  {/* Name + date */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-camel/15 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-camel text-sm font-semibold">
                        {(lead.full_name || "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-forest font-medium text-sm">
                        {lead.full_name || "Unknown"}
                      </p>
                      <p className="text-forest/40 text-xs">
                        {new Date(lead.created_at).toLocaleDateString("en-GB", {
                          weekday: "short", day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3 text-sm">
                    <span className="text-forest/50">
                      Email:{" "}
                      <a href={`mailto:${lead.email}`} className="text-camel hover:underline">
                        {lead.email}
                      </a>
                    </span>
                    {lead.phone && (
                      <span className="text-forest/50">
                        Phone:{" "}
                        <a href={`tel:${lead.phone}`} className="text-forest">
                          {lead.phone}
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Event details */}
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {lead.event_type && (
                      <span className="text-forest/50">
                        Event: <span className="text-forest">{lead.event_type}</span>
                      </span>
                    )}
                    {lead.preferred_date && (
                      <span className="text-forest/50">
                        Date:{" "}
                        <span className="text-forest">
                          {new Date(lead.preferred_date + "T00:00:00").toLocaleDateString("en-GB", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </span>
                      </span>
                    )}
                    {lead.guest_count && (
                      <span className="text-forest/50">
                        Guests: <span className="text-forest">{lead.guest_count}</span>
                      </span>
                    )}
                  </div>

                  {lead.message && (
                    <p className="mt-3 text-sm text-forest/60 border-l-2 border-forest/10 pl-3 italic">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  )}
                </div>

                <a
                  href={`mailto:${lead.email}?subject=Re: Space hire enquiry`}
                  className="shrink-0 px-4 py-2 text-xs tracking-widest uppercase bg-forest text-cream hover:bg-forest/80 transition-colors"
                >
                  Reply
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
