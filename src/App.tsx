import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { MuseumScene } from './components/3d/MuseumScene';
import { Lighting } from './components/3d/Lighting';
import { Avatar } from './components/3d/avatar/Avatar';
import { CameraController } from './components/3d/CameraController';
import { InfoPanel } from './components/ui/InfoPanel';
import { MobileControls } from './components/ui/MobileControls';
import { Minimap } from './components/ui/Minimap';
import { HUD } from './components/ui/HUD';
import { ISLANDS } from './data/islands';
import { museum, useMuseum } from './state/museumStore';
import { playerState, rotateCamera } from './state/playerState';
import { QUALITY } from './config/quality';
import { soundManager } from './utils/sound';

const MOVE_KEYS: Record<string, [number, number]> = {
  w: [0, 1], arrowup: [0, 1],
  s: [0, -1], arrowdown: [0, -1],
  a: [-1, 0], arrowleft: [-1, 0],
  d: [1, 0], arrowright: [1, 0]
};

if (import.meta.env.DEV) {
  (window as unknown as { __cv: unknown }).__cv = { playerState, museum };
}

export const App: React.FC = () => {
  const activeZone = useMuseum((s) => s.activeZone);
  const nearbyZone = useMuseum((s) => s.nearbyZone);
  const [isTouch, setIsTouch] = useState(false);

  const held = useRef(new Set<string>());
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  /* ── Keyboard: WASD / panah, Shift = lari, E = interaksi, Esc = tutup ── */
  const syncKeys = useCallback(() => {
    let x = 0, y = 0;
    held.current.forEach((k) => {
      const m = MOVE_KEYS[k];
      if (m) { x += m[0]; y += m[1]; }
    });
    const len = Math.hypot(x, y);
    playerState.input.keyX = len ? x / len : 0;
    playerState.input.keyY = len ? y / len : 0;
    playerState.input.run = held.current.has('shift');
  }, []);

  useEffect(() => {
    const openNearby = () => {
      const id = museum.getState().nearbyZone;
      if (id) {
        soundManager.playInteractChime();
        museum.openZone(id);
      }
    };
    const down = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'e') {
        if (!museum.getState().activeZone) openNearby();
        return;
      }
      if (k === 'escape') {
        if (museum.getState().activeZone) {
          soundManager.stopNarration();
          museum.closeZone();
        }
        return;
      }
      if (MOVE_KEYS[k] || k === 'shift') {
        held.current.add(k);
        syncKeys();
        if (k.startsWith('arrow')) e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      held.current.delete(e.key.toLowerCase());
      syncKeys();
    };
    const blur = () => {
      held.current.clear();
      syncKeys();
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [syncKeys]);

  /* ── Drag mouse untuk memutar kamera (hanya bila dimulai di canvas) ── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (!(e.target instanceof HTMLCanvasElement)) return;
    if (e.button !== 0 && e.button !== 2) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rotateCamera(-dx * 0.0045, dy * 0.003);
  };
  const stopDrag = () => {
    dragging.current = false;
  };

  const handleMove = useCallback((v: { x: number; y: number }) => {
    playerState.input.joyX = v.x;
    playerState.input.joyY = v.y;
  }, []);

  return (
    <div
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#f6f1e7' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        shadows="soft"
        dpr={QUALITY.dpr}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false
        }}
        camera={{ fov: 62, near: 0.5, far: 140 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Physics gravity={[0, -20, 0]}>
          <Lighting />
          <MuseumScene />
          <Avatar isInspecting={!!activeZone} />
          <CameraController />
        </Physics>
      </Canvas>

      <HUD />
      <Minimap />
      <InfoPanel />

      {isTouch && (
        <MobileControls
          onMove={handleMove}
          onRotateCamera={(dy, dp) => rotateCamera(-dy, dp)}
          onInteract={() => nearbyZone && museum.openZone(nearbyZone)}
          isNearZone={!!nearbyZone && !activeZone}
          zoneName={nearbyZone ? ISLANDS[nearbyZone].name : undefined}
        />
      )}
    </div>
  );
};

export default App;
