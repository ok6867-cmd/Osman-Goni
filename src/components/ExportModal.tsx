import React, { useState } from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { Printer, Download, FileText, Code2, Upload, X, Check, Copy, Share2, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  formatting: ResumeFormatting;
  onImportJson: (importedData: ResumeData, importedFormatting?: ResumeFormatting) => void;
  onTriggerPrint: () => void;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  formatting,
  onImportJson,
  onTriggerPrint,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'text' | 'markdown' | 'json' | 'share'>('pdf');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  if (!isOpen) return null;

  // Generate plain text
  const generatePlainText = (): string => {
    let out = `${data.personalInfo.fullName.toUpperCase()}\n`;
    out += `${data.personalInfo.jobTitle}\n`;
    out += `Email: ${data.personalInfo.email} | Phone: ${data.personalInfo.phone} | Location: ${data.personalInfo.location}\n`;
    if (data.personalInfo.website) out += `Website: ${data.personalInfo.website}\n`;
    if (data.personalInfo.linkedin) out += `LinkedIn: ${data.personalInfo.linkedin}\n`;
    if (data.personalInfo.github) out += `GitHub: ${data.personalInfo.github}\n`;
    out += `\n------------------------------------------------------------\n`;
    out += `PROFESSIONAL SUMMARY\n`;
    out += `------------------------------------------------------------\n`;
    out += `${data.personalInfo.summary}\n\n`;

    if (data.experience.length > 0) {
      out += `------------------------------------------------------------\n`;
      out += `EXPERIENCE\n`;
      out += `------------------------------------------------------------\n`;
      data.experience.forEach((exp) => {
        out += `${exp.role} - ${exp.company} (${exp.location || 'Remote'})\n`;
        out += `${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}\n`;
        exp.highlights.forEach((h) => {
          out += `  * ${h}\n`;
        });
        out += `\n`;
      });
    }

    if (data.education.length > 0) {
      out += `------------------------------------------------------------\n`;
      out += `EDUCATION\n`;
      out += `------------------------------------------------------------\n`;
      data.education.forEach((edu) => {
        out += `${edu.degree} in ${edu.fieldOfStudy}\n`;
        out += `${edu.institution} (${edu.startDate} - ${edu.isCurrent ? 'Present' : edu.endDate})\n`;
        if (edu.gpa) out += `  GPA: ${edu.gpa}\n`;
        if (edu.honors) out += `  Honors: ${edu.honors}\n`;
        out += `\n`;
      });
    }

    if (data.skills.length > 0) {
      out += `------------------------------------------------------------\n`;
      out += `SKILLS\n`;
      out += `------------------------------------------------------------\n`;
      data.skills.forEach((s) => {
        out += `${s.category}: ${s.items.join(', ')}\n`;
      });
      out += `\n`;
    }

    if (data.projects.length > 0) {
      out += `------------------------------------------------------------\n`;
      out += `PROJECTS\n`;
      out += `------------------------------------------------------------\n`;
      data.projects.forEach((p) => {
        out += `${p.name} - ${p.description}\n`;
        if (p.technologies?.length) out += `Technologies: ${p.technologies.join(', ')}\n`;
        if (p.link) out += `Link: ${p.link}\n`;
        out += `\n`;
      });
    }

    return out;
  };

  // Generate Markdown
  const generateMarkdown = (): string => {
    let md = `# ${data.personalInfo.fullName}\n\n`;
    md += `**${data.personalInfo.jobTitle}**\n\n`;
    md += `📬 ${data.personalInfo.email} | 📱 ${data.personalInfo.phone} | 📍 ${data.personalInfo.location}\n\n`;
    if (data.personalInfo.website) md += `🌐 [Portfolio](${data.personalInfo.website}) `;
    if (data.personalInfo.linkedin) md += `💼 [LinkedIn](${data.personalInfo.linkedin}) `;
    if (data.personalInfo.github) md += `🐙 [GitHub](${data.personalInfo.github})\n\n`;

    md += `## Professional Summary\n\n${data.personalInfo.summary}\n\n`;

    if (data.experience.length > 0) {
      md += `## Work Experience\n\n`;
      data.experience.forEach((exp) => {
        md += `### ${exp.role} — **${exp.company}**\n`;
        md += `*${exp.startDate} – ${exp.isCurrent ? 'Present' : exp.endDate} | ${exp.location}*\n\n`;
        exp.highlights.forEach((h) => {
          md += `- ${h}\n`;
        });
        md += `\n`;
      });
    }

    if (data.education.length > 0) {
      md += `## Education\n\n`;
      data.education.forEach((edu) => {
        md += `### ${edu.institution}\n`;
        md += `**${edu.degree} in ${edu.fieldOfStudy}** (${edu.startDate} – ${edu.isCurrent ? 'Present' : edu.endDate})\n\n`;
      });
    }

    if (data.skills.length > 0) {
      md += `## Skills\n\n`;
      data.skills.forEach((s) => {
        md += `- **${s.category}:** ${s.items.join(', ')}\n`;
      });
      md += `\n`;
    }

    return md;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.data && json.data.personalInfo) {
          onImportJson(json.data, json.formatting);
        } else if (json.personalInfo) {
          onImportJson(json);
        } else {
          throw new Error('Invalid CV JSON format');
        }
        onClose();
      } catch (err: any) {
        setImportError('Failed to parse JSON file. Ensure it is an Ekta CV backup.');
      }
    };
    reader.readAsText(file);
  };

  const generateShareLink = () => {
    try {
      const payload = { data, formatting };
      const serialized = encodeURIComponent(JSON.stringify(payload));
      const url = `${window.location.origin}${window.location.pathname}#resume=${serialized.slice(0, 1500)}`;
      setShareUrl(url);
    } catch (e) {
      setShareUrl(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              Export & Share Your CV
            </h3>
            <p className="text-xs text-slate-400">Choose your preferred export format for job applications</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'pdf'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            PDF / Print (Recommended)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'text'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            ATS Plain Text (.txt)
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'markdown'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Markdown (.md)
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'json'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            JSON Backup / Restore
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: PDF / Print */}
          {activeTab === 'pdf' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400">
                <Printer className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-100">
                  Save as High-Fidelity Vector PDF
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click below to open the native browser print engine. Choose <strong className="text-slate-200">"Save as PDF"</strong> as destination.
                </p>
              </div>

              {/* Recommended PDF Settings Callout */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-300">
                <div className="font-semibold text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Pro Tips for Cleanest PDF:
                </div>
                <ul className="space-y-1 text-[11.5px] list-disc list-inside text-slate-300">
                  <li><strong>Destination:</strong> Save as PDF</li>
                  <li><strong>Paper size:</strong> {formatting.paperSize === 'a4' ? 'A4 (210 x 297 mm)' : 'Letter (8.5 x 11 in)'}</li>
                  <li><strong>Margins:</strong> None or Default</li>
                  <li><strong>Options:</strong> Check <span className="underline">"Background graphics"</span> to preserve accent colors</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(onTriggerPrint, 250);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Open Print & PDF Dialog Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ATS Plain Text */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Formatted for direct paste into application portals:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(generatePlainText(), 'txt')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition font-medium"
                  >
                    {copiedType === 'txt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'txt' ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  <button
                    onClick={() => handleDownloadFile(generatePlainText(), `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`, 'text/plain')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5 transition font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .txt
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                rows={12}
                value={generatePlainText()}
                className="w-full bg-slate-950 font-mono text-[11px] text-slate-300 p-3 rounded-xl border border-slate-800 focus:outline-none"
              />
            </div>
          )}

          {/* TAB 3: Markdown */}
          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Great for GitHub README, Obsidian, Notion, or personal docs:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(generateMarkdown(), 'md')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition font-medium"
                  >
                    {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'md' ? 'Copied!' : 'Copy Markdown'}
                  </button>
                  <button
                    onClick={() => handleDownloadFile(generateMarkdown(), `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.md`, 'text/markdown')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5 transition font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .md
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                rows={12}
                value={generateMarkdown()}
                className="w-full bg-slate-950 font-mono text-[11px] text-slate-300 p-3 rounded-xl border border-slate-800 focus:outline-none"
              />
            </div>
          )}

          {/* TAB 4: JSON Backup / Restore */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="font-semibold text-xs text-slate-200">Export Complete JSON State</div>
                <p className="text-xs text-slate-400">
                  Export all your experience, formatting options, and custom sections into a portable JSON file to back up or transfer between devices.
                </p>
                <button
                  onClick={() => {
                    const fullState = { data, formatting, exportedAt: new Date().toISOString() };
                    handleDownloadFile(JSON.stringify(fullState, null, 2), `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV_Backup.json`, 'application/json');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-2 font-medium transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download JSON Backup
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="font-semibold text-xs text-slate-200">Import / Restore From JSON</div>
                <p className="text-xs text-slate-400">
                  Upload an existing resume JSON backup file to instantly populate the builder.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-600 transition">
                  <Upload className="w-3.5 h-3.5" />
                  Select JSON File
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="hidden"
                  />
                </label>
                {importError && (
                  <div className="text-xs text-rose-400 mt-1">{importError}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
