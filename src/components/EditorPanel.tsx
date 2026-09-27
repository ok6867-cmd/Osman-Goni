import React, { useState } from 'react';
import {
  ResumeData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  CustomSection,
} from '../types/resume';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe2,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface Props {
  data: ResumeData;
  onChangeData: (updater: (prev: ResumeData) => ResumeData) => void;
  onOpenAiAssistant: (tab: 'summary' | 'bullet' | 'skills' | 'ats', initialText?: string, role?: string) => void;
}

export const EditorPanel: React.FC<Props> = ({ data, onChangeData, onOpenAiAssistant }) => {
  const [openSection, setOpenSection] = useState<string>('personal');

  const toggleAccordion = (sec: string) => {
    setOpenSection((prev) => (prev === sec ? '' : sec));
  };

  // Update Personal Info
  const updatePersonalInfo = <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
    onChangeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
      lastModified: Date.now(),
    }));
  };

  // EXPERIENCE
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'New Company Inc.',
      role: 'Software Engineer',
      location: 'City, State',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      highlights: ['Spearheaded key initiatives driving 25% efficiency gains across cross-functional engineering teams.'],
    };
    onChangeData((prev) => ({
      ...prev,
      experience: [newItem, ...prev.experience],
      lastModified: Date.now(),
    }));
  };

  const updateExperience = (id: string, patch: Partial<ExperienceItem>) => {
    onChangeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      lastModified: Date.now(),
    }));
  };

  const removeExperience = (id: string) => {
    onChangeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
      lastModified: Date.now(),
    }));
  };

  const addHighlight = (expId: string) => {
    onChangeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId ? { ...e, highlights: [...e.highlights, 'Delivered measurable business outcome using XYZ formula.'] } : e
      ),
      lastModified: Date.now(),
    }));
  };

  const updateHighlight = (expId: string, index: number, text: string) => {
    onChangeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e;
        const newHighlights = [...e.highlights];
        newHighlights[index] = text;
        return { ...e, highlights: newHighlights };
      }),
      lastModified: Date.now(),
    }));
  };

  const removeHighlight = (expId: string, index: number) => {
    onChangeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => {
        if (e.id !== expId) return e;
        const newHighlights = [...e.highlights];
        newHighlights.splice(index, 1);
        return { ...e, highlights: newHighlights };
      }),
      lastModified: Date.now(),
    }));
  };

  // EDUCATION
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'City, State',
      startDate: '2019-09',
      endDate: '2023-05',
      isCurrent: false,
    };
    onChangeData((prev) => ({
      ...prev,
      education: [...prev.education, newItem],
      lastModified: Date.now(),
    }));
  };

  const updateEducation = (id: string, patch: Partial<EducationItem>) => {
    onChangeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...patch } : edu)),
      lastModified: Date.now(),
    }));
  };

  const removeEducation = (id: string) => {
    onChangeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
      lastModified: Date.now(),
    }));
  };

  // SKILLS
  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: `skill-${Date.now()}`,
      category: 'New Category',
      items: ['Skill 1', 'Skill 2'],
    };
    onChangeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newGroup],
      lastModified: Date.now(),
    }));
  };

  const updateSkillGroup = (id: string, patch: Partial<SkillGroup>) => {
    onChangeData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      lastModified: Date.now(),
    }));
  };

  const removeSkillGroup = (id: string) => {
    onChangeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
      lastModified: Date.now(),
    }));
  };

  // PROJECTS
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Key Project Name',
      role: 'Lead Developer',
      description: 'Built scalable real-time web application servicing thousands of concurrent users.',
      highlights: [],
      technologies: ['React', 'TypeScript', 'Node.js'],
    };
    onChangeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
      lastModified: Date.now(),
    }));
  };

  const updateProject = (id: string, patch: Partial<ProjectItem>) => {
    onChangeData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      lastModified: Date.now(),
    }));
  };

  const removeProject = (id: string) => {
    onChangeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      lastModified: Date.now(),
    }));
  };

  // CERTIFICATIONS
  const addCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Certificate Name',
      issuer: 'Issuing Organization',
      issueDate: '2023-06',
    };
    onChangeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
      lastModified: Date.now(),
    }));
  };

  const updateCertification = (id: string, patch: Partial<CertificationItem>) => {
    onChangeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      lastModified: Date.now(),
    }));
  };

  const removeCertification = (id: string) => {
    onChangeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
      lastModified: Date.now(),
    }));
  };

  // LANGUAGES
  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: 'Language',
      proficiency: 'Fluent',
    };
    onChangeData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLang],
      lastModified: Date.now(),
    }));
  };

  const updateLanguage = (id: string, patch: Partial<LanguageItem>) => {
    onChangeData((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      lastModified: Date.now(),
    }));
  };

  const removeLanguage = (id: string) => {
    onChangeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
      lastModified: Date.now(),
    }));
  };

  return (
    <div className="w-full h-full bg-slate-900 overflow-y-auto text-slate-100 p-4 sm:p-5 space-y-4">
      {/* 1. PERSONAL INFORMATION */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion('personal')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Personal Information</h3>
              <p className="text-[11px] text-slate-400">Name, target role, contact channels, and executive summary</p>
            </div>
          </div>
          {openSection === 'personal' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'personal' && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Job Title / Target Role *</label>
                <input
                  type="text"
                  value={data.personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Full-Stack Cloud Architect"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Phone Number *</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Location (City, Country)</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Personal Website / Portfolio</label>
                <input
                  type="text"
                  value={data.personalInfo.website || ''}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="https://mywebsite.com"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">LinkedIn Profile</label>
                <input
                  type="text"
                  value={data.personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">GitHub / Profile URL</label>
                <input
                  type="text"
                  value={data.personalInfo.github || ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="github.com/username"
                  className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Profile Photo URL</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={data.personalInfo.photoUrl || ''}
                  onChange={(e) => updatePersonalInfo('photoUrl', e.target.value)}
                  placeholder="https://... image URL (or clear to omit)"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                {data.personalInfo.photoUrl && (
                  <button
                    onClick={() => updatePersonalInfo('photoUrl', '')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Professional Summary</label>
                <button
                  onClick={() => onOpenAiAssistant('summary')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-[11px] font-medium transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI Summary Writer
                </button>
              </div>
              <textarea
                rows={3}
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="Brief 3-4 sentence elevator pitch highlighting key career accomplishments, domains, and core skills..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. WORK EXPERIENCE */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion('experience')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Work Experience ({data.experience.length})
              </h3>
              <p className="text-[11px] text-slate-400">Chronological employment history and achievement bullet points</p>
            </div>
          </div>
          {openSection === 'experience' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'experience' && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center pb-1">
              <span className="text-xs text-slate-400">Lead with measurable results, percentages, and leadership impact.</span>
              <button
                onClick={addExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Job
              </button>
            </div>

            <div className="space-y-4">
              {data.experience.map((exp, expIdx) => (
                <div key={exp.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Position #{expIdx + 1}</span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition"
                      title="Remove Role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Job Title / Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        placeholder="e.g. New York, NY"
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-medium">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="YYYY-MM (e.g. 2021-04)"
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-400 font-medium">End Date</label>
                        <label className="text-[10px] text-indigo-400 flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                            className="rounded"
                          />
                          Current
                        </label>
                      </div>
                      <input
                        type="text"
                        disabled={exp.isCurrent}
                        value={exp.isCurrent ? 'Present' : exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="YYYY-MM"
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 disabled:opacity-50 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 pt-1 border-t border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-300">Achievement Bullet Points</span>
                      <button
                        onClick={() => addHighlight(exp.id)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-1.5 group">
                          <textarea
                            rows={2}
                            value={h}
                            onChange={(e) => updateHighlight(exp.id, hIdx, e.target.value)}
                            placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => onOpenAiAssistant('bullet', h, exp.role)}
                              title="Enhance with AI"
                              className="p-1.5 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 hover:text-indigo-200 transition"
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeHighlight(exp.id, hIdx)}
                              title="Delete Bullet"
                              className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-700/40 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. EDUCATION */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion('education')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Education ({data.education.length})
              </h3>
              <p className="text-[11px] text-slate-400">Degrees, academic institutions, GPAs, and honors</p>
            </div>
          </div>
          {openSection === 'education' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'education' && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={addEducation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-400">{edu.institution}</span>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400">School / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">Degree & Major</label>
                      <input
                        type="text"
                        value={`${edu.degree} in ${edu.fieldOfStudy}`}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parts = val.split(' in ');
                          updateEducation(edu.id, {
                            degree: parts[0] || val,
                            fieldOfStudy: parts[1] || '',
                          });
                        }}
                        placeholder="Bachelor of Science in Computer Science"
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400">Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">Graduation Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        placeholder="YYYY-MM"
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400">GPA / Honors</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="e.g. 3.9 / 4.0"
                        className="mt-0.5 w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. SKILLS & COMPETENCIES */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion('skills')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Skills & Tech Stack ({data.skills.length} groups)
              </h3>
              <p className="text-[11px] text-slate-400">Hard skills, frameworks, tools, and methodologies</p>
            </div>
          </div>
          {openSection === 'skills' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'skills' && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => onOpenAiAssistant('skills')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-medium transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Suggest Skills
              </button>
              <button
                onClick={addSkillGroup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>

            <div className="space-y-3">
              {data.skills.map((grp) => (
                <div key={grp.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={grp.category}
                      onChange={(e) => updateSkillGroup(grp.id, { category: e.target.value })}
                      placeholder="Category Name"
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => removeSkillGroup(grp.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Comma-separated skills:</label>
                    <input
                      type="text"
                      value={grp.items.join(', ')}
                      onChange={(e) => {
                        const items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        updateSkillGroup(grp.id, { items });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. PROJECTS */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion('projects')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Projects ({data.projects.length})
              </h3>
              <p className="text-[11px] text-slate-400">Open source repos, live products, and portfolio items</p>
            </div>
          </div>
          {openSection === 'projects' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'projects' && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={addProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-400">{proj.name}</span>
                    <button onClick={() => removeProject(proj.id)} className="p-1 rounded text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      placeholder="Project Name"
                      className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100"
                    />
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      placeholder="Link (https://...)"
                      className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Short description of technical architecture and outcomes..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-xs text-slate-100"
                  />
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Technologies (comma separated):</label>
                    <input
                      type="text"
                      value={proj.technologies?.join(', ') || ''}
                      onChange={(e) => {
                        const technologies = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                        updateProject(proj.id, { technologies });
                      }}
                      placeholder="TypeScript, Next.js, Redis"
                      className="w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. CERTIFICATIONS & LANGUAGES */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion('extras')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Certifications & Languages
              </h3>
              <p className="text-[11px] text-slate-400">AWS, CKA, PMP certificates, and multilingual proficiencies</p>
            </div>
          </div>
          {openSection === 'extras' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'extras' && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-5">
            {/* Certifications */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Certifications</span>
                <button
                  onClick={addCertification}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Cert
                </button>
              </div>
              {data.certifications.map((c) => (
                <div key={c.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                    placeholder="Certificate Title"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100"
                  />
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                    placeholder="Issuer"
                    className="w-32 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100"
                  />
                  <button onClick={() => removeCertification(c.id)} className="p-1 rounded text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="space-y-3 pt-3 border-t border-slate-700/60">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Languages</span>
                <button
                  onClick={addLanguage}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Language
                </button>
              </div>
              {data.languages.map((l) => (
                <div key={l.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={l.language}
                    onChange={(e) => updateLanguage(l.id, { language: e.target.value })}
                    placeholder="Language (e.g. English, French)"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-100"
                  />
                  <select
                    value={l.proficiency}
                    onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value as any })}
                    className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-100"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button onClick={() => removeLanguage(l.id)} className="p-1 rounded text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
