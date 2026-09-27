import React, { useRef, useState, useEffect } from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Printer, Sparkles, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
  onTriggerPrint: () => void;
  onOpenAiAssistant: (tab?: any) => void;
}

export const PreviewPanel: React.FC<Props> = ({
  data,
  formatting,
  onTriggerPrint,
  onOpenAiAssistant,
}) => {
  const [zoom, setZoom] = useState<number>(90);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const paperRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState<number>(1);

  // Monitor height of the paper to calculate page overflow
  useEffect(() => {
    if (!paperRef.current) return;
    const observer = new ResizeObserver(() => {
      if (paperRef.current) {
        // A4 height at standard 96 DPI is approximately 1123px (297mm)
        // Letter height is approximately 1056px (11in)
        const singlePagePx = formatting.paperSize === 'a4' ? 1123 : 1056;
        const totalHeight = paperRef.current.scrollHeight;
        const estimatedPages = Math.max(1, Math.ceil(totalHeight / (singlePagePx - 40)));
        setPageCount(estimatedPages);
      }
    });

    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, [data, formatting]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(150, Math.max(50, prev + delta)));
  };

  const resetZoom = () => setZoom(90);

  // Dimension aspect styling for paper sheet
  // A4: 210mm width x 297mm height
  // Letter: 8.5in (215.9mm) width x 11in (279.4mm) height
  const paperWidthMm = formatting.paperSize === 'a4' ? '210mm' : '8.5in';
  const paperMinHeightMm = formatting.paperSize === 'a4' ? '297mm' : '11in';

  return (
    <div
      className={`h-full flex flex-col bg-slate-950 overflow-hidden relative ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4' : ''
      }`}
    >
      {/* Floating Toolbar */}
      <div className="no-print h-12 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between text-slate-300 text-xs shrink-0 select-none z-10">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Live Preview
          </span>

          {/* Page count pill */}
          <div
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium flex items-center gap-1 ${
              pageCount === 1
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {pageCount === 1 ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Fits on 1 Page</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>~{pageCount} Pages (Consider compact mode)</span>
              </>
            )}
          </div>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => handleZoom(-10)}
              title="Zoom Out"
              className="p-1 hover:text-white rounded hover:bg-slate-700 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-400 min-w-10 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              title="Zoom In"
              className="p-1 hover:text-white rounded hover:bg-slate-700 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              title="Reset Zoom"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 border-l border-slate-700 ml-0.5 pl-1.5"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700/60 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onTriggerPrint}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Canvas Area with authentic paper drop shadow */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-950/80">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="print-only-container"
        >
          {/* Paper Sheet Container */}
          <div
            ref={paperRef}
            className="resume-paper bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-xs overflow-hidden relative"
            style={{
              width: paperWidthMm,
              minHeight: paperMinHeightMm,
            }}
          >
            {/* The Selected Resume Template */}
            <ResumeRenderer data={data} formatting={formatting} />
          </div>
        </div>
      </div>
    </div>
  );
};
