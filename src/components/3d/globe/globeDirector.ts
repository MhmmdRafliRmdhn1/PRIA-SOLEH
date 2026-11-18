import * as THREE from 'three';
import { ZONES, ZONE_TRIGGER_RADIUS, GLOBE } from '../../../config/layout';
import { getIslandGeo } from '../../../data/geo';
import { ISLANDS } from '../../../data/islands';
import type { IslandId } from '../../../data/types';
import { playerState } from '../../../state/playerState';
import { clamp, lonLatToDirection, smoothstep } from '../../../utils/geoMath';

/**
 * Logika pengarah globe (tanpa React, dipanggil dari useFrame).
 * Memilih pulau tujuan dari POSISI avatar + ARAH geraknya, lalu menghitung kuaternion target
 * yang memutar pulau itu menghadap avatar. Perputaran diperhalus dengan percepatan terbatas
 * sehingga tidak pernah mendadak.
 */

const Y = new THREE.Vector3(0, 1, 0);
const MAX_SPEED = 1.05; // rad/s
const GAIN = 1.9;
const IDLE_SPIN = 0.13; // rad/s

const focusDir: Record<IslandId, THREE.Vector3> = Object.fromEntries(
  ZONES.map((z) => {
    const [lon, lat] = ISLANDS[z.id].focus ?? getIslandGeo(z.id).centroid;
    return [z.id, lonLatToDirection(lon, lat)];
  })
) as Record<IslandId, THREE.Vector3>;

export class GlobeDirector {
  current: IslandId | null = null;
  /** Hanya untuk debugging (mode dev): paksa pulau target. */
  forced: IslandId | null = null;
  private candidate: IslandId | null = null;
  private candTime = 0;
  private lowTime = 0;
  private idleYaw = 0;
  private angVel = 0;
  private readonly target = new THREE.Quaternion();
  private readonly qYaw = new THREE.Quaternion();
  private readonly q2 = new THREE.Quaternion();
  private readonly v1 = new THREE.Vector3();
  private readonly d = new THREE.Vector3();
  private readonly euler = new THREE.Euler();
  readonly scores: Record<IslandId, number> = { sumatera: 0, jawa: 0, kalimantan: 0, sulawesi: 0, papua: 0 };

  /** Skor tiap zona: kedekatan + keselarasan arah jalan + kunci saat berada di dalam zona. */
  private score(): { id: IslandId | null; value: number } {
    const p = playerState.position;
    const h = playerState.heading;
    const moveW = smoothstep(0.6, 2.4, playerState.speed);
    let best: IslandId | null = null;
    let bestV = 0;
    for (const z of ZONES) {
      const dx = z.position[0] - p.x;
      const dz = z.position[2] - p.z;
      const dist = Math.hypot(dx, dz) || 0.001;
      const prox = 1 / (1 + (dist / 12) ** 2);
      const align = Math.pow(Math.max(0, (dx * h.x + dz * h.z) / dist), 3);
      const inside = dist < ZONE_TRIGGER_RADIUS + 1.5 ? 1 : 0;
      const v = prox * 0.7 + align * moveW * 0.9 + inside * 2;
      this.scores[z.id] = v;
      if (v > bestV) {
        bestV = v;
        best = z.id;
      }
    }
    return { id: best, value: bestV };
  }

  /** Memperbarui target pulau (dengan histeresis). Mengembalikan true bila target berubah. */
  private choose(dt: number): boolean {
    if (this.forced) {
      const changed = this.current !== this.forced;
      this.current = this.forced;
      return changed;
    }
    const { id, value } = this.score();
    const before = this.current;
    const curScore = this.current ? this.scores[this.current] : 0;

    if (id && value > 0.45) {
      this.lowTime = 0;
      if (id !== this.current) {
        if (id === this.candidate) this.candTime += dt;
        else {
          this.candidate = id;
          this.candTime = 0;
        }
        if (this.candTime > 0.2 && (this.current === null || value > curScore + 0.12)) {
          this.current = id;
          this.candidate = null;
        }
      } else {
        this.candidate = null;
      }
    } else if (this.current) {
      this.lowTime += dt;
      if (this.lowTime > 0.7) this.current = null;
    }
    return before !== this.current;
  }

  update(rotor: THREE.Object3D, dt: number): boolean {
    const changed = this.choose(dt);
    if (changed && this.current === null) {
      // lanjutkan putaran idle dari sudut saat ini agar tidak melompat
      this.idleYaw = this.euler.setFromQuaternion(rotor.quaternion, 'YXZ').y;
    }

    if (this.current) {
      const p = playerState.position;
      this.d.set(p.x - GLOBE.position[0], 0, p.z - GLOBE.position[2]);
      const horiz = this.d.length();
      if (horiz < 0.5) this.d.set(Math.sin(playerState.cameraYaw), 0, Math.cos(playerState.cameraYaw));
      // elevasi lembut: avatar berada di bawah globe
      const elev = clamp(Math.atan2(p.y + 1.2 - GLOBE.position[1], Math.max(horiz, 1)), -0.3, 0.1);
      this.d.normalize();
      this.d.multiplyScalar(Math.cos(elev)).setY(Math.sin(elev));

      const v = focusDir[this.current];
      const a = Math.atan2(this.d.x, this.d.z) - Math.atan2(v.x, v.z) + 0.04 * Math.sin(performance.now() * 0.0006);
      this.qYaw.setFromAxisAngle(Y, a);
      this.v1.copy(v).applyAxisAngle(Y, a);
      this.q2.setFromUnitVectors(this.v1, this.d);
      this.target.copy(this.q2).multiply(this.qYaw);
    } else {
      this.idleYaw += IDLE_SPIN * dt;
      this.euler.set(0.22, this.idleYaw, 0, 'YXZ');
      this.target.setFromEuler(this.euler);
    }

    // gerak halus: kecepatan sudut dikejar secara eksponensial (ease-in & ease-out)
    const angle = rotor.quaternion.angleTo(this.target);
    const desired = this.current ? Math.min(MAX_SPEED, angle * GAIN) : Math.min(MAX_SPEED, angle * GAIN + IDLE_SPIN);
    this.angVel += (desired - this.angVel) * (1 - Math.exp(-5 * dt));
    rotor.quaternion.rotateTowards(this.target, Math.min(angle, this.angVel * dt));
    return changed;
  }
}
