import type { ResumeData } from "@/types/resume";
import { formatDateRange, hasContent } from "./template-utils";

interface Props {
  data: ResumeData;
}

function descriptionLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function ClassicTemplate({ data }: Props) {
  const pi = data.personalInfo;
  const content = hasContent(data);

  const contactParts = [pi.email, pi.phone, [pi.address, pi.postalCode, pi.city].filter(Boolean).join(", ")].filter(Boolean);

  return (
    <div className="min-h-[297mm] text-[11px] leading-relaxed px-10 py-8 font-serif">
      {/* Header */}
      <div className="text-center mb-1">
        <h1 className="text-xl font-normal tracking-wide">
          {pi.firstName}{" "}
          <span className="font-bold uppercase">{pi.lastName}</span>
        </h1>
        {contactParts.length > 0 && (
          <p className="text-[10px] text-gray-600 mt-0.5">
            {contactParts.join("  |  ")}
          </p>
        )}
      </div>

      {/* Education */}
      {content.hasEducation && (
        <section className="mt-4">
          <h2 className="text-[12px] font-bold border-b border-black pb-0.5 mb-2">
            Formation
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex gap-4">
                <div className="w-[90px] shrink-0 text-[10px] text-gray-700 pt-0.5">
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[11px]">{edu.school}</h3>
                    {edu.city && (
                      <span className="text-[10px] text-gray-600 shrink-0 ml-2">
                        {edu.city}
                      </span>
                    )}
                  </div>
                  {edu.degree && (
                    <p className="text-gray-700">{edu.degree}</p>
                  )}
                  {edu.description && (
                    <p className="text-gray-600 mt-0.5 whitespace-pre-line text-[10px]">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {content.hasExperience && (
        <section className="mt-4">
          <h2 className="text-[12px] font-bold border-b border-black pb-0.5 mb-2">
            Expérience professionnelle
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="flex gap-4">
                <div className="w-[90px] shrink-0 text-[10px] text-gray-700 font-semibold pt-0.5">
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[11px]">{exp.company}</h3>
                    {exp.city && (
                      <span className="text-[10px] text-gray-600 shrink-0 ml-2">
                        {exp.city}
                      </span>
                    )}
                  </div>
                  {exp.position && (
                    <p className="italic text-gray-700">{exp.position}</p>
                  )}
                  {exp.description && (
                    <ul className="mt-1 space-y-0.5">
                      {descriptionLines(exp.description).map((line, i) => (
                        <li key={i} className="flex gap-2 text-[10px] text-gray-700">
                          <span className="shrink-0 mt-[3px]">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Profile */}
      {content.hasProfile && (
        <section className="mt-4">
          <h2 className="text-[12px] font-bold border-b border-black pb-0.5 mb-2">
            Profil
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{data.profile}</p>
        </section>
      )}

      {/* Additional Information */}
      {(content.hasInterests || content.hasLanguages || content.hasSkills || pi.nationality) && (
        <section className="mt-4">
          <h2 className="text-[12px] font-bold border-b border-black pb-0.5 mb-2">
            Informations complémentaires
          </h2>
          <div className="space-y-2">
            {content.hasSkills && (
              <div className="flex gap-4">
                <div className="w-[90px] shrink-0 text-[10px] text-gray-700 font-medium">
                  Compétences :
                </div>
                <p className="flex-1 text-gray-700 text-[10px]">
                  {data.skills.map((s) => s.name).join(", ")}
                </p>
              </div>
            )}
            {content.hasInterests && (
              <div className="flex gap-4">
                <div className="w-[90px] shrink-0 text-[10px] text-gray-700 font-medium">
                  Intérêts :
                </div>
                <p className="flex-1 text-gray-700 text-[10px]">
                  {data.interests.map((i) => i.name).join(", ")}
                </p>
              </div>
            )}
            {pi.nationality && (
              <div className="flex gap-4">
                <div className="w-[90px] shrink-0 text-[10px] text-gray-700 font-medium">
                  Nationalité :
                </div>
                <p className="flex-1 text-gray-700 text-[10px]">{pi.nationality}</p>
              </div>
            )}
            {content.hasLanguages && (
              <div className="flex gap-4">
                <div className="w-[90px] shrink-0 text-[10px] text-gray-700 font-medium">
                  Langues :
                </div>
                <p className="flex-1 text-gray-700 text-[10px]">
                  {data.languages.map((l) => `${l.name} (${l.level})`).join(", ")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
