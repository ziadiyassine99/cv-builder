import type { ResumeData } from "@/types/resume";

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months = [
    "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc.",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean
): string {
  const startStr = formatDate(start);
  const endStr = current ? "ce jour" : formatDate(end);
  if (!startStr && !endStr) return "";
  if (!startStr) return endStr;
  if (!endStr) return `de ${startStr}`;
  return `de ${startStr} à ${endStr}`;
}

export function hasContent(data: ResumeData): {
  hasPersonalInfo: boolean;
  hasProfile: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasLanguages: boolean;
  hasInterests: boolean;
} {
  const pi = data.personalInfo;
  return {
    hasPersonalInfo: !!(
      pi.firstName || pi.lastName || pi.email || pi.phone
    ),
    hasProfile: !!data.profile,
    hasExperience: data.experience.length > 0,
    hasEducation: data.education.length > 0,
    hasSkills: data.skills.length > 0,
    hasLanguages: data.languages.length > 0,
    hasInterests: data.interests.length > 0,
  };
}
