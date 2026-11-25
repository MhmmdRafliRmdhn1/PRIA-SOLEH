import React, { useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';
import { HALL, ZONES, GLOBE } from '../../config/layout';
import { ISLANDS } from '../../data/islands';
import { museum, useMuseum } from '../../state/museumStore';
import { playerState } from '../../state/playerState';
import { soundManager } from '../../utils/sound';

const SIZE = 140;
const SCALE = (SIZE / 2 - 8) / HALL.radius;
const toMap = (x: number, z: number) => ({ mx: SIZE / 2 + x * SCALE, my: SIZE / 2 + z * SCALE });

/** Selisih sudut terpendek dalam derajat [-180, 180). */
function shortestAngleDiff(target: number, current: number): number {
  return ((((target - current) % 360) + 540) % 360) - 180;
}

/** Denah melingkar. Posisi & arah hadap pemain diinterpolasi halus via rAF tanpa re-render React. */
export const Minimap: React.FC = () => {
  const indicatorRef = useRef<SVGGElement>(null);
  const initialPos = toMap(playerState.position.x, playerState.position.z);
  const initialDeg = (Math.atan2(playerState.heading.x, -playerState.heading.z) * 180) / Math.PI;
  const smoothRef = useRef({ mx: initialPos.mx, my: initialPos.my, deg: initialDeg });

  const active = useMuseum((s) => s.activeZone);
  const target = useMuseum((s) => s.globeTarget);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const el = indicatorRef.current;
      if (el) {
        const { x: px, z: pz } = playerState.position;
        const { x: hx, z: hz } = playerState.heading;

        if (isFinite(px) && isFinite(pz) && isFinite(hx) && isFinite(hz)) {
          const { mx: tx, my: ty } = toMap(px, pz);
          const targetDeg = (Math.atan2(hx, -hz) * 180) / Math.PI;
          const cur = smoothRef.current;

          const posAlpha = 1 - Math.exp(-dt * 14);
          const rotAlpha = 1 - Math.exp(-dt * 12);

          cur.mx += (tx - cur.mx) * posAlpha;
          cur.my += (ty - cur.my) * posAlpha;
          cur.deg += shortestAngleDiff(targetDeg, cur.deg) * rotAlpha;

          el.setAttribute(
            'transform',
            `translate(${cur.mx.toFixed(2)} ${cur.my.toFixed(2)}) rotate(${cur.deg.toFixed(2)})`
          );
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const c = toMap(GLOBE.position[0], GLOBE.position[2]);

  return (
    <div className="minimap glass hidden-mobile-sm">
      <div className="minimap__t">
        <span>Denah Aula</span>
        <Compass size={13} />
      </div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Denah aula museum">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 4} fill="#fffaf0" stroke="#d9a82a" strokeWidth="1.5" />
        <circle cx={c.mx} cy={c.my} r={7.2 * SCALE} fill="none" stroke="#e8c46a" strokeWidth="1" />
        <circle cx={c.mx} cy={c.my} r="4" fill="#ffc933" />
        {ZONES.map((z) => {
          const m = toMap(z.position[0], z.position[2]);
          const on = active === z.id || target === z.id;
          return (
            <g
              key={z.id}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                soundManager.playInteractChime();
                museum.openZone(z.id);
              }}
            >
              <line x1={c.mx} y1={c.my} x2={m.mx} y2={m.my} stroke="#e8c46a" strokeWidth="0.8" strokeDasharray="2 3" />
              <circle cx={m.mx} cy={m.my} r={on ? 7 : 5.5} fill={on ? '#ffc933' : '#fff'} stroke="#d9a82a" strokeWidth="1.5" />
              <text x={m.mx} y={m.my + (m.my < c.my ? -9 : 15)} textAnchor="middle" fontSize="8" fontWeight="700" fill="#6b5d3d">
                {ISLANDS[z.id].name}
              </text>
            </g>
          );
        })}
        <g
          ref={indicatorRef}
          transform={`translate(${initialPos.mx.toFixed(2)} ${initialPos.my.toFixed(2)}) rotate(${initialDeg.toFixed(2)})`}
        >
          <circle r="4.5" fill="#c4161c" stroke="#fff" strokeWidth="1.5" />
          <polygon points="0,-9 -3.5,-4 3.5,-4" fill="#c4161c" />
        </g>
      </svg>
    </div>
  );
};
