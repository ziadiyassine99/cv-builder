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

export function ProfessionalTemplate({ data }: Props) {
  const pi = data.personalInfo;
  const color = data.colorPrimary;
  const content = hasContent(data);

  return (
    <div className="min-h-[297mm] text-[11px] leading-relaxed bg-white">
      {/* Header with curved background */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#f0f4f8" }}>
        <div className="relative z-10 flex items-center gap-6 px-8 pt-8 pb-6">
          {/* Photo */}
          {pi.photo ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pi.photo} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/60 border-4 border-white shadow-md shrink-0" />
          )}

          {/* Name & Profile */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl tracking-wide">
              <span className="font-light">{pi.firstName}</span>{" "}
              <span className="font-bold uppercase">{pi.lastName}</span>
            </h1>
            {content.hasProfile && (
              <p className="text-[10px] text-gray-600 mt-2 leading-relaxed line-clamp-4">
                {data.profile}
              </p>
            )}
          </div>
        </div>

        {/* Contact bar */}
        <div className="flex items-center justify-center gap-6 px-8 py-2.5" style={{ backgroundColor: color }}>
          {pi.email && (
            <span className="text-white text-[10px] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {pi.email}
            </span>
          )}
          {pi.phone && (
            <span className="text-white text-[10px] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {pi.phone}
            </span>
          )}
          {pi.website && (
            <span className="text-white text-[10px] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              {pi.website}
            </span>
          )}
          {pi.linkedin && (
            <span className="text-white text-[10px] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              {pi.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Body: two columns */}
      <div className="flex gap-0 px-8 py-6">
        {/* Left column */}
        <div className="w-[38%] shrink-0 pr-6">
          {/* Languages */}
          {content.hasLanguages && (
            <div className="mb-5">
              <h2
                className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Langues
              </h2>
              <div className="space-y-1 text-[10px]">
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <span className="font-medium text-gray-900">{lang.name}</span>
                    <span className="text-gray-500"> : {lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {content.hasSkills && (
            <div className="mb-5">
              <h2
                className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Compétences
              </h2>
              <div className="space-y-0.5 text-[10px] text-gray-700">
                {data.skills.map((skill) => (
                  <div key={skill.id}>{skill.name}</div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {content.hasInterests && (
            <div className="mb-5">
              <h2
                className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Centres d&apos;intérêt
              </h2>
              <div className="space-y-0.5 text-[10px] text-gray-700">
                {data.interests.map((interest) => (
                  <div key={interest.id}>{interest.name}</div>
                ))}
              </div>
            </div>
          )}

          {/* Additional info */}
          {(pi.nationality || pi.drivingLicense) && (
            <div className="mb-5">
              <h2
                className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Informations
              </h2>
              <div className="space-y-1 text-[10px] text-gray-700">
                {pi.nationality && (
                  <div>
                    <span className="font-medium">Nationalité :</span> {pi.nationality}
                  </div>
                )}
                {pi.drivingLicense && (
                  <div>
                    <span className="font-medium">Permis :</span> {pi.drivingLicense}
                  </div>
                )}
                {(pi.address || pi.city) && (
                  <div>
                    <span className="font-medium">Adresse :</span>{" "}
                    {[pi.address, pi.postalCode, pi.city].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1">
          {/* Education */}
          {content.hasEducation && (
            <div className="mb-5">
              <h2
                className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Formation
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-[11px] text-gray-900 uppercase">
                      {edu.degree}
                    </h3>
                    <p className="text-[10px] text-gray-600">
                      {[edu.school, edu.city].filter(Boolean).join(", ")}
                      {(edu.startDate || edu.endDate) && (
                        <> | {formatDateRange(edu.startDate, edu.endDate, edu.current)}</>
                      )}
                    </p>
                    {edu.description && (
                      <p className="text-[10px] text-gray-600 mt-0.5 whitespace-pre-line">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {content.hasExperience && (
            <div className="mb-5">
              <h2
                className="text-[12px] font-bold uppercase tracking-wider pb-1 mb-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Expérience
              </h2>
              <div className="space-y-3.5">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="font-bold text-[11px] text-gray-900 uppercase">
                      {exp.position}
                      {exp.company && (
                        <span className="font-normal text-gray-600"> - {exp.company}</span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      {[exp.city].filter(Boolean).join(", ")}
                      {(exp.startDate || exp.endDate) && (
                        <>{exp.city ? " | " : ""}{formatDateRange(exp.startDate, exp.endDate, exp.current)}</>
                      )}
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
          )}
        </div>
      </div>
    </div>
  );
}
