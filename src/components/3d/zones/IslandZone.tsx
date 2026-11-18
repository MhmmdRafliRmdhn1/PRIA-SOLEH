import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import type { ZoneLayout } from '../../../config/layout';
import { ZONE_TRIGGER_RADIUS } from '../../../config/layout';
import { ISLANDS, PROVINCES_BY_ISLAND } from '../../../data/islands';
import { museum, useMuseum, zoneEnergy } from '../../../state/museumStore';
import { buildIslandModel } from '../../../utils/islandGeometry';
import { createNamePlateTexture } from '../../../utils/textures';
import { useHallMaterials } from '../hall/materials';

interface Props {
  layout: ZoneLayout;
}

/** Hologram melayang tinggi agar titik terendahnya (tepi selatan) tetap di atas kepala avatar. */
const HOLO_Y = 4.15;

export const IslandZone: React.FC<Props> = ({ layout }) => {
  const island = ISLANDS[layout.id];
  const provinces = PROVINCES_BY_ISLAND[layout.id];
  const mats = useHallMaterials();

  const model = useMemo(() => buildIslandModel(layout.id), [layout.id]);
  const plate = useMemo(
    () => createNamePlateTexture(island.name, `${provinces.length} Provinsi`),
    [island.name, provinces.length]
  );
  useEffect(
    () => () => {
      model.geometry.dispose();
      model.edges.dispose();
      plate.dispose();
    },
    [model, plate]
  );

  const isNearby = useMuseum((s) => s.nearbyZone === layout.id);
  const isActive = useMuseum((s) => s.activeZone === layout.id);
  const selectedId = useMuseum((s) => (s.activeZone === layout.id ? s.selectedProvince : null));

  const holo = useRef<THREE.Group>(null);
  const holoMat = useRef<THREE.MeshStandardMaterial>(null);
  const padRing = useRef<THREE.Mesh>(null);
  const guide = useRef<THREE.Mesh>(null);
  const pins = useRef<(THREE.Mesh | null)[]>([]);
  const scaleCur = useRef(0.94);
  const spotTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 1.5, 0);
    return o;
  }, []);

  const padMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffc24d', toneMapped: false, transparent: true, opacity: 0.5 }),
    []
  );
  const guideMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffc24d', toneMapped: false, transparent: true, opacity: 0.4 }),
    []
  );
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#d9a01a', toneMapped: false }), []);

  const pinPositions = useMemo(
    () =>
      provinces.map((p) => {
        const [x, y] = model.project(p.coord[0], p.coord[1]);
        return { id: p.id, name: p.name, pos: [x, model.depth + 0.12, -y] as [number, number, number] };
      }),
    [provinces, model]
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const energy = zoneEnergy[layout.id];
    const boost = Math.max(energy, isNearby || isActive ? 0.85 : 0);

    if (holo.current) {
      holo.current.position.y = HOLO_Y + Math.sin(t * 0.9 + layout.bearingDeg) * 0.08;
      holo.current.rotation.y = Math.sin(t * 0.35 + layout.bearingDeg) * 0.12;
      const target = 0.94 + boost * 0.1;
      scaleCur.current += (target - scaleCur.current) * (1 - Math.exp(-3 * dt));
      holo.current.scale.setScalar(scaleCur.current);
    }
    if (holoMat.current) holoMat.current.emissiveIntensity = 0.28 + boost * 0.55;
    padMat.opacity = 0.35 + boost * 0.65;
    guideMat.opacity = 0.25 + boost * 0.75;
    if (padRing.current) padRing.current.rotation.z += dt * 0.2;

    const hover = museum.getState().hoverProvince;
    pinPositions.forEach((p, i) => {
      const m = pins.current[i];
      if (!m) return;
      const sel = p.id === selectedId || p.id === hover;
      const s = sel ? 1.8 + 0.35 * Math.sin(t * 6) : 1;
      m.scale.setScalar(m.scale.x + (s - m.scale.x) * (1 - Math.exp(-10 * dt)));
    });
  });

  const selectedPin = pinPositions.find((p) => p.id === selectedId);

  return (
    <group position={layout.position} rotation={[0, layout.rotationY, 0]}>
      {/* panggung lingkaran */}
      <mesh position={[0, 0.05, 0]} material={mats.whiteGloss} receiveShadow>
        <cylinderGeometry args={[5, 5.1, 0.1, 72]} />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation-x={-Math.PI / 2} ref={padRing} material={padMat}>
        <ringGeometry args={[4.55, 4.65, 96, 1]} />
      </mesh>
      <mesh position={[0, 0.115, 0]} rotation-x={-Math.PI / 2} material={mats.gold}>
        <ringGeometry args={[4.9, 5.0, 96]} />
      </mesh>

      {/* lajur LED menuju pusat aula (sumbu +z lokal) */}
      <mesh ref={guide} position={[0, 0.012, 5.1 + 3.9]} rotation-x={-Math.PI / 2} material={guideMat}>
        <planeGeometry args={[0.14, 7.8]} />
      </mesh>

      {/* pedestal proyektor */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.55, 1.05]} position={[0, 0.55, 0]} />
      </RigidBody>
      <mesh position={[0, 0.55, 0]} material={mats.whiteGloss} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 1.0, 1.1, 40]} />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation-x={Math.PI / 2} material={mats.gold}>
        <torusGeometry args={[0.85, 0.05, 8, 60]} />
      </mesh>
      <mesh position={[0, 1.13, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.72, 40]} />
        <meshBasicMaterial color="#ffe7a3" toneMapped={false} />
      </mesh>

      {/* model hologram pulau */}
      <group ref={holo} position={[0, HOLO_Y, 0]}>
        <group rotation={[0.55, 0, 0]} scale={1.08}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={model.geometry} castShadow>
              <meshStandardMaterial
                ref={holoMat}
                color="#fff4d2"
                emissive="#ffb300"
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.15}
                transparent
                opacity={0.93}
              />
            </mesh>
            <lineSegments geometry={model.edges} material={edgeMat} />
          </group>
          {pinPositions.map((p, i) => (
            <mesh
              key={p.id}
              ref={(m) => {
                pins.current[i] = m;
              }}
              position={p.pos}
            >
              <sphereGeometry args={[0.075, 14, 10]} />
              <meshBasicMaterial color="#ff9d00" toneMapped={false} />
            </mesh>
          ))}
          {selectedPin && (
            <Html position={[selectedPin.pos[0], selectedPin.pos[1] + 0.3, selectedPin.pos[2]]} center distanceFactor={7} zIndexRange={[10, 0]}>
              <div className="pin-label">{selectedPin.name}</div>
            </Html>
          )}
        </group>
      </group>
      {/* sinar tipis dari pedestal ke hologram */}
      <mesh position={[0, 1.2 + (HOLO_Y - 1.2) / 2, 0]}>
        <cylinderGeometry args={[0.3, 0.8, HOLO_Y - 1.3, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffd873"
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* gerbang lengkung di belakang zona */}
      <group position={[0, 0, -6.3]}>
        {([-4.2, 4.2] as number[]).map((x) => (
          <group key={x}>
            <RigidBody type="fixed" colliders={false}>
              <CylinderCollider args={[3.5, 0.4]} position={[x, 3.5, 0]} />
            </RigidBody>
            <mesh position={[x, 3.6, 0]} material={mats.whiteSatin} castShadow>
              <cylinderGeometry args={[0.32, 0.4, 7.2, 24]} />
            </mesh>
            <mesh position={[x, 0.2, 0]} material={mats.gold}>
              <cylinderGeometry args={[0.5, 0.54, 0.4, 24]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 7.2, 0]} material={mats.whiteSatin} castShadow>
          <torusGeometry args={[4.2, 0.28, 12, 64, Math.PI]} />
        </mesh>
        <mesh position={[0, 7.2, 0.05]} material={mats.led}>
          <torusGeometry args={[3.85, 0.045, 8, 64, Math.PI]} />
        </mesh>
        <mesh position={[0, 5.9, 0.1]}>
          <planeGeometry args={[5.6, 1.64]} />
          <meshBasicMaterial map={plate} transparent toneMapped={false} />
        </mesh>
      </group>

      <primitive object={spotTarget} />
      <spotLight
        position={[0, 11, 3]}
        target={spotTarget}
        angle={0.55}
        penumbra={0.85}
        intensity={260}
        distance={24}
        decay={2}
        color="#fff0cf"
      />

      {isNearby && !isActive && (
        <Html position={[0, 4.9, 0]} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div className="zone-badge" onClick={() => museum.openZone(layout.id)}>
            <span className="zone-badge__key">E</span>
            <span>{`Jelajahi ${island.name}`}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

export const ZONE_TRIGGER = ZONE_TRIGGER_RADIUS;
