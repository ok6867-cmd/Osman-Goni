import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { formatDisplayDate, getBulletSymbol, getFontFamilyClass, getFontSizeClasses, getMarginPaddingClass } from './templateUtils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const ExecutiveNoirTemplate: React.FC<Props> = ({ data, formatting }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, customSections } = data;
  const fontClass = getFontFamilyClass(formatting.fontFamily);
  const sizeClass = getFontSizeClasses(formatting.fontSize);
  const marginClass = getMarginPaddingClass(formatting.marginSize);
  const bulletSymbol = getBulletSymbol(formatting.bulletStyle);
  const accent = formatting.accentColor || '#0f172a';

  const isVisible = (sec: string) => formatting.sectionVisibility[sec] !== false;

  return (
    <div className={`bg-white text-slate-900 ${fontClass} ${sizeClass.base} ${marginClass} w-full min-h-full`}>
      {/* Header */}
      <header className="border-b-2 pb-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: accent }}>
        <div className="flex items-center gap-5">
          {formatting.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-20 h-20 object-cover border border-slate-200 shadow-sm ${
                formatting.photoShape === 'circle' ? 'rounded-full' : formatting.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'
              }`}
            />
          )}
          <div>
            <h1 className={`${sizeClass.title} tracking-tight font-extrabold text-slate-900`}>
              {personalInfo.fullName}
            </h1>
            <p className={`${sizeClass.subtitle} font-semibold mt-0.5`} style={{ color: accent }}>
              {personalInfo.jobTitle}
            </p>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="flex flex-wrap md:flex-col md:items-end gap-x-4 gap-y-1 text-slate-600 text-[11.5px]">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <span>{personalInfo.email}</span>
              <Mail className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <span>{personalInfo.phone}</span>
              <Phone className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <span>{personalInfo.location}</span>
              <MapPin className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
              <Globe className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
              <Linkedin className="w-3 h-3 text-slate-400" />
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5">
              <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
              <Github className="w-3 h-3 text-slate-400" />
            </div>
          )}
        </div>
      </header>

      {/* Sections driven by sectionOrder */}
      <div className="space-y-4">
        {formatting.sectionOrder.map((sectionId) => {
          if (!isVisible(sectionId)) return null;

          if (sectionId === 'summary' && personalInfo.summary) {
            return (
              <section key="summary" className="space-y-1.5">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200 flex items-center justify-between`} style={{ color: accent }}>
                  <span>Executive Summary</span>
                </h2>
                <p className={`${sizeClass.body} text-slate-700 leading-relaxed text-justify`}>
                  {personalInfo.summary}
                </p>
              </section>
            );
          }

          if (sectionId === 'experience' && experience && experience.length > 0) {
            return (
              <section key="experience" className="space-y-3">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                  Work Experience
                </h2>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <span className={`${sizeClass.subheading} font-bold text-slate-900`}>{exp.role}</span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="font-medium text-slate-700">{exp.company}</span>
                        </div>
                        <div className={`${sizeClass.meta} font-medium`}>
                          {formatDisplayDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDisplayDate(exp.endDate)}
                          {exp.location ? ` | ${exp.location}` : ''}
                        </div>
                      </div>

                      {exp.description && (
                        <p className={`${sizeClass.body} text-slate-600 italic`}>{exp.description}</p>
                      )}

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1 mt-1 pl-1">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className={`${sizeClass.body} text-slate-700 flex items-start gap-2`}>
                              <span className="select-none font-bold text-slate-400 mt-0.5" style={{ color: accent }}>{bulletSymbol}</span>
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

          if (sectionId === 'education' && education && education.length > 0) {
            return (
              <section key="education" className="space-y-2">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <span className={`${sizeClass.subheading} font-bold text-slate-900`}>
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                        </span>
                        <div className="text-slate-600 text-[12px]">
                          {edu.institution} {edu.location ? `• ${edu.location}` : ''}
                          {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                          {edu.honors ? ` (${edu.honors})` : ''}
                        </div>
                      </div>
                      <div className={`${sizeClass.meta} font-medium whitespace-nowrap`}>
                        {formatDisplayDate(edu.startDate)} — {edu.isCurrent ? 'Present' : formatDisplayDate(edu.endDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'skills' && skills && skills.length > 0) {
            return (
              <section key="skills" className="space-y-1.5">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                  Key Competencies & Technical Skills
                </h2>
                <div className="space-y-1.5">
                  {skills.map((grp) => (
                    <div key={grp.id} className={`${sizeClass.body} flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2`}>
                      <span className="font-bold text-slate-900 min-w-32">{grp.category}:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {grp.items.map((item, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'projects' && projects && projects.length > 0) {
            return (
              <section key="projects" className="space-y-2">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                  Key Projects & Initiatives
                </h2>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <span className={`${sizeClass.subheading} font-bold text-slate-900`}>{proj.name}</span>
                          {proj.role && <span className="text-slate-500 text-[11.5px] ml-2">({proj.role})</span>}
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 text-[11px] ml-2 hover:underline">
                              View Project →
                            </a>
                          )}
                        </div>
                        {proj.date && <div className={sizeClass.meta}>{proj.date}</div>}
                      </div>
                      <p className={`${sizeClass.body} text-slate-700`}>{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'certifications' && certifications && certifications.length > 0) {
            return (
              <section key="certifications" className="space-y-1.5">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                  Certifications & Licenses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {certifications.map((c) => (
                    <div key={c.id} className="border-l-2 pl-2" style={{ borderColor: accent }}>
                      <div className="font-semibold text-slate-900 text-[12px]">{c.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.issuer} • {formatDisplayDate(c.issueDate)}
                        {c.credentialId ? ` (ID: ${c.credentialId})` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'languages' && languages && languages.length > 0) {
            return (
              <section key="languages" className="space-y-1">
                <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                  Languages
                </h2>
                <div className="flex flex-wrap gap-4 text-[12px]">
                  {languages.map((l) => (
                    <div key={l.id} className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800">{l.language}:</span>
                      <span className="text-slate-600">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'custom' && customSections && customSections.length > 0) {
            return (
              <div key="custom" className="space-y-3">
                {customSections.map((sec) => (
                  <section key={sec.id} className="space-y-2">
                    <h2 className={`${sizeClass.heading} pb-1 border-b border-slate-200`} style={{ color: accent }}>
                      {sec.title}
                    </h2>
                    <div className="space-y-1.5">
                      {sec.items.map((item) => (
                        <div key={item.id}>
                          <div className="flex items-baseline justify-between">
                            <span className="font-semibold text-slate-900 text-[12px]">{item.title}</span>
                            {item.date && <span className={sizeClass.meta}>{item.date}</span>}
                          </div>
                          {item.subtitle && <div className="text-slate-600 text-[11px]">{item.subtitle}</div>}
                          {item.description && <p className={`${sizeClass.body} text-slate-700 mt-0.5`}>{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
