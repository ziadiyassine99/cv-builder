"use client";

import { useResumeStore } from "@/store/resume-store";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { ProfessionalTemplate } from "@/components/templates/professional-template";
import { VerticalTemplate } from "@/components/templates/vertical-template";

export function ResumePreview() {
  const { resume } = useResumeStore();

  const templateMap: Record<string, React.ComponentType<{ data: typeof resume }>> = {
    classic: ClassicTemplate,
    professional: ProfessionalTemplate,
    vertical: VerticalTemplate,
  };

  const Template = templateMap[resume.templateId] || ClassicTemplate;

  return (
    <div
      className="bg-white shadow-xl print:shadow-none overflow-hidden"
      style={{ width: "210mm", height: "297mm" }}
      id="resume-preview"
    >
      <Template data={resume} />
    </div>
  );
}
