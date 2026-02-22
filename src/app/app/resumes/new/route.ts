import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("resumes")
    .insert({ user_id: user.id })
    .select()
    .single();

  if (error || !data) redirect("/app");

  redirect(`/app/resumes/${data.id}/edit`);
}
