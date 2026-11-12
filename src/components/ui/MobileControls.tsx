import React, { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface MobileControlsProps {
  onMove: (vector: { x: number; y: number }) => void;
  onRotateCamera: (deltaYaw: number, deltaPitch: number) => void;
  onInteract: () => void;
  isNearExhibit: boolean;
  activeExhibitName?: string;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onRotateCamera,
  onInteract,
  isNearExhibit,
  activeExhibitName
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickThumbRef = useRef<HTMLDivElement>(null);

  const [joystickActive, setJoystickActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);
  const baseCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera swipe touch tracking
  const cameraTouchIdRef = useRef<number | null>(null);
  const lastCameraTouchPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch start on joystick
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    if (joystickBaseRef.current) {
      const rect = joystickBaseRef.current.getBoundingClientRect();
      baseCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    setJoystickActive(true);
    updateJoystickPos(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystickPos(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        onMove({ x: 0, y: 0 });
        if (joystickThumbRef.current) {
          joystickThumbRef.current.style.transform = 'translate(-50%, -50%)';
        }
        break;
      }
    }
  };

  const updateJoystickPos = (clientX: number, clientY: number) => {
    const maxRadius = 45;
    const dx = clientX - baseCenterRef.current.x;
    const dy = clientY - baseCenterRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const thumbX = Math.cos(angle) * clampedDist;
    const thumbY = Math.sin(angle) * clampedDist;

    if (joystickThumbRef.current) {
      joystickThumbRef.current.style.transform = `translate(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px))`;
    }

    // Normalized movement vector (-1 to 1)
    // Note: dy negative is forward in 3D (-Z)
    onMove({
      x: thumbX / maxRadius,
      y: -thumbY / maxRadius
    });
  };

  // Camera touch swipe surface on the right half
  const handleCameraTouchStart = (e: React.TouchEvent) => {
    if (cameraTouchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    cameraTouchIdRef.current = touch.identifier;
    lastCameraTouchPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleCameraTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === cameraTouchIdRef.current) {
        const dx = touch.clientX - lastCameraTouchPos.current.x;
        const dy = touch.clientY - lastCameraTouchPos.current.y;
        lastCameraTouchPos.current = { x: touch.clientX, y: touch.clientY };

        // Rotate camera with touch sensitivity
        onRotateCamera(dx * 0.006, dy * 0.005);
        break;
      }
    }
  };

  const handleCameraTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === cameraTouchIdRef.current) {
        cameraTouchIdRef.current = null;
        break;
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 30,
        userSelect: 'none'
      }}
    >
      {/* Right side Camera Swipe Area */}
      <div
        onTouchStart={handleCameraTouchStart}
        onTouchMove={handleCameraTouchMove}
        onTouchEnd={handleCameraTouchEnd}
        onTouchCancel={handleCameraTouchEnd}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          pointerEvents: 'auto'
        }}
      />

      {/* Virtual Touch Joystick (Bottom Left) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleJoystickTouchStart}
        onTouchMove={handleJoystickTouchMove}
        onTouchEnd={handleJoystickTouchEnd}
        onTouchCancel={handleJoystickTouchEnd}
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '36px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(15, 18, 26, 0.65) 70%)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(212, 175, 55, 0.2)',
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
      >
        {/* Center Joystick Thumb Knob */}
        <div
          ref={joystickThumbRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: joystickActive
              ? 'radial-gradient(circle, #ffd700 0%, #aa8c2c 100%)'
              : 'radial-gradient(circle, #d4af37 0%, #7d651a 100%)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 215, 0, 0.5)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: joystickActive ? 'none' : 'transform 0.15s ease'
          }}
        />
      </div>

      {/* Interactive Action Button [E] on Bottom Right when near an exhibit */}
      {isNearExhibit && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '36px',
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={() => {
              soundManager.playInteractChime();
              onInteract();
            }}
            style={{
              padding: '14px 22px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #aa8c2c 100%)',
              border: '2px solid #fff5c0',
              color: '#0d1017',
              fontSize: '14px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 215, 0, 0.6)',
              cursor: 'pointer',
              animation: 'bounceSoft 1.5s infinite ease-in-out'
            }}
          >
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#0d1017',
                color: '#ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 900
              }}
            >
              E
            </span>
            <span>Periksa Koleksi</span>
          </button>
        </div>
      )}
    </div>
  );
};

