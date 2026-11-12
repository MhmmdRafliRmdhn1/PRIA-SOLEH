import * as THREE from 'three';

/**
 * Procedural canvas-based texture generator for Indonesian cultural motifs and museum architectural materials.
 * Generates high-resolution textures purely locally in memory without external image dependencies.
 */

// Helper to create a canvas texture
function createCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    draw(ctx, width, height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;
  return texture;
}

// 1. Museum Red Carpet with Golden Border
export function createRedCarpetTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 1024, (ctx, w, h) => {
    // Rich royal crimson velvet base
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#5a0a14');
    grad.addColorStop(0.1, '#82101e');
    grad.addColorStop(0.5, '#991424');
    grad.addColorStop(0.9, '#82101e');
    grad.addColorStop(1, '#5a0a14');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle velvet fabric weave noise
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Outer and inner Gold Borders
    const goldGrad = ctx.createLinearGradient(0, 0, 0, h);
    goldGrad.addColorStop(0, '#d4af37');
    goldGrad.addColorStop(0.5, '#ffd700');
    goldGrad.addColorStop(1, '#aa8c2c');

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    // Left edge gold stripe
    ctx.beginPath();
    ctx.moveTo(24, 0);
    ctx.lineTo(24, h);
    ctx.stroke();

    // Secondary inner left gold stripe
    ctx.strokeStyle = '#f5d77f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(38, 0);
    ctx.lineTo(38, h);
    ctx.stroke();

    // Right edge gold stripe
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(w - 24, 0);
    ctx.lineTo(w - 24, h);
    ctx.stroke();

    // Secondary inner right gold stripe
    ctx.strokeStyle = '#f5d77f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w - 38, 0);
    ctx.lineTo(w - 38, h);
    ctx.stroke();

    // Traditional geometric floral meander along gold borders
    ctx.fillStyle = '#f5d77f';
    for (let y = 16; y < h; y += 32) {
      ctx.beginPath();
      ctx.arc(24, y, 4, 0, Math.PI * 2);
      ctx.arc(w - 24, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 1, 8);
}

// 2. Dark Museum Wall with Wainscoting & Subtle Gold Molding
export function createDarkWallTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Deep slate / charcoal museum wall
    ctx.fillStyle = '#14171f';
    ctx.fillRect(0, 0, w, h);

    // Subtle wall paneling (wainscot moldings)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    // Subtle stucco texture noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.fillRect(rx, ry, 2, 2);
    }
  }, 2, 2);
}

// 3. Dark Marble Floor Tile with Gold Inlay Grid
export function createMarbleFloorTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Dark polished granite/marble
    ctx.fillStyle = '#0e1017';
    ctx.fillRect(0, 0, w, h);

    // Marble vein lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.bezierCurveTo(150, 120, 280, 40, w, 200);
    ctx.bezierCurveTo(350, 320, 180, 400, 0, 480);
    ctx.stroke();

    // Tile border with gold brass inlay
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, w - 4, h - 4);
  }, 4, 4);
}

// 4. Batik Parang Rusak Motif Canvas Texture
export function createBatikParangTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Sogan background (warm creamy caramel)
    ctx.fillStyle = '#e8d2a6';
    ctx.fillRect(0, 0, w, h);

    // Diagonal parang stripes in deep brown (sogan matang)
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.translate(-w, -h);

    const stripeWidth = 50;
    for (let x = -w; x < w * 3; x += stripeWidth * 2) {
      // Dark sogan band
      ctx.fillStyle = '#3d1f0d';
      ctx.fillRect(x, -h, stripeWidth, h * 4);

      // Parang "lidah api" / waves along the edge
      ctx.fillStyle = '#e8d2a6';
      for (let y = -h; y < h * 4; y += 40) {
        ctx.beginPath();
        ctx.ellipse(x + 12, y, 14, 8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Mlinjon / diamond accent
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.moveTo(x + stripeWidth, y);
        ctx.lineTo(x + stripeWidth + 8, y + 10);
        ctx.lineTo(x + stripeWidth, y + 20);
        ctx.lineTo(x + stripeWidth - 8, y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#e8d2a6';
      }
    }
    ctx.restore();

    // Batik crackle / cecek texture
    ctx.fillStyle = 'rgba(61, 31, 13, 0.08)';
    for (let i = 0; i < 3000; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }
  }, 2, 2);
}

// 5. Songket Palembang Golden Supplementary Weft Texture
export function createSongketTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Rich burgundy red silk background
    ctx.fillStyle = '#670a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid of golden diamonds (Bintang Berantai & Pucuk Rebung)
    const size = 64;
    for (let x = 0; x <= w; x += size) {
      for (let y = 0; y <= h; y += size) {
        const cx = x + size / 2;
        const cy = y + size / 2;

        // Outer gold diamond
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 24);
        ctx.lineTo(cx + 24, cy);
        ctx.lineTo(cx, cy + 24);
        ctx.lineTo(cx - 24, cy);
        ctx.closePath();
        ctx.fill();

        // Inner burgundy center
        ctx.fillStyle = '#670a1a';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 12);
        ctx.lineTo(cx + 12, cy);
        ctx.lineTo(cx, cy + 12);
        ctx.lineTo(cx - 12, cy);
        ctx.closePath();
        ctx.fill();

        // Gleaming center gold stud
        ctx.fillStyle = '#fff099';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Horizontal golden thread sheen lines
    ctx.fillStyle = 'rgba(255, 215, 0, 0.12)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }
  }, 2, 2);
}

// 6. Tenun Ikat Sumba Figurative & Sacred Motif Texture
export function createTenunIkatSumbaTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Indigo and terracotta (kombu) alternating bands
    const bandHeight = 128;
    for (let y = 0; y < h; y += bandHeight) {
      ctx.fillStyle = (y / bandHeight) % 2 === 0 ? '#1b2838' : '#8a2b16';
      ctx.fillRect(0, y, w, bandHeight);
    }

    // Figurative ancestral horse / deer silhouettes in cream ikat
    ctx.fillStyle = '#e4d5b7';
    for (let x = 32; x < w; x += 128) {
      for (let y = 20; y < h; y += 128) {
        // Horse torso
        ctx.fillRect(x + 10, y + 40, 44, 20);
        // Horse neck & head
        ctx.fillRect(x + 40, y + 16, 14, 30);
        ctx.fillRect(x + 48, y + 14, 16, 12);
        // Legs
        ctx.fillRect(x + 14, y + 60, 6, 30);
        ctx.fillRect(x + 44, y + 60, 6, 30);
        // Tail
        ctx.fillRect(x + 4, y + 42, 6, 24);

        // Ancestral Andung (tree of life) branches between
        ctx.fillRect(x + 80, y + 16, 6, 80);
        ctx.fillRect(x + 68, y + 36, 30, 6);
        ctx.fillRect(x + 72, y + 56, 22, 6);
      }
    }

    // Ikat feathered edge effect
    ctx.fillStyle = 'rgba(27, 40, 56, 0.2)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 3);
    }
  }, 2, 2);
}

// 7. Batik Megamendung Cloud Motif Texture
export function createBatikMegamendungTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Deep midnight blue base
    ctx.fillStyle = '#081226';
    ctx.fillRect(0, 0, w, h);

    // Multi-tier cloud shapes with 5 gradient layers
    const cloudColors = ['#102a45', '#194b75', '#247ba0', '#56c2d6', '#f0f9ff'];

    const drawCloud = (cx: number, cy: number, scale: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      cloudColors.forEach((color, idx) => {
        ctx.fillStyle = color;
        const r = 40 - idx * 6;
        ctx.beginPath();
        // Stylized triangular undulating cloud shape
        ctx.moveTo(-r * 1.5, 0);
        ctx.bezierCurveTo(-r, -r, 0, -r * 1.4, r * 1.8, 0);
        ctx.bezierCurveTo(r * 0.8, r * 0.8, -r * 0.5, r * 0.6, -r * 1.5, 0);
        ctx.fill();
      });
      ctx.restore();
    };

    for (let x = 0; x < w + 80; x += 160) {
      for (let y = 0; y < h + 80; y += 120) {
        drawCloud(x, y, 1.2);
        drawCloud(x + 80, y + 60, 0.9);
      }
    }
  }, 2, 2);
}

// 8. Tenun Toraja Sa'dan Pa'teddong Geometric Texture
export function createTenunTorajaTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Torajan deep terracotta red
    ctx.fillStyle = '#7a1f1d';
    ctx.fillRect(0, 0, w, h);

    // Pa'teddong buffalo head horn geometry and diamond zigzags
    const size = 64;
    for (let x = 0; x <= w; x += size) {
      for (let y = 0; y <= h; y += size) {
        // Black outline
        ctx.strokeStyle = '#121212';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, size, size);

        // Golden yellow inner chevron (horn symbol)
        ctx.strokeStyle = '#f2a900';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 8);
        ctx.lineTo(x + size / 2, y + size - 8);
        ctx.lineTo(x + size - 8, y + 8);
        ctx.stroke();

        // White sacred eye dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, 2, 2);
}

// 9. Ornate Gold Molding & Frame Normal/Bump Texture
export function createGoldTrimTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#ffd700');
    grad.addColorStop(0.3, '#d4af37');
    grad.addColorStop(0.7, '#aa8c2c');
    grad.addColorStop(1, '#ffea75');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Filigree leaf etchings
    ctx.strokeStyle = '#8a6f1d';
    ctx.lineWidth = 3;
    for (let x = 20; x < w; x += 40) {
      ctx.beginPath();
      ctx.arc(x, h / 2, 14, 0, Math.PI);
      ctx.stroke();
    }
  });
}

