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
      toast.error("Erreur lors de la duplication");
      return;
    }

    toast.success("CV dupliqué !");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce CV définitivement ?")) return;

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resume.id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("CV supprimé");
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
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          Dupliquer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
