import { getHireEnquiries } from "@/lib/actions/admin";

export default async function HireEnquiriesPage() {
  const enquiries = await getHireEnquiries();

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Hire Enquiries</h1>
      <p className="text-forest/50 text-sm mb-8">
        People who have submitted a space hire enquiry. Full details are emailed to thecareerspot0@gmail.com.
      </p>

      {enquiries.length === 0 ? (
        <div className="bg-white border border-forest/10 p-12 text-center">
          <p className="text-forest/40 text-sm">No hire enquiries yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-forest/10 divide-y divide-forest/5">
          {enquiries.map((lead: Record<string, unknown>) => (
            <div key={lead.id as string} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-forest font-medium">
                  {(lead.full_name as string) || "Unknown"}
                </p>
                <p className="text-xs text-forest/40">{lead.email as string}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-forest/40">
                  {new Date(lead.created_at as string).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <a
                  href={`mailto:${lead.email as string}`}
                  className="text-xs text-camel hover:text-cocoa transition-colors"
                >
                  Reply by email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
