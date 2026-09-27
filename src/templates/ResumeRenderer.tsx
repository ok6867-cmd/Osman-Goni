import React from 'react';
import { ResumeData, ResumeFormatting } from '../types/resume';
import { ExecutiveNoirTemplate } from './ExecutiveNoirTemplate';
import { TechMinimalistTemplate } from './TechMinimalistTemplate';
import { NordicSplitTemplate } from './NordicSplitTemplate';
import { ClassicSerifTemplate } from './ClassicSerifTemplate';
import { CreativeIndigoTemplate } from './CreativeIndigoTemplate';
import { CompactOnePageTemplate } from './CompactOnePageTemplate';

interface Props {
  data: ResumeData;
  formatting: ResumeFormatting;
}

export const TEMPLATE_METADATA = [
  {
    id: 'modern-noir',
    name: 'Executive Noir',
    description: 'Sophisticated executive layout with bold headers and refined divider accents.',
    bestFor: 'Corporate, Engineering Managers, Tech Leads, Finance',
    badge: 'Popular',
  },
  {
    id: 'tech-minimal',
    name: 'Tech Minimalist',
    description: 'Clean monospace accents, ultra high-density ATS-optimized hierarchy.',
    bestFor: 'Software Engineers, DevOps, Data Scientists, SREs',
    badge: 'ATS 99%',
  },
  {
    id: 'nordic-split',
    name: 'Nordic Split',
    description: 'Modern two-column format with an elegant tinted sidebar for skills & credentials.',
    bestFor: 'Product Designers, UX Researchers, Creative Leads',
    badge: 'Creative',
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    description: 'Harvard and Wall Street traditional academic serif layout with horizontal rules.',
    bestFor: 'Investment Banking, Legal, Consulting, Academia',
    badge: 'Ivy League',
  },
  {
    id: 'creative-indigo',
    name: 'Creative Accent',
    description: 'Dynamic timeline markers, colored category badges, and modern project cards.',
    bestFor: 'Marketing, Growth PMs, Startups, Brand Managers',
    badge: 'Modern',
  },
  {
    id: 'compact-onepage',
    name: 'Compact One-Pager',
    description: 'Engineered space efficiency designed strictly to condense maximum content into 1 page.',
    bestFor: 'Early Career, Career Switchers, Single-Page Mandates',
    badge: 'Compact',
  },
] as const;

export const ResumeRenderer: React.FC<Props> = ({ data, formatting }) => {
  switch (formatting.templateId) {
    case 'tech-minimal':
      return <TechMinimalistTemplate data={data} formatting={formatting} />;
    case 'nordic-split':
      return <NordicSplitTemplate data={data} formatting={formatting} />;
    case 'classic-serif':
      return <ClassicSerifTemplate data={data} formatting={formatting} />;
    case 'creative-indigo':
      return <CreativeIndigoTemplate data={data} formatting={formatting} />;
    case 'compact-onepage':
      return <CompactOnePageTemplate data={data} formatting={formatting} />;
    case 'modern-noir':
    default:
      return <ExecutiveNoirTemplate data={data} formatting={formatting} />;
  }
};
