import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeEditor } from "@/components/builder/resume-editor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResumePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!resume) redirect("/app");

  return <ResumeEditor initialData={resume} />;
}
