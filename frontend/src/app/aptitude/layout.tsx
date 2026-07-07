import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";

export default async function AptitudeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
