"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import {
  samplePersonalInfo,
  sampleExperience,
  sampleEducation,
  sampleSkills,
  sampleLanguages,
  sampleInterests,
  sampleProfile,
} from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";

export function PrefillBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { resume, setResume } = useResumeStore();

  const isEmpty =
    !resume.personalInfo.firstName &&
    !resume.personalInfo.lastName &&
    resume.experience.length === 0 &&
    resume.education.length === 0;

  if (dismissed || !isEmpty) return null;

  function handlePrefill() {
    setResume({
      ...resume,
      personalInfo: samplePersonalInfo,
      profile: sampleProfile,
      experience: sampleExperience,
      education: sampleEducation,
      skills: sampleSkills,
      languages: sampleLanguages,
      interests: sampleInterests,
    });
    setDismissed(true);
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
      <Lightbulb className="w-5 h-5 text-blue-600 shrink-0" />
      <p className="text-sm text-blue-800 flex-1">
        CV vide ? Remplissez-le avec un exemple pour voir le rendu.
      </p>
      <Button size="sm" variant="outline" onClick={handlePrefill} className="shrink-0 text-blue-700 border-blue-300 hover:bg-blue-100">
        Remplir
      </Button>
      <button onClick={() => setDismissed(true)} className="text-blue-400 hover:text-blue-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
