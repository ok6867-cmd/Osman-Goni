import { ResumeFormatting } from '../types/resume';

export const getFontFamilyClass = (font: ResumeFormatting['fontFamily']): string => {
  switch (font) {
    case 'inter': return 'font-inter';
    case 'jakarta': return 'font-jakarta';
    case 'merriweather': return 'font-merriweather';
    case 'playfair': return 'font-playfair';
    case 'outfit': return 'font-outfit';
    case 'jetbrains': return 'font-jetbrains';
    default: return 'font-inter';
  }
};

export const getFontSizeClasses = (size: ResumeFormatting['fontSize']) => {
  switch (size) {
    case 'compact':
      return {
        base: 'text-xs leading-snug',
        title: 'text-xl font-bold tracking-tight',
        subtitle: 'text-sm font-medium',
        heading: 'text-xs uppercase font-bold tracking-wider',
        subheading: 'text-xs font-semibold',
        meta: 'text-[11px] text-slate-500',
        body: 'text-[11.5px] leading-relaxed',
      };
    case 'relaxed':
      return {
        base: 'text-sm leading-relaxed',
        title: 'text-2xl font-bold tracking-tight',
        subtitle: 'text-base font-medium',
        heading: 'text-sm uppercase font-bold tracking-wider',
        subheading: 'text-sm font-semibold',
        meta: 'text-xs text-slate-500',
        body: 'text-sm leading-relaxed',
      };
    case 'normal':
    default:
      return {
        base: 'text-[13px] leading-normal',
        title: 'text-2xl font-bold tracking-tight',
        subtitle: 'text-sm font-medium',
        heading: 'text-xs uppercase font-bold tracking-wider',
        subheading: 'text-[13px] font-semibold',
        meta: 'text-xs text-slate-500',
        body: 'text-[12.5px] leading-normal',
      };
  }
};

export const getMarginPaddingClass = (margin: ResumeFormatting['marginSize']) => {
  switch (margin) {
    case 'compact': return 'p-6 md:p-8';
    case 'spacious': return 'p-10 md:p-14';
    case 'normal':
    default: return 'p-8 md:p-10';
  }
};

export const getBulletSymbol = (style: ResumeFormatting['bulletStyle']) => {
  switch (style) {
    case 'circle': return '○';
    case 'dash': return '—';
    case 'arrow': return '▸';
    case 'diamond': return '◆';
    case 'disc':
    default: return '•';
  }
};

export const formatDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'present') return 'Present';
  // format YYYY-MM into Month YYYY
  const parts = dateStr.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (months[monthIndex]) {
      return `${months[monthIndex]} ${year}`;
    }
  }
  return dateStr;
};
