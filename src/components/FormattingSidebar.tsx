import React, { useState } from 'react';
import { ResumeFormatting, TemplateId, FontFamily, FontSize, LineHeight, MarginSize, BulletStyle, PhotoShape, PaperSize } from '../types/resume';
import { TEMPLATE_METADATA } from '../templates/ResumeRenderer';
import { COLOR_PALETTES } from '../data/sampleResumes';
import { LayoutTemplate, Type, Palette, Sliders, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon, FileText } from 'lucide-react';

interface Props {
  formatting: ResumeFormatting;
  onChangeFormatting: (updater: (prev: ResumeFormatting) => ResumeFormatting) => void;
}

export const FormattingSidebar: React.FC<Props> = ({ formatting, onChangeFormatting }) => {
  const [activeTab, setActiveTab] = useState<'template' | 'style' | 'sections'>('template');

  const updateField = <K extends keyof ResumeFormatting>(key: K, value: ResumeFormatting[K]) => {
    onChangeFormatting((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (sectionId: string) => {
    onChangeFormatting((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionId]: prev.sectionVisibility[sectionId] === false ? true : false,
      },
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...formatting.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    updateField('sectionOrder', newOrder);
  };

  const SECTION_LABELS: Record<string, string> = {
    summary: 'Summary / Profile',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills & Competencies',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    custom: 'Custom Sections',
  };

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-100">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-1">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === 'template'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === 'style'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Formatting
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === 'sections'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Sections
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: TEMPLATES */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Choose CV Layout ({TEMPLATE_METADATA.length})
            </div>
            <div className="space-y-3">
              {TEMPLATE_METADATA.map((tpl) => {
                const isSelected = formatting.templateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => updateField('templateId', tpl.id as TemplateId)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition relative group ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                        {tpl.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300">
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-400 mt-1 leading-snug">{tpl.description}</p>
                    <div className="text-[10.5px] text-slate-500 mt-2 font-mono">
                      Best for: <span className="text-slate-400">{tpl.bestFor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: FORMATTING & STYLING */}
        {activeTab === 'style' && (
          <div className="space-y-5">
            {/* Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Accent Color</span>
                <span className="font-mono text-[11px] text-slate-400">{formatting.accentColor}</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PALETTES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => updateField('accentColor', c.hex)}
                    title={c.name}
                    className={`h-8 rounded-lg flex items-center justify-center border transition relative ${
                      formatting.accentColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-105 shadow-md ring-2 ring-indigo-500/50'
                        : 'border-transparent hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.preview }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={formatting.accentColor}
                  onChange={(e) => updateField('accentColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-xs text-slate-400">Custom Brand Hex Picker</span>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                Font Family
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'inter', name: 'Inter (Clean Sans)' },
                  { id: 'jakarta', name: 'Plus Jakarta' },
                  { id: 'merriweather', name: 'Merriweather (Serif)' },
                  { id: 'playfair', name: 'Playfair Display' },
                  { id: 'outfit', name: 'Outfit (Modern)' },
                  { id: 'jetbrains', name: 'JetBrains (Mono)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateField('fontFamily', f.id as FontFamily)}
                    className={`p-2 rounded-lg border text-left transition ${
                      formatting.fontFamily === f.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Spacing */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">Text Density / Size</label>
              <div className="flex rounded-lg bg-slate-800 p-1">
                {(['compact', 'normal', 'relaxed'] as FontSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateField('fontSize', s)}
                    className={`flex-1 py-1.5 rounded-md text-xs capitalize transition ${
                      formatting.fontSize === s
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Margins */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">Page Margins</label>
              <div className="flex rounded-lg bg-slate-800 p-1">
                {(['compact', 'normal', 'spacious'] as MarginSize[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => updateField('marginSize', m)}
                    className={`flex-1 py-1.5 rounded-md text-xs capitalize transition ${
                      formatting.marginSize === m
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Bullet Point Style */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">Bullet Style</label>
              <div className="flex rounded-lg bg-slate-800 p-1">
                {[
                  { id: 'disc', symbol: '•' },
                  { id: 'circle', symbol: '○' },
                  { id: 'dash', symbol: '—' },
                  { id: 'arrow', symbol: '▸' },
                  { id: 'diamond', symbol: '◆' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => updateField('bulletStyle', b.id as BulletStyle)}
                    className={`flex-1 py-1.5 rounded-md text-xs transition ${
                      formatting.bulletStyle === b.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Photo Options */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Show Headshot Photo
                </label>
                <input
                  type="checkbox"
                  checked={formatting.showPhoto}
                  onChange={(e) => updateField('showPhoto', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                />
              </div>

              {formatting.showPhoto && (
                <div className="space-y-2 pl-2 border-l border-slate-700">
                  <label className="text-[11px] text-slate-400">Photo Shape</label>
                  <div className="flex rounded-lg bg-slate-800 p-1">
                    {(['circle', 'rounded', 'square'] as PhotoShape[]).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => updateField('photoShape', shape)}
                        className={`flex-1 py-1 rounded-md text-xs capitalize transition ${
                          formatting.photoShape === shape
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Paper Size */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Target Paper Format
              </label>
              <div className="flex rounded-lg bg-slate-800 p-1">
                {(['a4', 'letter'] as PaperSize[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateField('paperSize', p)}
                    className={`flex-1 py-1.5 rounded-md text-xs uppercase font-medium transition ${
                      formatting.paperSize === p
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p === 'a4' ? 'A4 (International)' : 'US Letter (8.5x11")'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECTIONS REORDER & TOGGLE */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Reorder or hide sections. Changes reflect in real-time in the live preview.
            </div>

            <div className="space-y-2">
              {formatting.sectionOrder.map((sectionId, idx) => {
                const label = SECTION_LABELS[sectionId] || sectionId;
                const visible = formatting.sectionVisibility[sectionId] !== false;

                return (
                  <div
                    key={sectionId}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      visible
                        ? 'bg-slate-800/60 border-slate-700/80 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-medium">{label}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 hover:bg-slate-700"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === formatting.sectionOrder.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 hover:bg-slate-700"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleSection(sectionId)}
                        title={visible ? 'Hide section' : 'Show section'}
                        className={`p-1 rounded ml-1 transition ${
                          visible
                            ? 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-700'
                            : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
