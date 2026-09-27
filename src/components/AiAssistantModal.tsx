import React, { useState } from 'react';
import { ResumeData, ATSReviewResult } from '../types/resume';
import { Sparkles, X, Check, Copy, Wand2, ShieldCheck, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onApplySummary?: (summary: string) => void;
  onApplyBullet?: (enhancedBullet: string) => void;
  onApplySkills?: (skills: string[], category: string) => void;
  initialTab?: 'summary' | 'bullet' | 'skills' | 'ats';
  activeBulletText?: string;
  activeRole?: string;
}

export const AiAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  resumeData,
  onApplySummary,
  onApplyBullet,
  onApplySkills,
  initialTab = 'ats',
  activeBulletText = '',
  activeRole = '',
}) => {
  const [activeTab, setActiveTab] = useState<'ats' | 'summary' | 'bullet' | 'skills'>(initialTab);

  // ATS State
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSReviewResult | null>(null);
  const [atsError, setAtsError] = useState<string | null>(null);

  // Summary State
  const [summaryRole, setSummaryRole] = useState(resumeData.personalInfo.jobTitle || '');
  const [summaryExp, setSummaryExp] = useState('5');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<Array<{ tone: string; text: string }>>([]);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Bullet Enhancer State
  const [bulletInput, setBulletInput] = useState(activeBulletText || '');
  const [bulletRole, setBulletRole] = useState(activeRole || resumeData.personalInfo.jobTitle || '');
  const [bulletLoading, setBulletLoading] = useState(false);
  const [bulletOptions, setBulletOptions] = useState<Array<{ style: string; text: string }>>([]);
  const [bulletError, setBulletError] = useState<string | null>(null);

  // Skills Recommender State
  const [skillRole, setSkillRole] = useState(resumeData.personalInfo.jobTitle || '');
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillResult, setSkillResult] = useState<{ technical?: string[]; tools?: string[]; soft?: string[] } | null>(null);
  const [skillError, setSkillError] = useState<string | null>(null);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Run ATS audit
  const runAtsAudit = async () => {
    setAtsLoading(true);
    setAtsError(null);
    try {
      const res = await fetch('/api/ai/review-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to review resume');
      setAtsResult(data);
    } catch (err: any) {
      setAtsError(err.message || 'ATS audit failed. Please try again.');
    } finally {
      setAtsLoading(false);
    }
  };

  // Generate Summaries
  const generateSummaries = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const allSkills = resumeData.skills.flatMap((s) => s.items);
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: resumeData.personalInfo.fullName,
          jobTitle: summaryRole,
          experienceYears: summaryExp,
          skills: allSkills.slice(0, 8),
          highlights: resumeData.experience[0]?.highlights?.slice(0, 2)?.join('; ') || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary');
      setSummaryOptions(data.summaries || []);
    } catch (err: any) {
      setSummaryError(err.message || 'Failed to generate summaries');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Enhance Bullet
  const enhanceBullet = async () => {
    if (!bulletInput.trim()) return;
    setBulletLoading(true);
    setBulletError(null);
    try {
      const res = await fetch('/api/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bulletInput,
          role: bulletRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enhance bullet point');
      setBulletOptions(data.options || []);
    } catch (err: any) {
      setBulletError(err.message || 'Failed to enhance bullet point');
    } finally {
      setBulletLoading(false);
    }
  };

  // Suggest Skills
  const suggestSkills = async () => {
    setSkillLoading(true);
    setSkillError(null);
    try {
      const existing = resumeData.skills.flatMap((s) => s.items);
      const res = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: skillRole,
          existingSkills: existing,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to suggest skills');
      setSkillResult(data);
    } catch (err: any) {
      setSkillError(err.message || 'Failed to suggest skills');
    } finally {
      setSkillLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                Ekta AI Resume Co-Pilot
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">Intelligent ATS scoring, impactful action rewrites, and skill discovery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 gap-2">
          <button
            onClick={() => setActiveTab('ats')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'ats'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            ATS Audit & Score
          </button>
          <button
            onClick={() => setActiveTab('bullet')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'bullet'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Bullet Point Enhancer
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'summary'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Summary Writer
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'skills'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Skills Suggester
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ATS AUDIT */}
          {activeTab === 'ats' && (
            <div className="space-y-4">
              {!atsResult && !atsLoading && (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-200">Run Applicant Tracking System (ATS) Audit</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Evaluate your resume against real-world recruiter screening criteria: keyword density, STAR formula metrics, action verbs, and structure completeness.
                  </p>
                  <button
                    onClick={runAtsAudit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Current Resume Now
                  </button>
                </div>
              )}

              {atsLoading && (
                <div className="text-center py-12 space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto text-indigo-400 animate-spin" />
                  <p className="text-sm font-medium text-slate-300">Auditing resume structure, keywords & impact statements...</p>
                  <p className="text-xs text-slate-500">Evaluating against 50+ ATS screening patterns</p>
                </div>
              )}

              {atsError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{atsError}</span>
                </div>
              )}

              {atsResult && !atsLoading && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 flex flex-col items-center justify-center bg-indigo-950/40">
                        <span className="text-3xl font-extrabold text-indigo-400">{atsResult.score}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">/ 100 ATS</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Audit Verdict</div>
                      <p className="text-sm text-slate-200">{atsResult.verdict}</p>
                      <button
                        onClick={runAtsAudit}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2 inline-flex"
                      >
                        <RefreshCw className="w-3 h-3" /> Re-scan Resume
                      </button>
                    </div>
                  </div>

                  {/* Breakdown meters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
                      <div className="text-xs text-slate-400">Impact & KPIs</div>
                      <div className="text-lg font-bold text-indigo-400 mt-0.5">{atsResult.breakdown?.impactScore ?? 80}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
                      <div className="text-xs text-slate-400">Clarity & Verbs</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">{atsResult.breakdown?.clarityScore ?? 85}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
                      <div className="text-xs text-slate-400">Completeness</div>
                      <div className="text-lg font-bold text-amber-400 mt-0.5">{atsResult.breakdown?.completenessScore ?? 90}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center">
                      <div className="text-xs text-slate-400">Screening Match</div>
                      <div className="text-lg font-bold text-sky-400 mt-0.5">{atsResult.breakdown?.atsCompatibilityScore ?? 88}%</div>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5" /> Key Strengths
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {atsResult.strengths?.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" /> Recommended Fixes
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {atsResult.improvements?.map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
                      <div className="text-xs font-semibold text-slate-300">
                        Suggested Keywords to Include for Higher ATS Match:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {atsResult.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BULLET POINT ENHANCER */}
          {activeTab === 'bullet' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Target Role / Job Title
                </label>
                <input
                  type="text"
                  value={bulletRole}
                  onChange={(e) => setBulletRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Original Rough Bullet Point / Responsibility
                </label>
                <textarea
                  rows={3}
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="e.g. Worked on optimizing database queries and improved site speed for our users."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={enhanceBullet}
                  disabled={bulletLoading || !bulletInput.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {bulletLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  Generate 3 High-Impact Rewrites
                </button>
              </div>

              {bulletError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {bulletError}
                </div>
              )}

              {bulletOptions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-slate-300">Choose an Enhanced Version:</div>
                  {bulletOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {opt.style}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(opt.text, `b-${idx}`)}
                            className="p-1 rounded text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                          >
                            {copiedIndex === `b-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{copiedIndex === `b-${idx}` ? 'Copied' : 'Copy'}</span>
                          </button>
                          {onApplyBullet && (
                            <button
                              onClick={() => {
                                onApplyBullet(opt.text);
                                onClose();
                              }}
                              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] flex items-center gap-1 font-medium"
                            >
                              Insert Into Resume
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">{opt.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUMMARY GENERATOR */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Role Title</label>
                  <input
                    type="text"
                    value={summaryRole}
                    onChange={(e) => setSummaryRole(e.target.value)}
                    placeholder="e.g. Lead Product Manager"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Years of Experience</label>
                  <input
                    type="text"
                    value={summaryExp}
                    onChange={(e) => setSummaryExp(e.target.value)}
                    placeholder="e.g. 7"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={generateSummaries}
                  disabled={summaryLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {summaryLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate 3 Professional Summaries
                </button>
              </div>

              {summaryError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {summaryError}
                </div>
              )}

              {summaryOptions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-slate-300">Select & Apply a Summary:</div>
                  {summaryOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {opt.tone}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(opt.text, `s-${idx}`)}
                            className="p-1 rounded text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                          >
                            {copiedIndex === `s-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{copiedIndex === `s-${idx}` ? 'Copied' : 'Copy'}</span>
                          </button>
                          {onApplySummary && (
                            <button
                              onClick={() => {
                                onApplySummary(opt.text);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] flex items-center gap-1 font-medium"
                            >
                              Apply to CV
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{opt.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SKILLS SUGGESTER */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Target Job Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillRole}
                    onChange={(e) => setSkillRole(e.target.value)}
                    placeholder="e.g. Data Engineer, Product Marketing, Frontend Developer"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={suggestSkills}
                    disabled={skillLoading || !skillRole.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition shrink-0"
                  >
                    {skillLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Discover Skills
                  </button>
                </div>
              </div>

              {skillError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {skillError}
                </div>
              )}

              {skillResult && (
                <div className="space-y-4 pt-2">
                  {skillResult.technical && (
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-indigo-300">Technical & Hard Domain Skills</span>
                        {onApplySkills && (
                          <button
                            onClick={() => onApplySkills(skillResult.technical || [], 'Core Technical')}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            + Add All to CV
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillResult.technical.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skillResult.tools && (
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-emerald-300">Tools, Platforms & Frameworks</span>
                        {onApplySkills && (
                          <button
                            onClick={() => onApplySkills(skillResult.tools || [], 'Tools & Frameworks')}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            + Add All to CV
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillResult.tools.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skillResult.soft && (
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-amber-300">Leadership & Soft Skills</span>
                        {onApplySkills && (
                          <button
                            onClick={() => onApplySkills(skillResult.soft || [], 'Leadership & Methodologies')}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                          >
                            + Add All to CV
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skillResult.soft.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
