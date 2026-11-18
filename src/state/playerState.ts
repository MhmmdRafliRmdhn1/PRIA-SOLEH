/**
 * State pemain yang bersifat mutable & non-reaktif.
 * Dibaca setiap frame oleh Avatar, Kamera, Globe, dan Minimap tanpa memicu render ulang React.
 */
export const playerState = {
  position: { x: 0, y: 0.88, z: 13 },
  /** Kecepatan horizontal (m/s). */
  velocity: { x: 0, z: 0 },
  /** Arah gerak terakhir (vektor satuan di bidang XZ). */
  heading: { x: 0, z: -1 },
  speed: 0,
  moving: false,
  running: false,
  cameraYaw: 0,
  cameraPitch: 0.16,
  input: {
    keyX: 0,
    keyY: 0,
    joyX: 0,
    joyY: 0,
    run: false
  }
};

export const CAMERA_PITCH_MIN = -0.32;
export const CAMERA_PITCH_MAX = 1.15;

export const rotateCamera = (deltaYaw: number, deltaPitch: number) => {
  playerState.cameraYaw += deltaYaw;
  playerState.cameraPitch = Math.max(
    CAMERA_PITCH_MIN,
    Math.min(CAMERA_PITCH_MAX, playerState.cameraPitch + deltaPitch)
  );
};
