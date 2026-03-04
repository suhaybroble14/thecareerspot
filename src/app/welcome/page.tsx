import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile for first_name
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, full_name")
    .eq("id", user.id)
    .single();

  // Name resolution: profile.first_name → Google metadata → email prefix
  const name =
    profile?.first_name ||
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    null;

  const heading = name ? `Welcome, ${name}` : "Welcome";

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg w-full">

        {/* Initials avatar */}
        <div className="w-20 h-20 rounded-full bg-forest flex items-center justify-center mx-auto mb-8">
          <span className="text-cream text-2xl font-bold tracking-wide">
            {(name ?? "?").slice(0, 1).toUpperCase()}
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl text-forest leading-tight mb-4">
          {heading}
        </h1>
        <p className="text-forest/50 text-base sm:text-lg mb-12 tracking-wide">
          You&apos;re signed in.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-forest text-cream px-8 py-4 text-xs tracking-widest uppercase hover:bg-forest/90 transition-colors duration-300"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="border border-forest/20 text-forest px-8 py-4 text-xs tracking-widest uppercase hover:bg-forest/5 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-10 text-forest/30 text-xs">
          {user.email}
        </p>
      </div>
    </div>
  );
}
