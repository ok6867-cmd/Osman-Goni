import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { formatDisplayDate, getBulletSymbol, getFontFamilyClass, getFontSizeClasses, getMarginPaddingClass } from './templateUtils';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const ClassicSerifTemplate: React.FC<Props> = ({ data, formatting }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = data;
  const fontClass = getFontFamilyClass(formatting.fontFamily || 'merriweather');
  const sizeClass = getFontSizeClasses(formatting.fontSize);
  const marginClass = getMarginPaddingClass(formatting.marginSize);
  const bulletSymbol = getBulletSymbol(formatting.bulletStyle);
  const accent = formatting.accentColor || '#1e3a8a';

  const isVisible = (sec: string) => formatting.sectionVisibility[sec] !== false;

  return (
    <div className={`bg-white text-slate-900 ${fontClass} ${sizeClass.base} ${marginClass} w-full min-h-full`}>
      {/* Centered Traditional Header */}
      <header className="text-center pb-4 mb-4 border-b border-slate-900">
        <h1 className="text-2xl font-bold tracking-normal uppercase text-slate-950 font-serif">
          {personalInfo.fullName}
        </h1>
        {personalInfo.jobTitle && (
          <div className="text-xs uppercase tracking-widest text-slate-700 font-semibold mt-1">
            {personalInfo.jobTitle}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-slate-700 mt-2 font-sans">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && (
            <span>• {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
          {personalInfo.website && (
            <span>• {personalInfo.website.replace(/^https?:\/\//, '')}</span>
          )}
        </div>
      </header>

      {/* Structured Sections */}
      <div className="space-y-4">
        {formatting.sectionOrder.map((sectionId) => {
          if (!isVisible(sectionId)) return null;

          if (sectionId === 'summary' && personalInfo.summary) {
            return (
              <section key="summary" className="space-y-1">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-950 border-b border-slate-300 pb-0.5 font-serif" style={{ color: accent }}>
                  Professional Profile
                </h2>
                <p className={`${sizeClass.body} text-slate-800 leading-relaxed text-justify`}>
                  {personalInfo.summary}
                </p>
              </section>
            );
          }

          if (sectionId === 'education' && education && education.length > 0) {
            return (
              <section key="education" className="space-y-2">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-950 border-b border-slate-300 pb-0.5 font-serif" style={{ color: accent }}>
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-950">{edu.institution}</span>
                        <span className="text-[11px] text-slate-600 font-sans">
                          {formatDisplayDate(edu.startDate)} – {edu.isCurrent ? 'Present' : formatDisplayDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[12px] italic text-slate-800">
                        <span>
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                          {edu.gpa ? `, GPA: ${edu.gpa}` : ''}
                        </span>
                        {edu.location && <span className="font-sans not-italic text-[11px] text-slate-600">{edu.location}</span>}
                      </div>
                      {edu.honors && <div className="text-[11px] text-slate-600 font-sans">Honors: {edu.honors}</div>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'experience' && experience && experience.length > 0) {
            return (
              <section key="experience" className="space-y-3">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-950 border-b border-slate-300 pb-0.5 font-serif" style={{ color: accent }}>
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-950">{exp.company}</span>
                        <span className="text-[11px] text-slate-600 font-sans">
                          {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDisplayDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[12px] italic text-slate-800">
                        <span>{exp.role}</span>
                        {exp.location && <span className="font-sans not-italic text-[11px] text-slate-600">{exp.location}</span>}
                      </div>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1 mt-1 pl-1 font-sans">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className={`${sizeClass.body} text-slate-800 flex items-start gap-2`}>
                              <span className="text-slate-500 mt-0.5">{bulletSymbol}</span>
                              <span className="flex-1">{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'skills' && skills && skills.length > 0) {
            return (
              <section key="skills" className="space-y-1.5">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-950 border-b border-slate-300 pb-0.5 font-serif" style={{ color: accent }}>
                  Skills & Certifications
                </h2>
                <div className="space-y-1 text-[12px] font-sans">
                  {skills.map((grp) => (
                    <div key={grp.id} className="flex gap-2">
                      <span className="font-semibold text-slate-900 min-w-32">{grp.category}:</span>
                      <span className="text-slate-700">{grp.items.join(', ')}</span>
                    </div>
                  ))}
                  {certifications && certifications.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      <span className="font-semibold text-slate-900 min-w-32">Certifications:</span>
                      <span className="text-slate-700">
                        {certifications.map((c) => `${c.name} (${c.issuer})`).join('; ')}
                      </span>
                    </div>
                  )}
                  {languages && languages.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      <span className="font-semibold text-slate-900 min-w-32">Languages:</span>
                      <span className="text-slate-700">
                        {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (sectionId === 'projects' && projects && projects.length > 0) {
            return (
              <section key="projects" className="space-y-2">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-950 border-b border-slate-300 pb-0.5 font-serif" style={{ color: accent }}>
                  Key Initiatives & Research
                </h2>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{proj.name}</span>
                        {proj.date && <span className="text-[11px] text-slate-600 font-sans">{proj.date}</span>}
                      </div>
                      <p className={`${sizeClass.body} text-slate-700`}>{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
