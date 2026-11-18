import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { playerState } from '../../../state/playerState';
import { AVATAR_GLB_URL, AVATAR_HEIGHT } from './avatarConfig';

type Mode = 'idle' | 'walk' | 'run';
const PATTERNS: Record<Mode, RegExp> = {
  idle: /idle|stand|diam/i,
  walk: /walk|jalan/i,
  run: /run|lari|sprint/i
};

/** Memeriksa apakah file GLB benar-benar ada (server dev mengembalikan HTML untuk path yang tidak ada). */
export async function glbExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    return res.ok && !type.includes('text/html');
  } catch {
    return false;
  }
}

/** Avatar dari file GLB: diskalakan ke tinggi standar, kaki di y=0, animasi di-crossfade dari playerState. */
export const GlbStudent: React.FC = () => {
  const { scene, animations } = useGLTF(AVATAR_GLB_URL);
  const group = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(animations, group);
  const mode = useRef<Mode | null>(null);

  const { scale, offsetY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const h = box.max.y - box.min.y || 1;
    const s = AVATAR_HEIGHT / h;
    return { scale: s, offsetY: -box.min.y * s };
  }, [scene]);

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  const find = (m: Mode) => names.find((n) => PATTERNS[m].test(n));

  useFrame(() => {
    const next: Mode = !playerState.moving ? 'idle' : playerState.running ? 'run' : 'walk';
    if (mode.current === next) return;
    const nextName = find(next) ?? (next === 'run' ? find('walk') : undefined) ?? names[0];
    if (!nextName) return;
    const nextAction = actions[nextName];
    const prevName = mode.current ? find(mode.current) ?? names[0] : undefined;
    if (prevName && actions[prevName] && actions[prevName] !== nextAction) actions[prevName]!.fadeOut(0.25);
    nextAction?.reset().fadeIn(0.25).play();
    mode.current = next;
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={scale} position={[0, offsetY, 0]} />
    </group>
  );
};
