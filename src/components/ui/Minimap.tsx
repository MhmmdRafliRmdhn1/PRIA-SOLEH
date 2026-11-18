import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { HALL, ZONES, GLOBE } from '../../config/layout';
import { ISLANDS } from '../../data/islands';
import { museum, useMuseum } from '../../state/museumStore';
import { playerState } from '../../state/playerState';
import { soundManager } from '../../utils/sound';

const SIZE = 140;
const SCALE = (SIZE / 2 - 8) / HALL.radius;
const toMap = (x: number, z: number) => ({ mx: SIZE / 2 + x * SCALE, my: SIZE / 2 + z * SCALE });

/** Denah melingkar. Posisi pemain diambil dari playerState pada ~10 Hz, bukan per-frame. */
export const Minimap: React.FC = () => {
  const [pos, setPos] = useState({ x: playerState.position.x, z: playerState.position.z, yaw: 0 });
  const active = useMuseum((s) => s.activeZone);
  const target = useMuseum((s) => s.globeTarget);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPos({ x: playerState.position.x, z: playerState.position.z, yaw: playerState.cameraYaw });
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  const p = toMap(pos.x, pos.z);
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
        <g transform={`translate(${p.mx} ${p.my}) rotate(${(-pos.yaw * 180) / Math.PI + 180})`}>
          <circle r="4.5" fill="#c4161c" stroke="#fff" strokeWidth="1.5" />
          <polygon points="0,-9 -3.5,-4 3.5,-4" fill="#c4161c" />
        </g>
      </svg>
    </div>
  );
};
