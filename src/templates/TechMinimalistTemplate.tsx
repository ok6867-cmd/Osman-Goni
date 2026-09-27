import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { formatDisplayDate, getBulletSymbol, getFontFamilyClass, getFontSizeClasses, getMarginPaddingClass } from './templateUtils';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const TechMinimalistTemplate: React.FC<Props> = ({ data, formatting }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = data;
  const fontClass = getFontFamilyClass(formatting.fontFamily);
  const sizeClass = getFontSizeClasses(formatting.fontSize);
  const marginClass = getMarginPaddingClass(formatting.marginSize);
  const bulletSymbol = getBulletSymbol(formatting.bulletStyle);
  const accent = formatting.accentColor || '#0f172a';

  const isVisible = (sec: string) => formatting.sectionVisibility[sec] !== false;

  return (
    <div className={`bg-white text-slate-900 ${fontClass} ${sizeClass.base} ${marginClass} w-full min-h-full`}>
      {/* Top ATS Clean Header */}
      <header className="border-b border-slate-300 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`${sizeClass.title} font-bold text-slate-950 tracking-tight uppercase`}>
              {personalInfo.fullName}
            </h1>
            <div className={`${sizeClass.subtitle} font-mono font-medium mt-0.5 text-slate-600`}>
              {personalInfo.jobTitle}
            </div>
          </div>
          {formatting.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-16 h-16 object-cover border border-slate-300 ${
                formatting.photoShape === 'circle' ? 'rounded-full' : formatting.photoShape === 'rounded' ? 'rounded-lg' : ''
              }`}
            />
          )}
        </div>

        {/* ATS-friendly inline contact row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 font-mono text-[11px] mt-2.5">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && (
            <span>
              • <a href={personalInfo.website} target="_blank" rel="noreferrer" className="underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>• {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
          {personalInfo.github && (
            <span>• {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
          )}
        </div>
      </header>

      {/* Ordered Content */}
      <div className="space-y-3.5">
        {formatting.sectionOrder.map((sectionId) => {
          if (!isVisible(sectionId)) return null;

          if (sectionId === 'summary' && personalInfo.summary) {
            return (
              <section key="summary" className="space-y-1">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Summary
                </h2>
                <p className={`${sizeClass.body} text-slate-700 leading-normal`}>
                  {personalInfo.summary}
                </p>
              </section>
            );
          }

          if (sectionId === 'skills' && skills && skills.length > 0) {
            return (
              <section key="skills" className="space-y-1.5">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Technical Stack & Core Competencies
                </h2>
                <div className="space-y-1 font-mono text-[11.5px]">
                  {skills.map((grp) => (
                    <div key={grp.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                      <span className="font-bold text-slate-800 min-w-36 text-slate-900">[{grp.category}]:</span>
                      <span className="text-slate-700 font-sans">{grp.items.join(' • ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'experience' && experience && experience.length > 0) {
            return (
              <section key="experience" className="space-y-2.5">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Experience
                </h2>
                <div className="space-y-2.5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <div>
                          <span className="font-bold text-slate-950">{exp.role}</span>
                          <span className="text-slate-500 font-medium"> @ {exp.company}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? 'PRESENT' : formatDisplayDate(exp.endDate)} {exp.location ? `[${exp.location}]` : ''}
                        </span>
                      </div>

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1 mt-1 pl-1">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className={`${sizeClass.body} text-slate-700 flex items-start gap-2`}>
                              <span className="font-mono text-slate-400 mt-0.5" style={{ color: accent }}>{bulletSymbol}</span>
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

          if (sectionId === 'projects' && projects && projects.length > 0) {
            return (
              <section key="projects" className="space-y-2">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Projects & Open Source
                </h2>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-slate-900">
                          {proj.name}
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 font-mono text-[10.5px] ml-2 underline">
                              source
                            </a>
                          )}
                        </div>
                        {proj.date && <span className="text-[11px] font-mono text-slate-500">{proj.date}</span>}
                      </div>
                      <p className={`${sizeClass.body} text-slate-700`}>{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="text-[11px] font-mono text-slate-500">
                          Stack: {proj.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'education' && education && education.length > 0) {
            return (
              <section key="education" className="space-y-1.5">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Education
                </h2>
                <div className="space-y-1.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{edu.institution}</span>
                        <div className="text-slate-700 text-[12px]">
                          {edu.degree} in {edu.fieldOfStudy} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {formatDisplayDate(edu.startDate)} – {edu.isCurrent ? 'PRESENT' : formatDisplayDate(edu.endDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'certifications' && certifications && certifications.length > 0) {
            return (
              <section key="certifications" className="space-y-1">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Certifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11.5px]">
                  {certifications.map((c) => (
                    <div key={c.id} className="text-slate-800">
                      <span className="font-semibold">{c.name}</span> — <span className="text-slate-500">{c.issuer} ({formatDisplayDate(c.issueDate)})</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'languages' && languages && languages.length > 0) {
            return (
              <section key="languages" className="space-y-1">
                <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                  // Languages
                </h2>
                <div className="flex gap-4 text-[12px] font-mono">
                  {languages.map((l) => (
                    <span key={l.id} className="text-slate-700">
                      {l.language}: <span className="text-slate-500">{l.proficiency}</span>
                    </span>
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
