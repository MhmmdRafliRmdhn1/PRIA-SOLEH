import React from 'react';
import type { Province, MotifKind } from '../../data/types';

/** Pola SVG sebagai representasi visual provinsi (tanpa gambar eksternal). */
const patternFor = (motif: MotifKind, id: string): React.ReactNode => {
  const stroke = 'rgba(255,255,255,0.55)';
  switch (motif) {
    case 'songket':
      return (
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M11 2 L20 11 L11 20 L2 11 Z" fill="none" stroke={stroke} strokeWidth="1.4" />
          <circle cx="11" cy="11" r="2" fill={stroke} />
        </pattern>
      );
    case 'wave':
      return (
        <pattern id={id} width="30" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 Q7.5 0 15 7 T30 7" fill="none" stroke={stroke} strokeWidth="1.6" />
        </pattern>
      );
    case 'batik':
      return (
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="9" fill="none" stroke={stroke} strokeWidth="1.2" />
          <circle cx="12" cy="12" r="4.5" fill="none" stroke={stroke} strokeWidth="1.2" />
        </pattern>
      );
    case 'zigzag':
      return (
        <pattern id={id} width="20" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 10 L5 2 L10 10 L15 2 L20 10" fill="none" stroke={stroke} strokeWidth="1.6" />
        </pattern>
      );
    case 'leaf':
      return (
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M3 19 Q3 5 19 3 Q19 17 3 19 Z" fill="none" stroke={stroke} strokeWidth="1.3" />
        </pattern>
      );
    default:
      return (
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2" fill={stroke} />
        </pattern>
      );
  }
};

export const ProvinceVisual: React.FC<{ province: Province }> = ({ province }) => {
  const { colors, motif, emoji } = province.visual;
  const pid = `pat-${province.id}`;
  return (
    <div className="vis" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} aria-hidden>
      <svg>
        <defs>{patternFor(motif, pid)}</defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} opacity="0.7" />
      </svg>
      <span className="vis__emoji">{emoji}</span>
    </div>
  );
};
