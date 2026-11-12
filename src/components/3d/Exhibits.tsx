import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { CULTURAL_EXHIBITS, CulturalExhibit } from '../../utils/culturalData';
import {
  createBatikParangTexture,
  createSongketTexture,
  createTenunIkatSumbaTexture,
  createBatikMegamendungTexture,
  createTenunTorajaTexture,
  createGoldTrimTexture
} from '../../utils/textures';

interface ExhibitsProps {
  onSelectExhibit: (exhibit: CulturalExhibit) => void;
  activeExhibitId: string | null;
  nearbyExhibitId: string | null;
}

export const Exhibits: React.FC<ExhibitsProps> = ({
  onSelectExhibit,
  activeExhibitId,
  nearbyExhibitId
}) => {
  // Pre-generate textures
  const batikParangTex = useMemo(() => createBatikParangTexture(), []);
  const songketTex = useMemo(() => createSongketTexture(), []);
  const tenunSumbaTex = useMemo(() => createTenunIkatSumbaTexture(), []);
  const batikMegaTex = useMemo(() => createBatikMegamendungTexture(), []);
  const tenunTorajaTex = useMemo(() => createTenunTorajaTexture(), []);
  const goldTrimTex = useMemo(() => createGoldTrimTexture(), []);

  // Map exhibit ID to corresponding texture
  const getExhibitTexture = (id: string) => {
    switch (id) {
      case 'batik-parang-rusak':
        return batikParangTex;
      case 'songket-palembang':
        return songketTex;
      case 'tenun-ikat-sumba':
        return tenunSumbaTex;
      case 'batik-megamendung':
        return batikMegaTex;
      case 'tenun-sa-dan-toraja':
        return tenunTorajaTex;
      default:
        return songketTex;
    }
  };

  return (
    <group>
      {CULTURAL_EXHIBITS.map((exhibit) => {
        const [x, y, z] = exhibit.modelPosition;
        const isNearby = nearbyExhibitId === exhibit.id;
        const isActive = activeExhibitId === exhibit.id;
        const texture = getExhibitTexture(exhibit.id);

        return (
          <group key={exhibit.id} position={[x, y, z]} rotation={[0, exhibit.rotationY, 0]}>
            {/* Rapier Physics Collider for Pedestal */}
            <RigidBody type="fixed" colliders="cuboid">
              {/* Main Pedestal Base */}
              <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.9, 1.2]} />
                <meshStandardMaterial color="#171922" roughness={0.3} metalness={0.4} />
              </mesh>
            </RigidBody>

            {/* Pedestal Lower Gold Molding */}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[1.72, 0.16, 1.32]} />
              <meshStandardMaterial map={goldTrimTex} color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Pedestal Upper Gold Molding */}
            <mesh position={[0, 0.88, 0]}>
              <boxGeometry args={[1.68, 0.08, 1.28]} />
              <meshStandardMaterial map={goldTrimTex} color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Dark Velvet Display Cushion */}
            <mesh position={[0, 0.93, 0]}>
              <boxGeometry args={[1.5, 0.04, 1.1]} />
              <meshStandardMaterial color="#1a0c10" roughness={0.9} />
            </mesh>

            {/* Brass Exhibit Label Plaque */}
            <mesh position={[0, 0.5, 0.61]}>
              <boxGeometry args={[0.9, 0.28, 0.02]} />
              <meshStandardMaterial color="#cfa432" metalness={0.9} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.5, 0.622]}>
              <boxGeometry args={[0.84, 0.22, 0.01]} />
              <meshStandardMaterial color="#0c0e14" roughness={0.4} metalness={0.5} />
            </mesh>

            {/* Protective Glass Vitrine Display Case */}
            <mesh position={[0, 1.7, 0]}>
              <boxGeometry args={[1.56, 1.5, 1.16]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.88}
                opacity={0.3}
                transparent={true}
                roughness={0.08}
                ior={1.45}
                reflectivity={0.6}
              />
            </mesh>

            {/* Glass Vitrine Top Gold Frame Rim */}
            <mesh position={[0, 2.45, 0]}>
              <boxGeometry args={[1.58, 0.04, 1.18]} />
              <meshStandardMaterial map={goldTrimTex} color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* 3D ARTIFACT EXHIBIT DISPLAY */}
            {exhibit.category === 'busana' ? (
              // Stylized Mannequin with Minangkabau Bundo Kanduang Attire
              <group position={[0, 0.95, 0]}>
                {/* Mannequin stand pole */}
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.6]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Torso Dress (Batabua Beludru Hitam) */}
                <mesh position={[0, 0.75, 0]} castShadow>
                  <cylinderGeometry args={[0.22, 0.32, 0.7, 16]} />
                  <meshStandardMaterial color="#111116" roughness={0.8} />
                </mesh>
                {/* Gold embroidery floral necklace on chest */}
                <mesh position={[0, 0.9, 0.16]}>
                  <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
                  <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Minangkabau Salempang Songket Sash draped diagonally */}
                <mesh position={[0, 0.74, 0.06]} rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.12, 0.75, 0.36]} />
                  <meshStandardMaterial map={songketTex} roughness={0.5} metalness={0.3} />
                </mesh>
                {/* Tingkuluak Tanduk Rusa Headpiece */}
                <group position={[0, 1.25, 0]}>
                  {/* Left Horn */}
                  <mesh position={[-0.22, 0.1, 0]} rotation={[0, 0, Math.PI / 3]}>
                    <coneGeometry args={[0.07, 0.42, 12]} />
                    <meshStandardMaterial color="#a61c28" roughness={0.6} />
                  </mesh>
                  {/* Right Horn */}
                  <mesh position={[0.22, 0.1, 0]} rotation={[0, 0, -Math.PI / 3]}>
                    <coneGeometry args={[0.07, 0.42, 12]} />
                    <meshStandardMaterial color="#a61c28" roughness={0.6} />
                  </mesh>
                  {/* Central crown base */}
                  <mesh position={[0, -0.05, 0]}>
                    <cylinderGeometry args={[0.14, 0.16, 0.14, 16]} />
                    <meshStandardMaterial map={goldTrimTex} color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                </group>
              </group>
            ) : (
              // Textile Exhibition Display Stand with Draped Heritage Fabric
              <group position={[0, 0.95, 0]}>
                {/* Brass Textile Hanger Rack */}
                <mesh position={[0, 0.65, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.02, 0.02, 1.3]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Vertical support rods */}
                <mesh position={[-0.55, 0.35, -0.2]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0.55, 0.35, -0.2]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Main Curved Angled Display Panel for clear motif appreciation */}
                <mesh position={[0, 0.65, 0.02]} rotation={[-0.3, 0, 0]} castShadow>
                  <boxGeometry args={[1.2, 0.9, 0.04]} />
                  <meshStandardMaterial
                    map={texture}
                    roughness={0.7}
                    metalness={exhibit.category === 'songket' ? 0.45 : 0.15}
                  />
                </mesh>

                {/* Subtle Fabric Fringes / Border Trim */}
                <mesh position={[0, 0.22, 0.16]} rotation={[-0.3, 0, 0]}>
                  <boxGeometry args={[1.2, 0.06, 0.05]} />
                  <meshStandardMaterial map={goldTrimTex} color="#e5c158" metalness={0.8} roughness={0.3} />
                </mesh>
              </group>
            )}

            {/* Interactive Proximity Visual Cue Badge */}
            {(isNearby || isActive) && (
              <Html
                position={[0, 2.7, 0]}
                center
                distanceFactor={7}
                style={{
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  transform: 'translate3d(0, 0, 0)',
                  transition: 'all 0.25s ease-out'
                }}
              >
                <div
                  onClick={() => onSelectExhibit(exhibit)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '24px',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(166, 124, 0, 0.95))'
                      : 'linear-gradient(135deg, rgba(16, 20, 30, 0.92), rgba(28, 34, 48, 0.92))',
                    border: '1px solid #d4af37',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(212, 175, 55, 0.4)',
                    color: isActive ? '#0d1017' : '#f5d77f',
                    fontWeight: 700,
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    backdropFilter: 'blur(8px)',
                    animation: 'pulseGlow 2s infinite ease-in-out'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isActive ? '#0d1017' : '#d4af37',
                      color: isActive ? '#d4af37' : '#0d1017',
                      fontSize: '11px',
                      fontWeight: 900
                    }}
                  >
                    E
                  </span>
                  <span>{isActive ? 'Panel Terbuka' : exhibit.name}</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
