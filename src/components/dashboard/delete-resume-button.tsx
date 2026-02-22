"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("Supprimer ce CV ?")) return;

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("CV supprimé");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
