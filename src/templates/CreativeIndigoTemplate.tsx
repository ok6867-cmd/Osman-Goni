import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { formatDisplayDate, getBulletSymbol, getFontFamilyClass, getFontSizeClasses, getMarginPaddingClass } from './templateUtils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const CreativeIndigoTemplate: React.FC<Props> = ({ data, formatting }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const fontClass = getFontFamilyClass(formatting.fontFamily);
  const sizeClass = getFontSizeClasses(formatting.fontSize);
  const marginClass = getMarginPaddingClass(formatting.marginSize);
  const bulletSymbol = getBulletSymbol(formatting.bulletStyle);
  const accent = formatting.accentColor || '#4338ca';

  const isVisible = (sec: string) => formatting.sectionVisibility[sec] !== false;

  return (
    <div className={`bg-white text-slate-900 ${fontClass} ${sizeClass.base} ${marginClass} w-full min-h-full`}>
      {/* Creative Header Banner */}
      <header className="relative bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 overflow-hidden shadow-sm" style={{ backgroundColor: accent }}>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {formatting.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className={`w-24 h-24 object-cover border-4 border-white/20 shadow-md ${
                formatting.photoShape === 'circle' ? 'rounded-full' : formatting.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'
              }`}
            />
          )}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {personalInfo.fullName}
            </h1>
            <p className="text-white/90 text-sm font-medium tracking-wide mt-1">
              {personalInfo.jobTitle}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-white/80 mt-3">
              {personalInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 opacity-80" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 opacity-80" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 opacity-80" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 opacity-80" />
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="underline">
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-5">
        {formatting.sectionOrder.map((sectionId) => {
          if (!isVisible(sectionId)) return null;

          if (sectionId === 'summary' && personalInfo.summary) {
            return (
              <section key="summary" className="space-y-1.5">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>
                  About Me
                </div>
                <p className={`${sizeClass.body} text-slate-700 leading-relaxed`}>
                  {personalInfo.summary}
                </p>
              </section>
            );
          }

          if (sectionId === 'experience' && experience && experience.length > 0) {
            return (
              <section key="experience" className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>
                  Experience
                </div>
                <div className="space-y-4 border-l-2 pl-4 ml-1" style={{ borderColor: `${accent}40` }}>
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative space-y-1">
                      <div
                        className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: accent }}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{exp.role}</span>
                          <span className="font-medium text-slate-600 ml-1.5">@ {exp.company}</span>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDisplayDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1 mt-1 pl-1">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className={`${sizeClass.body} text-slate-700 flex items-start gap-2`}>
                              <span className="font-bold mt-0.5" style={{ color: accent }}>{bulletSymbol}</span>
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
              <section key="skills" className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>
                  Expertise & Skills
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((grp) => (
                    <div key={grp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-xs uppercase tracking-wide mb-1.5" style={{ color: accent }}>
                        {grp.category}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {grp.items.map((item, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
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
                <div className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>
                  Featured Projects
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-white border border-slate-200 rounded-xl hover:shadow-xs transition">
                      <div className="font-bold text-slate-900 text-xs">{proj.name}</div>
                      <p className={`${sizeClass.body} text-slate-600 mt-1`}>{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
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

          if (sectionId === 'education' && education && education.length > 0) {
            return (
              <section key="education" className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>
                  Education
                </div>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                        <div className="text-slate-600 text-xs">{edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {formatDisplayDate(edu.startDate)} – {edu.isCurrent ? 'Present' : formatDisplayDate(edu.endDate)}
                      </span>
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
