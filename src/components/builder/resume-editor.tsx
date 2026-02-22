"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useResumeStore } from "@/store/resume-store";
import { type ResumeData } from "@/types/resume";
import { exportToPdf } from "@/lib/pdf-export";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ProfileForm } from "./forms/profile-form";
import { EducationForm } from "./forms/education-form";
import { ExperienceForm } from "./forms/experience-form";
import { SkillsForm } from "./forms/skills-form";
import { LanguagesForm } from "./forms/languages-form";
import { InterestsForm } from "./forms/interests-form";
import { TemplateSelector } from "./template-selector";
import { PrefillBanner } from "./prefill-banner";
import { ResumePreview } from "./resume-preview";
import {
  ArrowLeft,
  Save,
  Download,
  Check,
  Loader2,
  CloudOff,
} from "lucide-react";
import { toast } from "sonner";

interface ResumeEditorProps {
  initialData: {
    id: string;
    title: string;
    template_id: string;
    personal_info: Record<string, string>;
    profile: string;
    education: Record<string, unknown>[];
    experience: Record<string, unknown>[];
    skills: Record<string, unknown>[];
    languages: Record<string, unknown>[];
    interests: Record<string, unknown>[];
    custom_sections: Record<string, unknown>[];
    color_primary: string;
  };
}

function mapDbToStore(db: ResumeEditorProps["initialData"]): ResumeData {
  return {
    id: db.id,
    title: db.title,
    templateId: db.template_id,
    personalInfo: {
      firstName: (db.personal_info?.firstName as string) || "",
      lastName: (db.personal_info?.lastName as string) || "",
      jobTitle: (db.personal_info?.jobTitle as string) || "",
      email: (db.personal_info?.email as string) || "",
      phone: (db.personal_info?.phone as string) || "",
      address: (db.personal_info?.address as string) || "",
      postalCode: (db.personal_info?.postalCode as string) || "",
      city: (db.personal_info?.city as string) || "",
      dateOfBirth: (db.personal_info?.dateOfBirth as string) || "",
      placeOfBirth: (db.personal_info?.placeOfBirth as string) || "",
      drivingLicense: (db.personal_info?.drivingLicense as string) || "",
      gender: (db.personal_info?.gender as string) || "",
      nationality: (db.personal_info?.nationality as string) || "",
      maritalStatus: (db.personal_info?.maritalStatus as string) || "",
      website: (db.personal_info?.website as string) || "",
      linkedin: (db.personal_info?.linkedin as string) || "",
      photo: (db.personal_info?.photo as string) || "",
    },
    profile: db.profile || "",
    education: (db.education as unknown as ResumeData["education"]) || [],
    experience:
      (db.experience as unknown as ResumeData["experience"]) || [],
    skills: (db.skills as unknown as ResumeData["skills"]) || [],
    languages: (db.languages as unknown as ResumeData["languages"]) || [],
    interests: (db.interests as unknown as ResumeData["interests"]) || [],
    customSections:
      (db.custom_sections as unknown as ResumeData["customSections"]) || [],
    colorPrimary: db.color_primary || "#0e7490",
  };
}

export function ResumeEditor({ initialData }: ResumeEditorProps) {
  const { resume, setResume, isDirty, isSaving, setIsSaving, markClean } =
    useResumeStore();
  const supabase = createClient();
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setResume(mapDbToStore(initialData));
  }, [initialData, setResume]);

  const save = useCallback(async () => {
    if (!initialData.id || isSaving) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("resumes")
      .update({
        title: resume.title,
        template_id: resume.templateId,
        personal_info: resume.personalInfo,
        profile: resume.profile,
        education: resume.education,
        experience: resume.experience,
        skills: resume.skills,
        languages: resume.languages,
        interests: resume.interests,
        custom_sections: resume.customSections,
        color_primary: resume.colorPrimary,
      })
      .eq("id", initialData.id);

    setIsSaving(false);

    if (error) {
      toast.error("Erreur de sauvegarde");
      return;
    }

    markClean();
  }, [initialData.id, resume, isSaving, supabase, setIsSaving, markClean]);

  useEffect(() => {
    if (!isDirty) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(save, 2000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [isDirty, save]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handleExportPdf();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function handleExportPdf() {
    const el = document.getElementById("resume-preview");
    if (!el) return;

    setIsExporting(true);
    toast.info("Génération du PDF...");

    try {
      const filename = `${resume.personalInfo.firstName || "CV"}_${resume.personalInfo.lastName || "Document"}_CV.pdf`
        .replace(/\s+/g, "_");
      await exportToPdf(el, filename);
      toast.success("PDF téléchargé !");
    } catch {
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsExporting(false);
    }
  }

  function renderSaveStatus() {
    if (isSaving) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-amber-600">
          <Loader2 className="w-3 h-3 animate-spin" />
          Sauvegarde...
        </span>
      );
    }
    if (isDirty) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CloudOff className="w-3 h-3" />
          Non sauvegardé
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs text-green-600">
        <Check className="w-3 h-3" />
        Sauvegardé
      </span>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white h-14 flex items-center px-4 gap-4 shrink-0">
        <Link href="/app">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        <div className="h-6 w-px bg-border" />

        <input
          type="text"
          value={resume.title}
          onChange={(e) => useResumeStore.getState().setTitle(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0 flex-1 min-w-0"
          placeholder="Titre du CV"
        />

        <div className="flex items-center gap-3 shrink-0">
          {renderSaveStatus()}

          <div className="h-6 w-px bg-border" />

          <Button
            variant="outline"
            size="sm"
            onClick={save}
            disabled={isSaving || !isDirty}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Télécharger PDF
          </Button>
        </div>
      </header>

      {/* Main content: form + preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel: Form */}
        <div className="w-[480px] shrink-0 border-r bg-white">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <PrefillBanner />
              <TemplateSelector />
              <PersonalInfoForm />
              <ProfileForm />
              <ExperienceForm />
              <EducationForm />
              <SkillsForm />
              <LanguagesForm />
              <InterestsForm />
            </div>
          </ScrollArea>
        </div>

        {/* Right panel: Preview */}
        <div className="flex-1 bg-slate-100 overflow-auto">
          <div className="p-8 flex justify-center">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
