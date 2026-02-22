import type { ResumeData } from "@/types/resume";

interface DateFormatOptions {
  months: readonly string[];
  present: string;
  from: string;
  to: string;
}

export function formatDate(
  dateStr: string,
  months: readonly string[]
): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const idx = parseInt(month, 10) - 1;
  if (idx < 0 || idx > 11) return year || "";
  return `${months[idx]} ${year}`;
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean,
  opts: DateFormatOptions
): string {
  const startStr = formatDate(start, opts.months);
  const endStr = current ? opts.present : formatDate(end, opts.months);
  if (!startStr && !endStr) return "";
  if (!startStr) return endStr;
  if (!endStr) return `${opts.from} ${startStr}`;
  return `${opts.from} ${startStr} ${opts.to} ${endStr}`;
}

export function formatDateRangeCompact(
  start: string,
  end: string,
  current: boolean,
  opts: Pick<DateFormatOptions, "months" | "present">
): string {
  const s = formatDate(start, opts.months);
  const e = current ? opts.present : formatDate(end, opts.months);
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} — ${e}`;
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
