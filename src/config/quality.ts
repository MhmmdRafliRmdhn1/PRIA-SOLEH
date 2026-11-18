/** Profil kualitas rendering yang dipilih sekali saat start berdasarkan perangkat. */
const isTouch =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;

// Override manual: tambahkan ?quality=high atau ?quality=low pada URL.
const forced = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('quality') : null;
const low = forced === 'high' ? false : forced === 'low' ? true : isTouch || cores <= 4;

export const QUALITY = {
  /** Lantai memantulkan scene secara nyata (mahal) — dimatikan di perangkat lemah. */
  reflectiveFloor: !low,
  reflectorResolution: 512,
  dpr: (low ? [1, 1.5] : [1, 2]) as [number, number],
  shadowMapSize: low ? 1024 : 2048,
  particles: low ? 120 : 260,
  isLowEnd: low
};
