/** Profil kualitas rendering yang dipilih sekali saat start berdasarkan perangkat. */
const isTouch =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;

// Override manual: tambahkan ?quality=high atau ?quality=low pada URL.
const forced = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('quality') : null;
const low = forced === 'high' ? false : forced === 'low' ? true : isTouch || cores <= 4;

export const QUALITY = {
  /**
   * Lantai reflektif dimatikan sepenuhnya untuk mencegah glitch NaN/black pixels
   * yang disebabkan MeshReflectorMaterial depth-buffer race condition.
   * Efek kilauan tetap didapat dari MeshStandardMaterial envMapIntensity tinggi.
   */
  reflectiveFloor: false,
  reflectorResolution: 512,
  dpr: (low ? [1, 1.5] : [1, 2]) as [number, number],
  shadowMapSize: low ? 1024 : 2048,
  particles: low ? 120 : 260,
  isLowEnd: low
};
