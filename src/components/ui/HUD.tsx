import React, { useEffect, useState } from 'react';
import { HelpCircle, Keyboard, Smartphone, Volume2, VolumeX, Globe2, Sparkles } from 'lucide-react';
import { ISLANDS } from '../../data/islands';
import { museum, useMuseum } from '../../state/museumStore';
import { soundManager } from '../../utils/sound';

export const HUD: React.FC = () => {
  const [muted, setMuted] = useState(soundManager.getMuted());
  const [help, setHelp] = useState(false);
  const [welcome, setWelcome] = useState<'on' | 'off' | 'gone'>('on');
  const nearby = useMuseum((s) => s.nearbyZone);
  const active = useMuseum((s) => s.activeZone);
  const target = useMuseum((s) => s.globeTarget);

  useEffect(() => {
    const a = window.setTimeout(() => setWelcome('off'), 9000);
    const b = window.setTimeout(() => setWelcome('gone'), 9700);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  const toggleMute = () => {
    const m = soundManager.toggleMute();
    setMuted(m);
    if (!m) soundManager.playUiClick();
  };

  const nearbyName = nearby ? ISLANDS[nearby].name : null;

  return (
    <>
      <header className="hud-top">
        <div className="brand glass">
          <div className="brand__logo">🏛️</div>
          <div>
            <div className="brand__title">
              CULTURE<b>VERSE</b>
            </div>
            <div className="brand__sub">Future Heritage Museum · SDG 11.4</div>
          </div>
        </div>
        <div className="hud-actions">
          <button className="icon-btn" onClick={toggleMute} aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}>
            {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
          <button
            className="icon-btn"
            onClick={() => {
              soundManager.playUiClick();
              setHelp(true);
            }}
            aria-label="Petunjuk kontrol"
          >
            <HelpCircle size={19} />
          </button>
        </div>
      </header>

      <div className={`globe-chip glass ${target && !active ? 'on' : ''}`} aria-live="polite">
        <Globe2 size={16} color="#a8760b" />
        <span className="globe-chip__dot" />
        <span>
          Globe menuju <b>{target ? ISLANDS[target].name : ''}</b>
        </span>
      </div>

      {nearbyName && !active && (
        <div
          className="prompt glass"
          onClick={() => {
            soundManager.playInteractChime();
            if (nearby) museum.openZone(nearby);
          }}
        >
          <span className="kbd" style={{ width: 32, height: 32, borderRadius: 12 }}>E</span>
          <div>
            <div className="prompt__t">Zona pameran</div>
            <div className="prompt__m">Jelajahi Pulau {nearbyName}</div>
          </div>
        </div>
      )}

      {welcome !== 'gone' && !active && (
        <div className={`toast glass ${welcome === 'off' ? 'off' : ''}`}>
          <Sparkles size={15} color="#d9a82a" style={{ verticalAlign: '-2px' }} /> Selamat datang di <b>CultureVerse</b>. Berjalanlah menuju salah satu
          dari lima pulau. Globe di atas aula akan berputar mengikuti arah Anda.
        </div>
      )}

      <div className="hint glass hidden-mobile">
        <span className="kbd">Shift</span> lari
      </div>

      {help && (
        <div className="modal-bg" role="dialog" aria-modal="true" onClick={() => setHelp(false)}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()}>
            <h3>Panduan Menjelajah</h3>
            <div className="helpgrid">
              <div className="helpbox">
                <h4><Keyboard size={16} /> Desktop</h4>
                <ul>
                  <li><b>W A S D</b> / panah: berjalan</li>
                  <li><b>Shift</b>: berlari</li>
                  <li><b>Drag mouse</b>: memutar kamera</li>
                  <li><b>E</b>: membuka zona pulau</li>
                  <li><b>Esc</b>: menutup panel</li>
                </ul>
              </div>
              <div className="helpbox">
                <h4><Smartphone size={16} /> Mobile</h4>
                <ul>
                  <li><b>Joystick</b> kiri: berjalan (dorong penuh = lari)</li>
                  <li><b>Geser</b> sisi kanan: kamera</li>
                  <li><b>Tombol E</b>: muncul di dekat zona</li>
                </ul>
              </div>
            </div>
            <button
              className="btn-gold"
              style={{ width: '100%' }}
              onClick={() => {
                soundManager.playUiClick();
                setHelp(false);
              }}
            >
              Mulai Menjelajah
            </button>
          </div>
        </div>
      )}
    </>
  );
};
