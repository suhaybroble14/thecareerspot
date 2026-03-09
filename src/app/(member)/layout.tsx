import { getCurrentUser, isAdmin } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import MemberSidebar from "./MemberSidebar";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const adminUser = await isAdmin(user.id);

  return (
    <MemberSidebar isAdmin={adminUser}>
      {children}
    </MemberSidebar>
  );
}
