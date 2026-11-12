import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  Award,
  Layers,
  Keyboard,
  Smartphone
} from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface HUDProps {
  nearbyExhibitName?: string;
  onInteract: () => void;
  isInspecting: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  nearbyExhibitName,
  onInteract,
  isInspecting
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playUiClick();
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 35
        }}
      >
        {/* CultureVerse Logo & Title */}
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(12, 15, 22, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '16px',
            padding: '10px 18px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.1)',
            marginLeft: '170px' // Offset next to minimap
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '18px',
                fontWeight: 900,
                color: '#ffd700',
                letterSpacing: '0.08em',
                textShadow: '0 0 12px rgba(255, 215, 0, 0.4)'
              }}
            >
              CULTUREVERSE
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#4ade80',
                background: 'rgba(74, 222, 128, 0.15)',
                padding: '2px 6px',
                borderRadius: '8px',
                border: '1px solid rgba(74, 222, 128, 0.25)'
              }}
            >
              SDG 11.4
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Museum Virtual Warisan Budaya Nusantara & Pelestarian Komunitas Berkelanjutan
          </div>
        </div>

        {/* Action Controls (Mute & Help) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(12, 15, 22, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: isMuted ? '#ef4444' : '#ffd700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            onClick={() => {
              soundManager.playUiClick();
              setShowHelpModal(true);
            }}
            aria-label="Petunjuk Kontrol & Bantuan"
            style={{
              height: '42px',
              padding: '0 16px',
              borderRadius: '12px',
              background: 'rgba(12, 15, 22, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <HelpCircle size={18} color="#d4af37" />
            <span className="hidden-mobile">Petunjuk Kontrol</span>
          </button>
        </div>
      </header>

      {/* Proximity Interaction Prompt (Center Bottom) */}
      {nearbyExhibitName && !isInspecting && (
        <div
          style={{
            position: 'fixed',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 35,
            pointerEvents: 'auto'
          }}
        >
          <div
            onClick={() => {
              soundManager.playInteractChime();
              onInteract();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, rgba(14, 18, 26, 0.95), rgba(24, 30, 44, 0.95))',
              backdropFilter: 'blur(16px)',
              border: '1px solid #ffd700',
              borderRadius: '32px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.35)',
              cursor: 'pointer',
              animation: 'pulseGlow 2s infinite ease-in-out'
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700, #aa8c2c)',
                color: '#0d1017',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '13px'
              }}
            >
              E
            </span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Mendekati Koleksi</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc' }}>
                Tekan [E] atau Klik untuk Membuka Panel {nearbyExhibitName}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Controls Modal */}
      {showHelpModal && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(5, 7, 10, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: 'linear-gradient(145deg, #12151e 0%, #1a1e2b 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.2)',
              color: '#e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', color: '#ffd700', margin: 0 }}>
                Panduan Navigasi & Eksplorasi Museum
              </h3>
              <button
                onClick={() => {
                  soundManager.playUiClick();
                  setShowHelpModal(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {/* Desktop Controls */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700', fontWeight: 700, marginBottom: '10px' }}>
                  <Keyboard size={18} />
                  <span>Desktop</span>
                </div>
                <ul style={{ fontSize: '13px', lineHeight: 1.8, color: '#cbd5e1', paddingLeft: '18px', margin: 0 }}>
                  <li><strong>W / A / S / D</strong> atau Panah: Berjalan</li>
                  <li><strong>Mouse Drag</strong>: Memutar Kamera</li>
                  <li><strong>Tombol E</strong>: Berinteraksi dengan Display</li>
                  <li><strong>ESC</strong>: Menutup Panel Informasi</li>
                </ul>
              </div>

              {/* Mobile Controls */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700, marginBottom: '10px' }}>
                  <Smartphone size={18} />
                  <span>Mobile / Tablet</span>
                </div>
                <ul style={{ fontSize: '13px', lineHeight: 1.8, color: '#cbd5e1', paddingLeft: '18px', margin: 0 }}>
                  <li><strong>Virtual Joystick</strong> (Kiri): Menggerakkan Avatar</li>
                  <li><strong>Swipe Area</strong> (Kanan): Memutar Sudut Pandang</li>
                  <li><strong>Tombol Aksi [E]</strong>: Muncul saat mendekati koleksi</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                fontSize: '12.5px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                padding: '12px 16px',
                borderRadius: '10px',
                lineHeight: 1.5,
                color: '#f5d77f'
              }}
            >
              <strong>Komitmen SDG 11.4:</strong> Platform ini dibangun untuk mendukung pelestarian aset budaya takbenda Indonesia serta mendokumentasikan kearifan tenun dan batik langsung dari tangan para perajin lokal.
            </div>

            <button
              onClick={() => {
                soundManager.playUiClick();
                setShowHelpModal(false);
              }}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d4af37, #aa8c2c)',
                color: '#0d1017',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Mengerti & Lanjutkan Eksplorasi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

