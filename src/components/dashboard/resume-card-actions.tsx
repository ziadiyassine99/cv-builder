"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface ResumeCardActionsProps {
  resume: {
    id: string;
    title: string;
    template_id: string;
    personal_info: Record<string, unknown>;
    profile: string;
    education: unknown[];
    experience: unknown[];
    skills: unknown[];
    languages: unknown[];
    interests: unknown[];
    custom_sections: unknown[];
    color_primary: string;
    user_id: string;
  };
}

export function ResumeCardActions({ resume }: ResumeCardActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  async function handleDuplicate() {
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: resume.user_id,
        title: `${resume.title} (copie)`,
        template_id: resume.template_id,
        personal_info: resume.personal_info,
        profile: resume.profile,
        education: resume.education,
        experience: resume.experience,
        skills: resume.skills,
        languages: resume.languages,
        interests: resume.interests,
        custom_sections: resume.custom_sections,
        color_primary: resume.color_primary,
      })
      .select()
      .single();

    if (error || !data) {
      toast.error(t.dashboard.duplicateError);
      return;
    }

    toast.success(t.dashboard.duplicateSuccess);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(t.dashboard.deleteConfirm)) return;

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resume.id);

    if (error) {
      toast.error(t.dashboard.deleteError);
      return;
    }

    toast.success(t.dashboard.deleteSuccess);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/app/resumes/${resume.id}/edit`)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          {t.dashboard.edit}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          {t.common.duplicate}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t.common.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
