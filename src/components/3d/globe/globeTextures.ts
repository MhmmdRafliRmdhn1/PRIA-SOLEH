import * as THREE from 'three';
import { GEO, REGION, ISLAND_MASK_ORDER, type Ring } from '../../../data/geo';

/** Kode id pada kanal merah mask: id * MASK_STEP (id 1..5). Harus sama dengan shader. */
export const MASK_STEP = 40;

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext('2d')! };
}

function tracePath(ctx: CanvasRenderingContext2D, ring: Ring, tx: (lon: number) => number, ty: (lat: number) => number) {
  ctx.beginPath();
  for (let i = 0; i < ring.length; i += 2) {
    const x = tx(ring[i] / 100);
    const y = ty(ring[i + 1] / 100);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function finish(tex: THREE.CanvasTexture, nearest = false) {
  tex.colorSpace = THREE.NoColorSpace; // data, bukan warna
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  if (nearest) {
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
  } else {
    tex.anisotropy = 8;
  }
  tex.needsUpdate = true;
  return tex;
}

export interface GlobeTextures {
  world: THREE.CanvasTexture;
  region: THREE.CanvasTexture;
  mask: THREE.CanvasTexture;
}

/**
 * Membuat tiga tekstur globe dari data geo:
 *  - world:  daratan dunia kasar (equirectangular 360x180), kanal R
 *  - region: Asia Tenggara resolusi tinggi. R = daratan, G = wilayah Indonesia
 *  - mask:   id pulau (R = id * MASK_STEP) dengan filter nearest
 */
export function createGlobeTextures(): GlobeTextures {
  // dunia
  const W = 1024, H = 512;
  const w = makeCanvas(W, H);
  w.ctx.fillStyle = '#000';
  w.ctx.fillRect(0, 0, W, H);
  w.ctx.fillStyle = '#fff';
  for (const ring of GEO.world) {
    tracePath(w.ctx, ring, (lon) => ((lon + 180) / 360) * W, (lat) => ((90 - lat) / 180) * H);
    w.ctx.fill();
  }

  // region
  const RW = 2048;
  const RH = Math.round((RW * (REGION.lat1 - REGION.lat0)) / (REGION.lon1 - REGION.lon0));
  const tx = (lon: number) => ((lon - REGION.lon0) / (REGION.lon1 - REGION.lon0)) * RW;
  const ty = (lat: number) => ((REGION.lat1 - lat) / (REGION.lat1 - REGION.lat0)) * RH;

  const r = makeCanvas(RW, RH);
  r.ctx.fillStyle = '#000';
  r.ctx.fillRect(0, 0, RW, RH);
  r.ctx.fillStyle = 'rgb(255,0,0)';
  for (const ring of GEO.foreign) {
    tracePath(r.ctx, ring, tx, ty);
    r.ctx.fill();
  }
  r.ctx.fillStyle = 'rgb(255,255,0)';
  const indonesian = [...GEO.other, ...Object.values(GEO.islands).flat()];
  for (const ring of indonesian) {
    tracePath(r.ctx, ring, tx, ty);
    r.ctx.fill();
  }

  // mask pulau
  const m = makeCanvas(RW, RH);
  m.ctx.fillStyle = '#000';
  m.ctx.fillRect(0, 0, RW, RH);
  m.ctx.lineWidth = 1.6;
  m.ctx.lineJoin = 'round';
  ISLAND_MASK_ORDER.forEach((id, i) => {
    const code = (i + 1) * MASK_STEP;
    const col = `rgb(${code},0,0)`;
    m.ctx.fillStyle = col;
    m.ctx.strokeStyle = col;
    for (const ring of GEO.islands[id]) {
      tracePath(m.ctx, ring, tx, ty);
      m.ctx.fill();
      m.ctx.stroke();
    }
  });

  return {
    world: finish(new THREE.CanvasTexture(w.c)),
    region: finish(new THREE.CanvasTexture(r.c)),
    mask: finish(new THREE.CanvasTexture(m.c), true)
  };
}
