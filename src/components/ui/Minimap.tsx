import React from 'react';
import { CULTURAL_EXHIBITS, CulturalExhibit } from '../../utils/culturalData';
import { soundManager } from '../../utils/sound';
import { Compass } from 'lucide-react';

interface MinimapProps {
  avatarPos: [number, number, number];
  cameraAngleY: number;
  activeExhibitId: string | null;
  onSelectExhibit: (exhibit: CulturalExhibit) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  avatarPos,
  cameraAngleY,
  activeExhibitId,
  onSelectExhibit
}) => {
  // Map dimensions relative to room: room is 18m wide (X: -9 to +9) and 26m long (Z: -13 to +13)
  const mapWidth = 140;
  const mapHeight = 190;

  const toMapCoord = (x: number, z: number) => {
    // x: [-9, 9] -> [0, mapWidth]
    // z: [-13, 13] -> [0, mapHeight]
    const mx = ((x + 9) / 18) * mapWidth;
    const my = ((z + 13) / 26) * mapHeight;
    return { mx, my };
  };

  const playerCoord = toMapCoord(avatarPos[0], avatarPos[2]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 40,
        background: 'rgba(12, 15, 22, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '16px',
        padding: '12px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {/* Minimap Title Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontWeight: 700,
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}
      >
        <span>Denah Galeri</span>
        <Compass size={14} color="#d4af37" />
      </div>

      {/* SVG Canvas Map */}
      <svg
        width={mapWidth}
        height={mapHeight}
        style={{
          background: '#080a0f',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Central Red Carpet */}
        <rect
          x={mapWidth * 0.4}
          y={mapHeight * 0.04}
          width={mapWidth * 0.2}
          height={mapHeight * 0.92}
          fill="#80101f"
          stroke="#d4af37"
          strokeWidth="1"
          rx="2"
        />

        {/* Outer Hall Wall border */}
        <rect
          x="1"
          y="1"
          width={mapWidth - 2}
          height={mapHeight - 2}
          fill="none"
          stroke="rgba(212, 175, 55, 0.3)"
          strokeWidth="1.5"
          rx="6"
        />

        {/* Exhibit Stand Markers */}
        {CULTURAL_EXHIBITS.map((exhibit) => {
          const { mx, my } = toMapCoord(exhibit.modelPosition[0], exhibit.modelPosition[2]);
          const isActive = activeExhibitId === exhibit.id;

          return (
            <g
              key={exhibit.id}
              onClick={() => {
                soundManager.playInteractChime();
                onSelectExhibit(exhibit);
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Exhibit glow when active */}
              {isActive && (
                <circle cx={mx} cy={my} r="9" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.8">
                  <animate attributeName="r" values="6;11;6" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Exhibit Pedestal Marker */}
              <circle
                cx={mx}
                cy={my}
                r="5"
                fill={isActive ? '#ffd700' : '#d4af37'}
                stroke="#12151e"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* Player Avatar Position Marker (Pulsing Arrow) */}
        <g transform={`translate(${playerCoord.mx}, ${playerCoord.my}) rotate(${(-cameraAngleY * 180) / Math.PI})`}>
          <circle cx="0" cy="0" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          {/* Direction indicator cone */}
          <polygon points="0,-9 -4,-4 4,-4" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
};

