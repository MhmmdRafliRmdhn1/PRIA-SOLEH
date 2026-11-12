import React, { useState, useEffect } from 'react';
import { CulturalExhibit } from '../../utils/culturalData';
import { soundManager } from '../../utils/sound';
import {
  X,
  Volume2,
  VolumeX,
  MapPin,
  Sparkles,
  BookOpen,
  Award,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface InfoPanelProps {
  exhibit: CulturalExhibit | null;
  onClose: () => void;
  onOpenProduct: (exhibit: CulturalExhibit) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  exhibit,
  onClose,
  onOpenProduct
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Reset audio state when exhibit changes
    soundManager.stopNarration();
    setIsPlayingAudio(false);
    setCopiedLink(false);
  }, [exhibit?.id]);

  if (!exhibit) return null;

  const handleToggleNarration = () => {
    if (isPlayingAudio) {
      soundManager.stopNarration();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${exhibit.name}. Asal daerah: ${exhibit.origin}, ${exhibit.province}. ${exhibit.description}. Filosofi: ${exhibit.philosophy}. Kaitan dengan SDG 11: ${exhibit.sdg11Alignment.description}`;
      soundManager.speakNarration(textToRead, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleShare = () => {
    soundManager.playUiClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Koleksi CultureVerse: ${exhibit.name} (${exhibit.origin}) - Warisan Budaya Indonesia & SDG 11.4`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <aside
      aria-label="Panel Informasi Kurasi Koleksi"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'min(440px, 100vw)',
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(14, 17, 24, 0.96) 0%, rgba(20, 24, 34, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.75), 0 0 30px rgba(212, 175, 55, 0.1)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        color: '#e2e8f0',
        animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Gold Trim Header Accent Line */}
      <div
        style={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #aa8c2c, #ffd700, #aa8c2c)'
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#d4af37',
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.25)'
              }}
            >
              <Sparkles size={12} />
              {exhibit.category}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#4ade80',
                background: 'rgba(74, 222, 128, 0.1)',
                padding: '4px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(74, 222, 128, 0.2)'
              }}
            >
              <ShieldCheck size={12} />
              {exhibit.verifiedStatus}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.3,
              margin: '4px 0 6px'
            }}
          >
            {exhibit.name}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#94a3b8'
            }}
          >
            <MapPin size={14} color="#d4af37" />
            <span>{exhibit.origin}, {exhibit.province}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playUiClick();
            soundManager.stopNarration();
            onClose();
          }}
          aria-label="Tutup Panel Informasi"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
            e.currentTarget.style.color = '#ffd700';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Content Scroll Body */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {/* Audio Guide Narration Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isPlayingAudio
              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(166, 124, 0, 0.1))'
              : 'rgba(255, 255, 255, 0.04)',
            border: isPlayingAudio
              ? '1px solid #ffd700'
              : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 16px',
            borderRadius: '12px',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isPlayingAudio ? '#ffd700' : 'rgba(212, 175, 55, 0.2)',
                color: isPlayingAudio ? '#0d1017' : '#ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPlayingAudio ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                {isPlayingAudio ? 'Narasi Audio Sedang Berputar' : 'Panduan Audio Kurasi'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {isPlayingAudio ? 'Menjelaskan filosofi & kearifan lokal' : 'Dengarkan penjelasan suara budaya'}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleNarration}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: isPlayingAudio ? '#ef4444' : '#d4af37',
              color: isPlayingAudio ? '#ffffff' : '#0d1017',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isPlayingAudio ? 'Hentikan' : 'Putar Audio'}
          </button>
        </div>

        {/* Section 1: Deskripsi & Sejarah Era */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={16} color="#d4af37" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffd700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sejarah & Asal Usul
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '8px' }}>
            {exhibit.description}
          </p>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
            Periode Historis: {exhibit.era}
          </div>
        </section>

        {/* Section 2: Makna Filosofis */}
        <section
          style={{
            background: 'rgba(212, 175, 55, 0.05)',
            borderLeft: '3px solid #d4af37',
            padding: '12px 16px',
            borderRadius: '0 8px 8px 0'
          }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f5d77f', marginBottom: '6px' }}>
            Falsafah & Nilai Kehidupan
          </h3>
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#e2e8f0' }}>
            "{exhibit.philosophy}"
          </p>
        </section>

        {/* Section 3: Teknik Pembuatan & Material Autentik */}
        <section>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffd700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Teknik & Bahan Alami
          </h3>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '10px' }}>
            {exhibit.technique}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {exhibit.materials.map((mat, i) => (
              <span
                key={i}
                style={{
                  fontSize: '11.5px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  color: '#e2e8f0'
                }}
              >
                • {mat}
              </span>
            ))}
          </div>
        </section>

        {/* Section 4: Kaitan dengan SDG 11 (Kota dan Komunitas Berkelanjutan) */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.04))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Award size={18} color="#f59e0b" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kaitan Tujuan Pembangunan Berkelanjutan
            </span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            {exhibit.sdg11Alignment.target}
          </div>
          <p style={{ fontSize: '12.5px', lineHeight: 1.55, color: '#cbd5e1', marginBottom: '8px' }}>
            {exhibit.sdg11Alignment.description}
          </p>
          <div
            style={{
              fontSize: '12px',
              color: '#fde68a',
              background: 'rgba(245, 158, 11, 0.15)',
              padding: '8px 12px',
              borderRadius: '8px',
              lineHeight: 1.45
            }}
          >
            <strong>Dampak Komunitas:</strong> {exhibit.sdg11Alignment.impact}
          </div>
        </section>

        {/* Section 5: Sumber Faktual & Lisensi Verifikasi */}
        <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
            Sumber Rujukan & Verifikasi Kuratorial
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {exhibit.sources.map((src, i) => (
              <li
                key={i}
                style={{
                  fontSize: '11.5px',
                  color: '#94a3b8',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={13} color="#4ade80" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong style={{ color: '#e2e8f0' }}>{src.institution}</strong> ({src.year}): {src.reference}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Footer Action Buttons */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(10, 13, 18, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Real Action 1: Buka Katalog / Karya Mitra UMKM */}
        <button
          onClick={() => {
            soundManager.playUiClick();
            onOpenProduct(exhibit);
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
            color: '#0d1017',
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ShoppingBag size={17} />
          <span>Lihat Karya Mitra UMKM & Perajin</span>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Action 2: Salin / Bagikan Kurasi */}
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <ExternalLink size={14} />
            <span>{copiedLink ? 'Tersalin!' : 'Bagikan Info'}</span>
          </button>

          {/* Action 3: Tutup Panel */}
          <button
            onClick={() => {
              soundManager.playUiClick();
              soundManager.stopNarration();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94a3b8',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <X size={14} />
            <span>Tutup Panel</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

