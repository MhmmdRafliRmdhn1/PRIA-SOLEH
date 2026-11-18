/**
 * Konfigurasi avatar. Untuk mengganti dengan model GLB sendiri:
 *  1. Letakkan file di  public/models/telkom-student.glb
 *  2. (opsional) beri nama klip animasi mengandung "idle", "walk"/"jalan", "run"/"lari"
 *  Jika file tidak ada, avatar prosedural di bawah otomatis dipakai.
 */
export const AVATAR_GLB_URL = '/models/telkom-student.glb';

/** Tinggi target avatar (m). GLB akan diskalakan ke tinggi ini. */
export const AVATAR_HEIGHT = 1.72;

/** Warna almamater Telkom University: merah. Logo resmi TIDAK dibuat; lihat catatan patch dada. */
export const UNIFORM = {
  jacket: '#c4161c',
  jacketShade: '#a01015',
  trim: '#7d0b10',
  pants: '#15161a',
  shoe: '#f2f0ea',
  sole: '#2a2a2e',
  skin: '#d6a37c',
  hair: '#17110e'
} as const;

// Parameter fisika kapsul (sama seperti sebelumnya agar collision tetap konsisten)
export const HALF_H = 0.52;
export const RAD = 0.28;
export const SPAWN_Y = HALF_H + RAD + 0.08;
export const VIS_OFFSET_Y = -(SPAWN_Y - 0.05);

export const WALK_SPEED = 4.4;
export const RUN_SPEED = 8.2;
