import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { MuseumScene }      from './components/3d/MuseumScene';
import { Lighting }         from './components/3d/Lighting';
import { Exhibits }         from './components/3d/Exhibits';
import { Avatar }           from './components/3d/Avatar';
import { CameraController } from './components/3d/CameraController';
import { InfoPanel }        from './components/ui/InfoPanel';
import { ProductModal }     from './components/ui/ProductModal';
import { MobileControls }   from './components/ui/MobileControls';
import { Minimap }          from './components/ui/Minimap';
import { HUD }              from './components/ui/HUD';
import { CULTURAL_EXHIBITS, CulturalExhibit } from './utils/culturalData';
import { soundManager }     from './utils/sound';

// Spawn Y must match Avatar's SPAWN_Y constant (≈ 0.88)
const SPAWN_Y = 0.52 + 0.28 + 0.08;

export const MuseumExperience: React.FC = () => {
  const [activeExhibit, setActiveExhibit]   = useState<CulturalExhibit | null>(null);
  const [nearbyExhibitId, setNearbyExhibitId] = useState<string | null>(null);
  const [productExhibit, setProductExhibit] = useState<CulturalExhibit | null>(null);

  // Initialise avatarPos at the physics spawn position so camera
  // is correctly placed on the first frame before physics settles.
  const [avatarPos, setAvatarPos] = useState<[number, number, number]>([0, SPAWN_Y, 7]);

  const [movementInput, setMovementInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cameraOrbit, setCameraOrbit]     = useState<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0.28 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const keysRef         = useRef<Record<string, boolean>>({});
  const isPointerDown   = useRef(false);
  const lastPointerPos  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const updateMovement = useCallback(() => {
    const k = keysRef.current;
    let x = 0, y = 0;
    if (k['w'] || k['W'] || k['ArrowUp'])    y += 1;
    if (k['s'] || k['S'] || k['ArrowDown'])   y -= 1;
    if (k['a'] || k['A'] || k['ArrowLeft'])   x -= 1;
    if (k['d'] || k['D'] || k['ArrowRight'])  x += 1;
    if (x && y) { const s = 1 / Math.SQRT2; x *= s; y *= s; }
    setMovementInput({ x, y });
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      keysRef.current[e.key] = true;
      updateMovement();

      if (e.key === 'e' || e.key === 'E') {
        if (nearbyExhibitId) {
          const ex = CULTURAL_EXHIBITS.find(c => c.id === nearbyExhibitId);
          if (ex) { soundManager.playInteractChime(); setActiveExhibit(ex); }
        }
      }
      if (e.key === 'Escape') {
        if (productExhibit) setProductExhibit(null);
        else if (activeExhibit) { soundManager.stopNarration(); setActiveExhibit(null); }
      }
    };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key] = false; updateMovement(); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [nearbyExhibitId, activeExhibit, productExhibit, updateMovement]);

  /* ── Mouse camera orbit ─────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 2) return;
    isPointerDown.current = true;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    setCameraOrbit(prev => ({
      yaw:   prev.yaw - dx * 0.004,
      pitch: Math.max(0.05, Math.min(1.1, prev.pitch + dy * 0.003))
    }));
  };
  const onPointerUp = () => { isPointerDown.current = false; };

  const handleSelectExhibit = (ex: CulturalExhibit) => {
    soundManager.playInteractChime();
    setActiveExhibit(ex);
  };

  const nearbyExhibit = CULTURAL_EXHIBITS.find(e => e.id === nearbyExhibitId);

  return (
    <div
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0d0f14' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onContextMenu={e => e.preventDefault()}
    >
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 60, near: 0.1, far: 80 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* gravity: standard Earth gravity */}
        <Physics gravity={[0, -20, 0]}>
          <Lighting />
          <MuseumScene />
          <Exhibits
            onSelectExhibit={handleSelectExhibit}
            activeExhibitId={activeExhibit?.id ?? null}
            nearbyExhibitId={nearbyExhibitId}
          />
          <Avatar
            onNearExhibit={setNearbyExhibitId}
            movementInput={movementInput}
            cameraAngleY={cameraOrbit.yaw}
            onPositionUpdate={setAvatarPos}
            isInspecting={!!activeExhibit}
          />
          <CameraController
            avatarPos={avatarPos}
            cameraOrbit={cameraOrbit}
            activeExhibit={activeExhibit}
            isInspecting={!!activeExhibit}
          />
        </Physics>
      </Canvas>

      <HUD
        nearbyExhibitName={nearbyExhibit?.name}
        onInteract={() => nearbyExhibit && handleSelectExhibit(nearbyExhibit)}
        isInspecting={!!activeExhibit}
      />

      <Minimap
        avatarPos={avatarPos}
        cameraAngleY={cameraOrbit.yaw}
        activeExhibitId={activeExhibit?.id ?? null}
        onSelectExhibit={handleSelectExhibit}
      />

      <InfoPanel
        exhibit={activeExhibit}
        onClose={() => { soundManager.stopNarration(); setActiveExhibit(null); }}
        onOpenProduct={ex => setProductExhibit(ex)}
      />

      <ProductModal
        exhibit={productExhibit}
        onClose={() => setProductExhibit(null)}
      />

      {isTouchDevice && (
        <MobileControls
          onMove={setMovementInput}
          onRotateCamera={(dy, dp) =>
            setCameraOrbit(prev => ({
              yaw:   prev.yaw - dy,
              pitch: Math.max(0.05, Math.min(1.1, prev.pitch + dp))
            }))
          }
          onInteract={() => nearbyExhibit && handleSelectExhibit(nearbyExhibit)}
          isNearExhibit={!!nearbyExhibitId}
          activeExhibitName={nearbyExhibit?.name}
        />
      )}
    </div>
  );
};

export default MuseumExperience;
