import * as THREE from 'three';

/**
 * Tekstur prosedural untuk interior museum putih-emas.
 * Semua dibuat lokal di canvas sehingga tidak butuh aset eksternal.
 */

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  opts: { repeatX?: number; repeatY?: number; srgb?: boolean; anisotropy?: number } = {}
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(opts.repeatX ?? 1, opts.repeatY ?? 1);
  if (opts.srgb !== false) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = opts.anisotropy ?? 8;
  tex.needsUpdate = true;
  return tex;
}

/** Pseudo-random deterministik agar marmer konsisten antar sesi. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Marmer putih glossy dengan urat abu-hangat tipis dan hint emas. */
export function createWhiteMarbleTexture(): THREE.CanvasTexture {
  return canvasTexture(
    1024,
    1024,
    (ctx, w, h) => {
      const rand = mulberry32(42);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#fcfbf7');
      g.addColorStop(0.5, '#f6f3ea');
      g.addColorStop(1, '#fbf9f3');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // awan lembut
      for (let i = 0; i < 40; i++) {
        const x = rand() * w, y = rand() * h, r = 60 + rand() * 160;
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, `rgba(222, 214, 198, ${0.05 + rand() * 0.05})`);
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // urat marmer
      const vein = (color: string, width: number, count: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        for (let i = 0; i < count; i++) {
          let x = rand() * w, y = rand() * h;
          let a = rand() * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const steps = 18 + Math.floor(rand() * 18);
          for (let s = 0; s < steps; s++) {
            a += (rand() - 0.5) * 0.9;
            x += Math.cos(a) * (14 + rand() * 18);
            y += Math.sin(a) * (14 + rand() * 18);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      };
      vein('rgba(150, 142, 128, 0.16)', 1.2, 22);
      vein('rgba(190, 176, 150, 0.12)', 2.4, 10);
      vein('rgba(212, 168, 60, 0.10)', 1.0, 6);

      // tepi ubin tipis agar terbaca sebagai lantai marmer
      ctx.strokeStyle = 'rgba(190, 172, 130, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    },
    { repeatX: 9, repeatY: 9, anisotropy: 16 }
  );
}

/** Panel dinding putih satin dengan garis emas halus. */
export function createWallPanelTexture(): THREE.CanvasTexture {
  return canvasTexture(
    512,
    512,
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#fffdf8');
      g.addColorStop(1, '#f6f1e6');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // alur vertikal halus
      ctx.fillStyle = 'rgba(160, 140, 100, 0.10)';
      ctx.fillRect(0, 0, 3, h);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(3, 0, 2, h);
      // garis emas tipis di tengah panel
      ctx.fillStyle = 'rgba(217, 168, 42, 0.55)';
      ctx.fillRect(w / 2 - 1, 0, 2, h);
    },
    { repeatX: 30, repeatY: 1 }
  );
}

/** Papan nama zona pulau (transparan, teks emas). */
export function createNamePlateTexture(title: string, subtitle: string): THREE.CanvasTexture {
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    // kaca putih translusen
    const r = 48;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.fill();
    ctx.lineWidth = 6;
    const gg = ctx.createLinearGradient(0, 0, w, 0);
    gg.addColorStop(0, '#f7d56a');
    gg.addColorStop(0.5, '#c8921a');
    gg.addColorStop(1, '#f7d56a');
    ctx.strokeStyle = gg;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tg = ctx.createLinearGradient(0, 40, 0, 190);
    tg.addColorStop(0, '#e2b53a');
    tg.addColorStop(1, '#a8760b');
    ctx.fillStyle = tg;
    ctx.font = '700 110px Outfit, "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(title.toUpperCase(), w / 2, h * 0.42);
    ctx.fillStyle = '#6b5a35';
    ctx.font = '500 38px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(subtitle, w / 2, h * 0.8);
  };
  const tex = canvasTexture(1024, 300, draw, { anisotropy: 8 });
  // gambar ulang setelah font web selesai dimuat agar tipografi tepat
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      const c = tex.image as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (ctx) {
        draw(ctx, c.width, c.height);
        tex.needsUpdate = true;
      }
    });
  }
  return tex;
}
