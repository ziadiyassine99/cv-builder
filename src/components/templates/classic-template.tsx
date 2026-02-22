import type { ResumeData } from "@/types/resume";
import { useI18n } from "@/lib/i18n";
import { formatDateRangeCompact, hasContent } from "./template-utils";

interface Props {
  data: ResumeData;
}

const SECTION_HEADING =
  "text-[11px] font-bold uppercase tracking-[0.08em] border-b border-neutral-300 pb-0.5 mb-2";

export function ClassicTemplate({ data }: Props) {
  const { t } = useI18n();
  const pi = data.personalInfo;
  const content = hasContent(data);

  const dateOpts = {
    months: t.templates.months,
    present: t.templates.present,
  };

  const contactParts = [pi.phone, pi.email].filter(Boolean);

  return (
    <div className="min-h-[297mm] text-[10.5px] leading-relaxed px-10 py-8 font-serif text-neutral-800">
      {/* ── Header ── */}
      <div className="text-center mb-1">
        <h1 className="text-[18px] font-normal tracking-wide">
          {pi.firstName}{" "}
          <span className="font-bold uppercase">{pi.lastName}</span>
        </h1>
        {contactParts.length > 0 && (
          <p className="text-[9.5px] text-neutral-500 mt-0.5">
            {contactParts.join(", ")}
          </p>
        )}
      </div>

      {/* ── Experience ── */}
      {content.hasExperience && (
        <section className="mt-5">
          <h2 className={SECTION_HEADING}>{t.templates.experiences}</h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="flex gap-5">
                <div className="w-[120px] shrink-0 text-[9px] text-neutral-500 pt-[2px] leading-snug">
                  {formatDateRangeCompact(exp.startDate, exp.endDate, exp.current, dateOpts)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[10.5px] leading-snug">
                    {exp.position}
                    {exp.company && `, ${exp.company}`}
                  </h3>
                  {exp.description && (
                    <p className="text-neutral-600 mt-1 text-[9.5px] leading-[1.55] whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education ── */}
      {content.hasEducation && (
        <section className="mt-5">
          <h2 className={SECTION_HEADING}>{t.templates.education}</h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex gap-5">
                <div className="w-[120px] shrink-0 text-[9px] text-neutral-500 pt-[2px] leading-snug">
                  {formatDateRangeCompact(edu.startDate, edu.endDate, edu.current, dateOpts)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[10.5px] leading-snug">
                    {edu.degree}
                    {edu.school && `, ${edu.school}`}
                  </h3>
                  {edu.description && (
                    <p className="text-neutral-600 mt-0.5 text-[9.5px] leading-[1.55] whitespace-pre-line">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Skills ── */}
      {content.hasSkills && (
        <section className="mt-5">
          <h2 className={SECTION_HEADING}>{t.templates.skills}</h2>
          <div className="grid grid-cols-2 gap-x-10 gap-y-0.5 mt-1">
            {data.skills.map((skill) => (
              <p key={skill.id} className="text-[9.5px] text-neutral-700">
                {skill.name}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* ── Custom Sections (Projects, etc.) ── */}
      {data.customSections.map((section) => (
        <section key={section.id} className="mt-5">
          <h2 className={SECTION_HEADING}>{section.title}</h2>
          <div className="space-y-2.5">
            {section.items.map((item) => (
              <div key={item.id}>
                <h3 className="font-bold text-[10.5px]">
                  {item.title}
                  {item.subtitle && ` : ${item.subtitle}`}
                </h3>
                {(item.startDate || item.endDate) && (
                  <p className="text-[9px] text-neutral-500">
                    {formatDateRangeCompact(item.startDate, item.endDate, false, dateOpts)}
                  </p>
                )}
                {item.description && (
                  <p className="text-neutral-600 mt-0.5 text-[9.5px] leading-[1.55] whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ── Languages ── */}
      {content.hasLanguages && (
        <section className="mt-5">
          <h2 className={SECTION_HEADING}>{t.templates.languages}</h2>
          <div className="flex flex-wrap gap-x-10 gap-y-1 mt-1">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex items-baseline gap-2 text-[9.5px]">
                <span className="font-medium text-neutral-800">{lang.name}</span>
                <span className="text-neutral-500">{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Interests ── */}
      {content.hasInterests && (
        <section className="mt-5">
          <h2 className={SECTION_HEADING}>{t.templates.interests}</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-1 mt-1">
            {data.interests.map((interest) => (
              <span key={interest.id} className="text-[9.5px] text-neutral-700">
                {interest.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
