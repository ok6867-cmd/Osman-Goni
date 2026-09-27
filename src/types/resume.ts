export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa?: string;
  honors?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  date?: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  highlights?: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  title: string;
  lastModified: number;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
}

export type TemplateId = 
  | 'modern-noir' 
  | 'tech-minimal' 
  | 'nordic-split' 
  | 'classic-serif' 
  | 'creative-indigo' 
  | 'compact-onepage';

export type FontFamily = 
  | 'inter' 
  | 'jakarta' 
  | 'merriweather' 
  | 'playfair' 
  | 'outfit' 
  | 'jetbrains';

export type FontSize = 'compact' | 'normal' | 'relaxed';
export type LineHeight = 'tight' | 'normal' | 'relaxed';
export type MarginSize = 'compact' | 'normal' | 'spacious';
export type BulletStyle = 'disc' | 'circle' | 'dash' | 'arrow' | 'diamond';
export type PhotoShape = 'circle' | 'rounded' | 'square';
export type PhotoSize = 'sm' | 'md' | 'lg';
export type PaperSize = 'a4' | 'letter';

export interface ResumeFormatting {
  templateId: TemplateId;
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineHeight: LineHeight;
  marginSize: MarginSize;
  accentColor: string;
  secondaryColor?: string;
  paperSize: PaperSize;
  showPhoto: boolean;
  photoShape: PhotoShape;
  photoSize: PhotoSize;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  bulletStyle: BulletStyle;
  showDividers: boolean;
  headerAlignment: 'left' | 'center' | 'split';
}

export interface ATSReviewResult {
  score: number;
  verdict: string;
  breakdown: {
    impactScore: number;
    clarityScore: number;
    completenessScore: number;
    atsCompatibilityScore: number;
  };
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
}
