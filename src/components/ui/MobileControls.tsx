import React, { useRef } from 'react';
import { soundManager } from '../../utils/sound';

interface MobileControlsProps {
  onMove: (vector: { x: number; y: number }) => void;
  onRotateCamera: (deltaYaw: number, deltaPitch: number) => void;
  onInteract: () => void;
  isNearZone: boolean;
  zoneName?: string;
}

const MAX_RADIUS = 46;

/** Joystick virtual + area geser kamera + tombol interaksi E (logika sentuh dipertahankan). */
export const MobileControls: React.FC<MobileControlsProps> = ({ onMove, onRotateCamera, onInteract, isNearZone, zoneName }) => {
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const joyId = useRef<number | null>(null);
  const center = useRef({ x: 0, y: 0 });
  const camId = useRef<number | null>(null);
  const lastCam = useRef({ x: 0, y: 0 });

  const updateJoy = (cx: number, cy: number) => {
    const dx = cx - center.current.x;
    const dy = cy - center.current.y;
    const d = Math.min(Math.hypot(dx, dy), MAX_RADIUS);
    const a = Math.atan2(dy, dx);
    const tx = Math.cos(a) * d;
    const ty = Math.sin(a) * d;
    if (knob.current) knob.current.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
    onMove({ x: tx / MAX_RADIUS, y: -ty / MAX_RADIUS });
  };

  const joyStart = (e: React.TouchEvent) => {
    if (joyId.current !== null) return;
    const t = e.changedTouches[0];
    joyId.current = t.identifier;
    if (base.current) {
      const r = base.current.getBoundingClientRect();
      center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    updateJoy(t.clientX, t.clientY);
  };
  const joyMove = (e: React.TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === joyId.current) {
        updateJoy(t.clientX, t.clientY);
        break;
      }
    }
  };
  const joyEnd = (e: React.TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === joyId.current) {
        joyId.current = null;
        onMove({ x: 0, y: 0 });
        if (knob.current) knob.current.style.transform = 'translate(-50%, -50%)';
        break;
      }
    }
  };

  const camStart = (e: React.TouchEvent) => {
    if (camId.current !== null) return;
    const t = e.changedTouches[0];
    camId.current = t.identifier;
    lastCam.current = { x: t.clientX, y: t.clientY };
  };
  const camMove = (e: React.TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === camId.current) {
        onRotateCamera((t.clientX - lastCam.current.x) * 0.006, (t.clientY - lastCam.current.y) * 0.005);
        lastCam.current = { x: t.clientX, y: t.clientY };
        break;
      }
    }
  };
  const camEnd = (e: React.TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) if (t.identifier === camId.current) camId.current = null;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
      <div
        onTouchStart={camStart}
        onTouchMove={camMove}
        onTouchEnd={camEnd}
        onTouchCancel={camEnd}
        style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', pointerEvents: 'auto', touchAction: 'none' }}
      />
      <div ref={base} className="joy" onTouchStart={joyStart} onTouchMove={joyMove} onTouchEnd={joyEnd} onTouchCancel={joyEnd}>
        <div ref={knob} className="joy__knob" />
      </div>
      {isNearZone && (
        <button
          className="btn-gold"
          style={{ position: 'absolute', bottom: 48, right: 28, pointerEvents: 'auto' }}
          onClick={() => {
            soundManager.playInteractChime();
            onInteract();
          }}
        >
          <span className="kbd">E</span> {zoneName ? `Jelajahi ${zoneName}` : 'Jelajahi'}
        </button>
      )}
    </div>
  );
};
