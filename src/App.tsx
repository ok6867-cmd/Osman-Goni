import React, { useState, useEffect } from 'react';
import { ResumeData, ResumeFormatting } from './types/resume';
import { SAMPLE_PROFILES, DEFAULT_FORMATTING } from './data/sampleResumes';
import { Navbar } from './components/Navbar';
import { FormattingSidebar } from './components/FormattingSidebar';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ExportModal } from './components/ExportModal';

const STORAGE_KEY_DATA = 'ekta_cv_data_v1';
const STORAGE_KEY_FORMATTING = 'ekta_cv_formatting_v1';

export default function App() {
  // Load initial resume data from localStorage or fallback to sample
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved CV data', e);
    }
    return SAMPLE_PROFILES['tech-lead'].data;
  });

  // Load formatting preferences
  const [formatting, setFormatting] = useState<ResumeFormatting>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FORMATTING);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load formatting', e);
    }
    return DEFAULT_FORMATTING;
  });

  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTab, setAiTab] = useState<'summary' | 'bullet' | 'skills' | 'ats'>('ats');
  const [aiActiveBullet, setAiActiveBullet] = useState<string>('');
  const [aiActiveRole, setAiActiveRole] = useState<string>('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Save to localStorage whenever data or formatting changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(resumeData));
    } catch (e) {
      console.error('Auto-save data failed', e);
    }
  }, [resumeData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FORMATTING, JSON.stringify(formatting));
    } catch (e) {
      console.error('Auto-save formatting failed', e);
    }
  }, [formatting]);

  // Profile selection
  const handleSelectProfile = (profileKey: string) => {
    const profile = SAMPLE_PROFILES[profileKey];
    if (profile) {
      setResumeData(profile.data);
      if (profile.recommendedFormat) {
        setFormatting((prev) => ({ ...prev, ...profile.recommendedFormat }));
      }
    }
  };

  const handleNewResume = () => {
    const blankData: ResumeData = {
      id: `cv-${Date.now()}`,
      title: 'Untitled Resume',
      lastModified: Date.now(),
      personalInfo: {
        fullName: 'Your Name',
        jobTitle: 'Professional Title',
        email: 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        location: 'City, Country',
        summary: 'Accomplished professional with proven experience delivering impactful results...',
      },
      experience: [],
      education: [],
      skills: [
        { id: 's1', category: 'Core Skills', items: ['Skill 1', 'Skill 2', 'Skill 3'] },
      ],
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
    };
    setResumeData(blankData);
  };

  const handleOpenAiAssistant = (
    tab: 'summary' | 'bullet' | 'skills' | 'ats' = 'ats',
    initialText = '',
    role = ''
  ) => {
    setAiTab(tab);
    setAiActiveBullet(initialText);
    setAiActiveRole(role);
    setIsAiModalOpen(true);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleImportJson = (importedData: ResumeData, importedFormatting?: ResumeFormatting) => {
    setResumeData(importedData);
    if (importedFormatting) {
      setFormatting(importedFormatting);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Navbar */}
      <Navbar
        data={resumeData}
        formatting={formatting}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        onSelectProfile={handleSelectProfile}
        onNewResume={handleNewResume}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Formatting / Design Sidebar */}
        {showSidebar && (
          <div className="w-80 md:w-88 shrink-0 h-full border-r border-slate-800 z-10 transition-all duration-200">
            <FormattingSidebar
              formatting={formatting}
              onChangeFormatting={setFormatting}
            />
          </div>
        )}

        {/* Central Editor Panel */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div
            className={`h-full flex-1 overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2 border-r border-slate-800' : 'w-full'
            }`}
          >
            <EditorPanel
              data={resumeData}
              onChangeData={setResumeData}
              onOpenAiAssistant={handleOpenAiAssistant}
            />
          </div>
        )}

        {/* Right Live Preview Panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`h-full flex-1 overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
            }`}
          >
            <PreviewPanel
              data={resumeData}
              formatting={formatting}
              onTriggerPrint={handleTriggerPrint}
              onOpenAiAssistant={handleOpenAiAssistant}
            />
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        resumeData={resumeData}
        initialTab={aiTab}
        activeBulletText={aiActiveBullet}
        activeRole={aiActiveRole}
        onApplySummary={(summary) => {
          setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, summary },
          }));
        }}
        onApplyBullet={(enhancedBullet) => {
          // If we were enhancing a specific bullet, replace or add to first experience
          setResumeData((prev) => {
            if (prev.experience.length === 0) return prev;
            const updated = [...prev.experience];
            // Try to find if the bullet matches an existing one
            let found = false;
            for (let i = 0; i < updated.length; i++) {
              const hIndex = updated[i].highlights.indexOf(aiActiveBullet);
              if (hIndex !== -1) {
                updated[i].highlights[hIndex] = enhancedBullet;
                found = true;
                break;
              }
            }
            if (!found && updated[0]) {
              updated[0].highlights.push(enhancedBullet);
            }
            return { ...prev, experience: updated };
          });
        }}
        onApplySkills={(skills, category) => {
          setResumeData((prev) => {
            const existingCat = prev.skills.find((s) => s.category.toLowerCase() === category.toLowerCase());
            if (existingCat) {
              const merged = Array.from(new Set([...existingCat.items, ...skills]));
              return {
                ...prev,
                skills: prev.skills.map((s) => (s.id === existingCat.id ? { ...s, items: merged } : s)),
              };
            } else {
              return {
                ...prev,
                skills: [
                  ...prev.skills,
                  { id: `s-${Date.now()}`, category, items: skills },
                ],
              };
            }
          });
        }}
      />

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={resumeData}
        formatting={formatting}
        onTriggerPrint={handleTriggerPrint}
        onImportJson={handleImportJson}
      />
    </div>
  );
}
