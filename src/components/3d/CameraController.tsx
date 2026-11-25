import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HALL, getZone } from '../../config/layout';
import { playerState, CAMERA_PITCH_MIN, CAMERA_PITCH_MAX } from '../../state/playerState';
import { museum } from '../../state/museumStore';

const _v = new THREE.Vector3();

/** Jarak dan offset kamera third-person default */
const CAM_DIST   = 5.2;   // jarak di belakang karakter (m)
const CAM_HEIGHT = 1.6;   // tinggi di atas kepala karakter (m)
const CAM_PITCH_DEFAULT = 0.22; // pitch default saat idle (rad)

/**
 * Normalises an angle to [-PI, PI].
 */
function wrapAngle(a: number): number {
  while (a >  Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

/**
 * Kamera third-person dengan auto-follow:
 * - Saat karakter bergerak, yaw kamera perlahan berputar mengikuti arah heading
 *   (smooth lerp — tidak tiba-tiba) agar karakter selalu terlihat di depan frame.
 * - Drag mouse / touch-rotate masih bisa override yaw secara manual kapan saja.
 * - Saat panel zona aktif, kamera cut ke framing khusus hologram pulau.
 */
export const CameraController: React.FC = () => {
  const { camera } = useThree();

  const smoothPos  = useRef(new THREE.Vector3(0, 3.2, 17.5));
  const smoothLook = useRef(new THREE.Vector3(0, 1.5,  8.0));
  const targetPos  = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  // Waktu (s) sejak karakter terakhir bergerak — dipakai untuk hyst­eresis auto-follow
  const idleTime = useRef(0);

  useEffect(() => {
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLook.current);
    if ('near' in camera) (camera as THREE.PerspectiveCamera).near = 0.5;
    if ('far'  in camera) (camera as THREE.PerspectiveCamera).far  = 140;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix?.();
  }, [camera]);

  useFrame((_, delta) => {
    const dt     = Math.min(delta, 0.05);
    const posAlpha  = 1 - Math.exp(-dt * 7);
    const lookAlpha = 1 - Math.exp(-dt * 10);
    const active = museum.getState().activeZone;

    /* ── Mode zona aktif: framing hologram ─────────────────── */
    if (active) {
      const z = getZone(active);
      const [zx, , zz] = z.position;
      const len = Math.hypot(zx, zz) || 1;
      const ix = -zx / len, iz = -zz / len;
      targetPos.current.set(zx + ix * 11.5, 5.0, zz + iz * 11.5);
      const dx = zx - targetPos.current.x, dz = zz - targetPos.current.z;
      const dl = Math.hypot(dx, dz) || 1;
      targetLook.current.set(zx + (-dz / dl) * 3.4, 3.7, zz + (dx / dl) * 3.4);

      smoothPos.current.lerp(targetPos.current, posAlpha);
      smoothLook.current.lerp(targetLook.current, lookAlpha);
      _applyToCamera(camera, smoothPos.current, smoothLook.current);
      return;
    }

    /* ── Mode normal: third-person auto-follow ──────────────── */
    const { x: ax, y: ay, z: az } = playerState.position;
    const moving = playerState.moving;
    const inpY = playerState.input.keyY + playerState.input.joyY;
    const movingBackward = inpY < -0.1;

    // ── Auto-rotate yaw ke arah heading saat bergerak ──────────
    // Jangan auto-follow saat mundur (S / joyY < -0.1) agar kamera tidak
    // memutar 180° dan bentrok dengan vektor gerak mundur (penyebab jitter).
    if (moving && !movingBackward) {
      idleTime.current = 0;
    } else {
      idleTime.current += dt;
    }

    const autoFollow = moving && !movingBackward;

    if (autoFollow) {
      const { x: hx, z: hz } = playerState.heading;
      if (isFinite(hx) && isFinite(hz)) {
        // Kamera harus berada di BELAKANG karakter, yaitu 180° dari arah heading.
        // heading = arah maju karakter, kamera yaw = heading + π
        const targetYaw = Math.atan2(hx, hz) + Math.PI;
        const diff = wrapAngle(targetYaw - playerState.cameraYaw);
        // Kecepatan auto-follow: lambat jalan kaki, makin cepat saat running
        const followSpeed = playerState.running ? 3.5 : 2.2;
        playerState.cameraYaw = wrapAngle(
          playerState.cameraYaw + diff * (1 - Math.exp(-dt * followSpeed))
        );
      }
    }

    // ── Hitung posisi kamera di belakang karakter ──────────────
    const pitch = Math.max(CAMERA_PITCH_MIN, Math.min(CAMERA_PITCH_MAX,
      playerState.cameraPitch !== undefined ? playerState.cameraPitch : CAM_PITCH_DEFAULT
    ));
    const cosP = Math.cos(pitch);
    let tx = ax + Math.sin(playerState.cameraYaw) * cosP * CAM_DIST;
    let tz = az + Math.cos(playerState.cameraYaw) * cosP * CAM_DIST;
    let ty = ay + Math.sin(pitch) * CAM_DIST + CAM_HEIGHT;

    // Guard NaN
    if (!isFinite(tx) || !isFinite(ty) || !isFinite(tz)) {
      tx = smoothPos.current.x;
      ty = smoothPos.current.y;
      tz = smoothPos.current.z;
    }

    // Batas dinding aula
    const maxR = HALL.radius - 1.6;
    const r = Math.hypot(tx, tz);
    if (r > maxR) { tx *= maxR / r; tz *= maxR / r; }
    ty = Math.max(1.0, Math.min(10, ty));

    targetPos.current.set(tx, ty, tz);
    // lookAt: sedikit di atas kepala karakter supaya area depan juga terlihat
    targetLook.current.set(ax, ay + 0.95 + Math.max(0, -pitch) * 2.0, az);

    smoothPos.current.lerp(targetPos.current, posAlpha);
    smoothLook.current.lerp(targetLook.current, lookAlpha);
    _applyToCamera(camera, smoothPos.current, smoothLook.current);
  });

  return null;
};

/** Terapkan posisi + lookAt ke kamera dengan guard NaN. */
function _applyToCamera(
  camera: THREE.Camera,
  pos: THREE.Vector3,
  look: THREE.Vector3
): void {
  if (isFinite(pos.x) && isFinite(pos.y) && isFinite(pos.z)) {
    camera.position.copy(pos);
  }
  if (isFinite(look.x) && isFinite(look.y) && isFinite(look.z)) {
    camera.lookAt(look);
  }
}
