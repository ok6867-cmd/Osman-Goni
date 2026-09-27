import React from 'react';
import { SAMPLE_PROFILES } from '../data/sampleResumes';
import { ResumeData, ResumeFormatting } from '../types/resume';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Download,
  Sliders,
  Columns,
  Maximize2,
  Edit3,
  CheckCircle,
  FolderOpen,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
  viewMode: 'split' | 'editor' | 'preview';
  onChangeViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onSelectProfile: (profileKey: string) => void;
  onNewResume: () => void;
  onOpenAiAssistant: (tab?: any) => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  data,
  formatting,
  viewMode,
  onChangeViewMode,
  showSidebar,
  onToggleSidebar,
  onSelectProfile,
  onNewResume,
  onOpenAiAssistant,
  onOpenExportModal,
}) => {
  return (
    <header className="no-print h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-slate-100 shrink-0 z-20">
      {/* Left: Brand Identity & Preset Profiles */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">Ekta</span>
              <span className="font-light text-sm text-slate-300">CV Studio</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Customizable Templates & Vector Export
            </div>
          </div>
        </div>

        {/* Profile Preset Switcher */}
        <div className="hidden lg:flex items-center gap-1 pl-3 border-l border-slate-800">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60 text-xs">
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <select
              onChange={(e) => {
                if (e.target.value === 'blank') {
                  onNewResume();
                } else if (e.target.value) {
                  onSelectProfile(e.target.value);
                }
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample Profiles...
              </option>
              {Object.entries(SAMPLE_PROFILES).map(([key, item]) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-200">
                  {item.label}
                </option>
              ))}
              <option value="blank" className="bg-slate-900 text-slate-200">
                + Create Blank Resume
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Center: View Mode Switcher */}
      <div className="hidden md:flex items-center bg-slate-850 p-1 rounded-xl border border-slate-800 bg-slate-950/60">
        <button
          onClick={() => onChangeViewMode('editor')}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            viewMode === 'editor'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          onClick={() => onChangeViewMode('split')}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            viewMode === 'split'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          Dual View
        </button>
        <button
          onClick={() => onChangeViewMode('preview')}
          className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            viewMode === 'preview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Preview
        </button>
      </div>

      {/* Right: Actions (Formatting, AI, ATS, Export) */}
      <div className="flex items-center gap-2">
        {/* Toggle Formatting Sidebar */}
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            showSidebar
              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle Formatting & Layout Controls"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Design</span>
        </button>

        {/* ATS Score / Audit Trigger */}
        <button
          onClick={() => onOpenAiAssistant('ats')}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">ATS Check</span>
        </button>

        {/* AI Co-Pilot Button */}
        <button
          onClick={() => onOpenAiAssistant('summary')}
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>AI Assist</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
