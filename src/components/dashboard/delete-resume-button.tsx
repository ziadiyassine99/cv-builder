"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  async function handleDelete() {
    if (!confirm(t.dashboard.deleteConfirm)) return;

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId);

    if (error) {
      toast.error(t.dashboard.deleteError);
      return;
    }

    toast.success(t.dashboard.deleteSuccess);
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
