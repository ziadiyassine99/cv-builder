import type { ResumeData } from "@/types/resume";
import { useI18n } from "@/lib/i18n";
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

function langBarWidth(level: string): string {
  const map: Record<string, string> = {
    "Langue maternelle": "100%",
    Native: "100%",
    Courant: "85%",
    Fluent: "85%",
    Avancé: "65%",
    Advanced: "65%",
    Intermédiaire: "50%",
    Intermediate: "50%",
    Débutant: "25%",
    Beginner: "25%",
  };
  return map[level] || "60%";
}

export function ElegantTemplate({ data }: Props) {
  const { t } = useI18n();
  const pi = data.personalInfo;
  const color = data.colorPrimary;
  const content = hasContent(data);

  const dateOpts = {
    months: t.templates.months,
    present: t.templates.present,
    from: t.templates.from,
    to: t.templates.to,
  };

  return (
    <div className="min-h-[297mm] text-[11px] leading-relaxed bg-[#f0ece4]">
      {/* ── Header ── */}
      <div
        className="flex items-center gap-5 px-7 py-5"
        style={{ backgroundColor: color }}
      >
        {pi.photo ? (
          <div
            className="w-[105px] h-[125px] rounded-lg overflow-hidden shrink-0"
            style={{ border: `3px solid ${color}`, boxShadow: "0 0 0 3px rgba(255,255,255,0.3)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pi.photo} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div
            className="w-[105px] h-[125px] rounded-lg shrink-0 bg-white/10"
            style={{ border: "3px solid rgba(255,255,255,0.25)" }}
          />
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-bold text-white tracking-wide leading-tight">
            {pi.firstName} {pi.lastName}
          </h1>
          {pi.jobTitle && (
            <p className="text-[12px] text-white/75 mt-0.5 tracking-wide">
              {pi.jobTitle}
            </p>
          )}

          {/* Row 1: email + phone */}
          <div className="flex items-center gap-5 mt-3">
            {pi.email && (
              <span className="text-white/90 text-[9px] flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {pi.email}
              </span>
            )}
            {pi.phone && (
              <span className="text-white/90 text-[9px] flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {pi.phone}
              </span>
            )}
          </div>

          {/* Row 2: address */}
          {(pi.address || pi.city) && (
            <div className="mt-1">
              <span className="text-white/90 text-[9px] flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {[pi.address, pi.postalCode, pi.city].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: two columns ── */}
      <div className="flex">
        {/* Left column */}
        <div className="w-[56%] px-7 py-5">
          {/* Profile / About me */}
          {content.hasProfile && (
            <div className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.profile}
              </h2>
              <p className="text-[10px] text-gray-600 leading-relaxed italic">
                {data.profile}
              </p>
            </div>
          )}

          {/* Education */}
          {content.hasEducation && (
            <div className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.education}
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[11px] text-gray-900">
                        {edu.degree}
                      </h3>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-[9px] text-gray-500 shrink-0 whitespace-nowrap">
                          {formatDateRange(edu.startDate, edu.endDate, edu.current, dateOpts)}
                        </span>
                      )}
                    </div>
                    {edu.school && (
                      <p className="text-[10px] text-gray-500 italic">
                        {[edu.school, edu.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5">
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
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.experience}
              </h2>
              <div className="space-y-3.5">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[11px] text-gray-900">
                        {exp.position}
                      </h3>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-[9px] text-gray-500 shrink-0 whitespace-nowrap">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current, dateOpts)}
                        </span>
                      )}
                    </div>
                    {exp.company && (
                      <p className="text-[10px] italic" style={{ color }}>
                        {[exp.company, exp.city].filter(Boolean).join(", ")}
                      </p>
                    )}
                    {exp.description && (
                      <ul className="mt-1 space-y-0.5">
                        {descriptionLines(exp.description).map((line, i) => (
                          <li key={i} className="flex gap-1.5 text-[10px] text-gray-600">
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

          {/* Custom Sections */}
          {data.customSections.map((section) => (
            <div key={section.id} className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-[11px] text-gray-900">
                        {item.title}
                      </h3>
                      {(item.startDate || item.endDate) && (
                        <span className="text-[9px] text-gray-500 shrink-0">
                          {formatDateRange(item.startDate, item.endDate, false, dateOpts)}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-[10px] text-gray-500 italic">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-[10px] text-gray-500 mt-0.5 whitespace-pre-line">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="w-[44%] px-6 py-5">
          {/* Skills */}
          {content.hasSkills && (
            <div className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.skills}
              </h2>
              <div className="space-y-1.5 mt-1">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="text-[11px]" style={{ color }}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {content.hasLanguages && (
            <div className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.languages}
              </h2>
              <div className="space-y-2.5 mt-2">
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <span className="text-[10px] text-gray-700">{lang.name}</span>
                    <div className="w-full h-[5px] bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: langBarWidth(lang.level),
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {content.hasInterests && (
            <div className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.interests}
              </h2>
              <div className="space-y-1.5 mt-2">
                {data.interests.map((interest) => (
                  <div
                    key={interest.id}
                    className="flex items-center gap-2 text-[11px] text-gray-700"
                  >
                    <span
                      className="w-[8px] h-[8px] shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {interest.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional info */}
          {(pi.nationality || pi.drivingLicense) && (
            <div className="mb-5">
              <h2 className="text-[14px] font-semibold italic text-gray-800 pb-1 mb-2 border-b border-gray-300">
                {t.templates.info}
              </h2>
              <div className="space-y-1 text-[10px] text-gray-700 mt-1">
                {pi.nationality && (
                  <div>
                    <span className="font-medium">{t.templates.nationality}</span> {pi.nationality}
                  </div>
                )}
                {pi.drivingLicense && (
                  <div>
                    <span className="font-medium">{t.templates.license}</span> {pi.drivingLicense}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
