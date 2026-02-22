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

export function VerticalTemplate({ data }: Props) {
  const pi = data.personalInfo;
  const content = hasContent(data);

  return (
    <div className="min-h-[297mm] text-[11px] leading-relaxed bg-white px-8 py-8">
      {/* Header: name left, photo right */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-[0.35em] uppercase text-gray-900">
            {pi.firstName}
          </h1>
          <p className="text-lg font-light tracking-[0.15em] uppercase text-gray-700 mt-0.5">
            {pi.lastName}
          </p>
        </div>
        {pi.photo ? (
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pi.photo} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full border border-gray-300 shrink-0 bg-gray-50" />
        )}
      </div>

      <div className="border-b border-gray-300 mb-5" />

      {/* Contact + Profile row */}
      <div className="flex gap-6 mb-6">
        <div className="w-[38%] shrink-0">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">
            Contact
          </h2>
          <div className="space-y-1 text-[10px] text-gray-700">
            {pi.phone && <div>{pi.phone}</div>}
            {pi.email && <div>{pi.email}</div>}
            {(pi.address || pi.city) && (
              <div>{[pi.address, pi.postalCode, pi.city].filter(Boolean).join(", ")}</div>
            )}
            {pi.linkedin && <div>{pi.linkedin}</div>}
            {pi.website && <div>{pi.website}</div>}
          </div>
        </div>

        {content.hasProfile && (
          <div className="flex-1">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">
              Profil
            </h2>
            <p className="text-[10px] text-gray-700 leading-relaxed whitespace-pre-line">
              {data.profile}
            </p>
          </div>
        )}
      </div>

      {/* Main body: two columns */}
      <div className="flex gap-6">
        {/* Left column: Formation, Compétences, Langues */}
        <div className="w-[38%] shrink-0">
          {/* Formation */}
          {content.hasEducation && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-3">
                Formation
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[4px] top-1.5 bottom-0 w-px bg-gray-300" />
                <div className="space-y-3.5">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="relative pl-5">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[9px] h-[9px] rounded-full border-2 border-gray-400 bg-white" />
                      <h3 className="font-bold text-[10px] text-gray-900 uppercase leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-[10px] text-gray-600">
                        {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                      </p>
                      {edu.school && (
                        <p className="text-[10px] text-gray-500">{edu.school}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compétences */}
          {content.hasSkills && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">
                Compétences
              </h2>
              <ul className="space-y-0.5">
                {data.skills.map((skill) => (
                  <li key={skill.id} className="flex gap-2 text-[10px] text-gray-700">
                    <span className="shrink-0 mt-[2px]">•</span>
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Langues */}
          {content.hasLanguages && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">
                Langues
              </h2>
              <ul className="space-y-0.5">
                {data.languages.map((lang) => (
                  <li key={lang.id} className="flex gap-2 text-[10px] text-gray-700">
                    <span className="shrink-0 mt-[2px]">•</span>
                    <span>{lang.name}{lang.level ? ` — ${lang.level}` : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {content.hasInterests && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">
                Centres d&apos;intérêt
              </h2>
              <ul className="space-y-0.5">
                {data.interests.map((interest) => (
                  <li key={interest.id} className="flex gap-2 text-[10px] text-gray-700">
                    <span className="shrink-0 mt-[2px]">•</span>
                    <span>{interest.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column: Expériences Professionnelles */}
        <div className="flex-1">
          {content.hasExperience && (
            <div>
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-3">
                Expériences professionnelles
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[4px] top-1.5 bottom-0 w-px bg-gray-300" />
                <div className="space-y-4">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="relative pl-5">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[9px] h-[9px] rounded-full border-2 border-gray-400 bg-white" />
                      <h3 className="font-bold text-[10.5px] uppercase" style={{ color: "#1a1a1a" }}>
                        {exp.position}
                        {exp.company && (
                          <span className="font-normal text-gray-600"> - {exp.company}</span>
                        )}
                      </h3>
                      <p className="text-[10px] text-gray-500">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </p>
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
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
