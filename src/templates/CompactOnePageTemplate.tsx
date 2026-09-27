import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { formatDisplayDate, getBulletSymbol, getFontFamilyClass } from './templateUtils';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const CompactOnePageTemplate: React.FC<Props> = ({ data, formatting }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const fontClass = getFontFamilyClass(formatting.fontFamily);
  const bulletSymbol = getBulletSymbol(formatting.bulletStyle);
  const accent = formatting.accentColor || '#0f172a';

  const isVisible = (sec: string) => formatting.sectionVisibility[sec] !== false;

  return (
    <div className={`bg-white text-slate-900 ${fontClass} text-[11px] leading-tight p-6 sm:p-7 w-full min-h-full`}>
      {/* Compact Header */}
      <header className="border-b-2 pb-2 mb-2 flex justify-between items-baseline" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950 uppercase">
            {personalInfo.fullName}
          </h1>
          <span className="font-semibold text-xs text-slate-700">{personalInfo.jobTitle}</span>
        </div>
        <div className="text-right text-[10px] text-slate-600 space-y-0.5">
          <div>{personalInfo.email} • {personalInfo.phone}</div>
          <div>{personalInfo.location} {personalInfo.linkedin ? `• ${personalInfo.linkedin.replace(/^https?:\/\//, '')}` : ''}</div>
        </div>
      </header>

      {/* Ultra Compact Grid */}
      <div className="space-y-2">
        {isVisible('summary') && personalInfo.summary && (
          <div className="text-slate-700 leading-snug">
            <span className="font-bold uppercase tracking-wider text-[10px] mr-1.5" style={{ color: accent }}>Summary:</span>
            {personalInfo.summary}
          </div>
        )}

        {/* Experience */}
        {isVisible('experience') && experience && experience.length > 0 && (
          <section className="space-y-1.5">
            <h2 className="text-[10px] uppercase font-bold tracking-wider border-b border-slate-300 pb-0.5" style={{ color: accent }}>
              Work Experience
            </h2>
            <div className="space-y-1.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <div>
                      <span>{exp.role}</span>
                      <span className="text-slate-500 font-normal">, {exp.company}</span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 font-normal">
                      {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? 'Pres' : formatDisplayDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.highlights && (
                    <ul className="space-y-0.5 mt-0.5 pl-1">
                      {exp.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="text-slate-700 flex items-start gap-1.5">
                          <span className="text-slate-400 select-none">{bulletSymbol}</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2-Column Compact Row: Education & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
          {/* Education */}
          {isVisible('education') && education && education.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-[10px] uppercase font-bold tracking-wider border-b border-slate-300 pb-0.5" style={{ color: accent }}>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-[10.5px]">
                  <div className="font-bold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-700">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-[9.5px] text-slate-500">
                    {formatDisplayDate(edu.startDate)} – {edu.isCurrent ? 'Pres' : formatDisplayDate(edu.endDate)} {edu.gpa ? `• GPA ${edu.gpa}` : ''}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {isVisible('skills') && skills && skills.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-[10px] uppercase font-bold tracking-wider border-b border-slate-300 pb-0.5" style={{ color: accent }}>
                Skills & Tech
              </h2>
              <div className="space-y-0.5 text-[10px]">
                {skills.map((grp) => (
                  <div key={grp.id} className="text-slate-800">
                    <span className="font-bold">{grp.category}: </span>
                    <span className="text-slate-600">{grp.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects / Certifications */}
        {isVisible('projects') && projects && projects.length > 0 && (
          <section className="space-y-1 pt-0.5">
            <h2 className="text-[10px] uppercase font-bold tracking-wider border-b border-slate-300 pb-0.5" style={{ color: accent }}>
              Key Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <span className="font-bold text-slate-900">{proj.name}: </span>
                  <span className="text-slate-700">{proj.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
