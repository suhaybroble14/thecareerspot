import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getMyMembership, getMyApplicationStatus } from "@/lib/actions/memberships";
import { getMyApplications } from "@/lib/actions/applications";
import { redirect } from "next/navigation";

export default async function MembershipPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [membership, latestApplication, allApplications] = await Promise.all([
    getMyMembership(),
    getMyApplicationStatus(),
    getMyApplications(),
  ]);

  return (
    <>
      <h1 className="font-serif text-3xl text-forest mb-2">Membership</h1>
      <p className="text-forest/50 text-sm mb-10">
        Your membership status and application history.
      </p>

      {/* Active membership */}
      {membership && (
        <div className="bg-forest text-cream p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-sage/30 text-cream text-xs tracking-widest uppercase px-3 py-1">
              Active
            </span>
            <span className="text-cream/50 text-xs">Monthly Membership</span>
          </div>
          <h2 className="font-serif text-2xl mb-2">24/7 Workspace Access</h2>
          <p className="text-cream/60 text-sm mb-4">
            Your membership gives you full access to The Spot workspace,
            facilities, and community events.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-cream/40 block mb-1">Started</span>
              <span>
                {new Date(membership.purchased_at || membership.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-cream/40 block mb-1">Expires</span>
              <span>
                {new Date(membership.expires_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No membership + no application */}
      {!membership && !latestApplication && (
        <div className="bg-white border border-forest/10 p-12 text-center mb-8">
          <h2 className="font-serif text-2xl text-forest mb-3">
            No active membership
          </h2>
          <p className="text-forest/50 text-sm mb-6 max-w-md mx-auto">
            Apply for a monthly membership to get 24/7 access to the workspace
            and join the community.
          </p>
          <Link
            href="/membership/apply"
            className="bg-forest text-cream px-8 py-3 text-sm tracking-widest uppercase hover:bg-forest-light transition-colors inline-block"
          >
            Apply for Membership
          </Link>
        </div>
      )}

      {/* Application history */}
      {allApplications.length > 0 && (
        <div>
          <h2 className="text-xs tracking-widest uppercase text-forest/50 mb-4">
            Application History
          </h2>
          <div className="space-y-4">
            {allApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-forest/10 p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg text-forest">
                    Membership Application
                  </h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-forest/50 text-sm">
                  Submitted{" "}
                  {new Date(app.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {app.status === "submitted" && (
                  <p className="text-forest/40 text-sm mt-3">
                    We&apos;re reviewing your application. You&apos;ll hear from us
                    within a few days.
                  </p>
                )}
                {app.status === "under_review" && (
                  <p className="text-forest/40 text-sm mt-3">
                    Your application is being reviewed by the team.
                  </p>
                )}
                {app.status === "approved" && !membership && (
                  <p className="text-sage text-sm mt-3">
                    Your application has been approved. We&apos;ll be in touch
                    about next steps.
                  </p>
                )}
                {app.status === "rejected" && (
                  <p className="text-forest/40 text-sm mt-3">
                    Unfortunately your application wasn&apos;t successful this
                    time. Feel free to reach out if you have questions.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    submitted: "bg-camel/20 text-cocoa",
    under_review: "bg-camel/20 text-cocoa",
    approved: "bg-sage/20 text-sage",
    rejected: "bg-forest/10 text-forest/40",
  };

  return (
    <span
      className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
        styles[status] || "bg-forest/10 text-forest/50"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
