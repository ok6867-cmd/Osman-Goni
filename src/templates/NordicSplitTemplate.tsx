import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { formatDisplayDate, getBulletSymbol, getFontFamilyClass, getFontSizeClasses, getMarginPaddingClass } from './templateUtils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const NordicSplitTemplate: React.FC<Props> = ({ data, formatting }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;
  const fontClass = getFontFamilyClass(formatting.fontFamily);
  const sizeClass = getFontSizeClasses(formatting.fontSize);
  const marginClass = getMarginPaddingClass(formatting.marginSize);
  const bulletSymbol = getBulletSymbol(formatting.bulletStyle);
  const accent = formatting.accentColor || '#0f766e';

  const isVisible = (sec: string) => formatting.sectionVisibility[sec] !== false;

  return (
    <div className={`bg-white text-slate-900 ${fontClass} ${sizeClass.base} w-full min-h-full flex flex-col md:flex-row`}>
      {/* Left Sidebar */}
      <aside className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-6 md:p-8 flex flex-col gap-6 shrink-0">
        {/* Photo and Identity */}
        <div className="space-y-3">
          {formatting.showPhoto && personalInfo.photoUrl && (
            <div className="flex justify-center md:justify-start">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className={`w-28 h-28 object-cover border-2 shadow-sm ${
                  formatting.photoShape === 'circle' ? 'rounded-full' : formatting.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'
                }`}
                style={{ borderColor: accent }}
              />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight leading-tight">
              {personalInfo.fullName}
            </h1>
            <p className="text-xs font-semibold mt-1 uppercase tracking-wider" style={{ color: accent }}>
              {personalInfo.jobTitle}
            </p>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-2 text-[11.5px] text-slate-600 border-t border-slate-200 pt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Contact
          </div>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="truncate hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
        </div>

        {/* Skills in Sidebar */}
        {isVisible('skills') && skills && skills.length > 0 && (
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Skills
            </div>
            {skills.map((grp) => (
              <div key={grp.id} className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-800">{grp.category}</div>
                <div className="flex flex-wrap gap-1">
                  {grp.items.map((item, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education in Sidebar */}
        {isVisible('education') && education && education.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Education
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="text-[11.5px]">
                <div className="font-semibold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution}</div>
                <div className="text-[10.5px] text-slate-400">
                  {formatDisplayDate(edu.startDate)} – {edu.isCurrent ? 'Present' : formatDisplayDate(edu.endDate)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages in Sidebar */}
        {isVisible('languages') && languages && languages.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Languages
            </div>
            <div className="space-y-1 text-[11px]">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between text-slate-700">
                  <span className="font-medium">{l.language}</span>
                  <span className="text-slate-500">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {isVisible('certifications') && certifications && certifications.length > 0 && (
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Certifications
            </div>
            {certifications.map((c) => (
              <div key={c.id} className="text-[11px]">
                <div className="font-semibold text-slate-900">{c.name}</div>
                <div className="text-[10px] text-slate-500">{c.issuer} ({formatDisplayDate(c.issueDate)})</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Right Main Column */}
      <main className={`flex-1 ${marginClass} flex flex-col gap-6`}>
        {/* Professional Summary */}
        {isVisible('summary') && personalInfo.summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: accent }}>
              Profile Overview
            </h2>
            <p className={`${sizeClass.body} text-slate-700 leading-relaxed`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {isVisible('experience') && experience && experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: accent }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-slate-500 ml-1.5 font-medium">| {exp.company}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDisplayDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1 mt-1 pl-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className={`${sizeClass.body} text-slate-700 flex items-start gap-2`}>
                          <span className="text-slate-400 mt-0.5" style={{ color: accent }}>{bulletSymbol}</span>
                          <span className="flex-1">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {isVisible('projects') && projects && projects.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: accent }}>
              Selected Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.date && <span className="text-[11px] text-slate-500">{proj.date}</span>}
                  </div>
                  <p className={`${sizeClass.body} text-slate-700`}>{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
