'use client';

import { useEffect, useRef } from 'react';

export type Decoration = 'none' | 'snowfall' | 'fireworks' | 'autumn-leaves' | 'hearts';

// Corazón dibujado (no emoji) centrado ~ en el origen, para pintar con los colores
// de marca. `size` ≈ ancho del corazón.
function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(0, s * 0.05, -s, -s * 0.2, -s, s * 0.35);
  ctx.bezierCurveTo(-s, s * 0.75, -s * 0.4, s * 0.95, 0, s * 1.25);
  ctx.bezierCurveTo(s * 0.4, s * 0.95, s, s * 0.75, s, s * 0.35);
  ctx.bezierCurveTo(s, -s * 0.2, 0, s * 0.05, 0, s * 0.35);
  ctx.closePath();
}

// Hoja de otoño dibujada (no emoji), centrada ~ en el origen. Se pinta con relleno
// y una nervadura sutil. `size` ≈ alto de la hoja.
function drawLeaf(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.7, s * 0.5, 0, s);
  ctx.bezierCurveTo(-s * 0.7, s * 0.5, -s * 0.7, -s * 0.6, 0, -s);
  ctx.closePath();
}

function drawLeafVeins(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 2;
  ctx.strokeStyle = 'rgba(60,30,12,0.35)';
  ctx.lineWidth = Math.max(0.6, size * 0.035);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.9);
  ctx.lineTo(0, s * 0.85);
  ctx.moveTo(0, -s * 0.25);
  ctx.lineTo(s * 0.38, -s * 0.5);
  ctx.moveTo(0, s * 0.1);
  ctx.lineTo(-s * 0.38, -s * 0.1);
  ctx.stroke();
}

// Overlay decorativo de temporada. Un único canvas a pantalla completa,
// no interactivo (pointer-events:none) y por debajo de modales. Cada efecto es
// un sistema de partículas liviano en requestAnimationFrame. Respeta
// prefers-reduced-motion: si el usuario pide menos movimiento, no anima.
export function SeasonalDecorations({ decoration }: { decoration: Decoration }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (decoration === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    let raf = 0;

    // --- Emitters that fall/float continuously (snow, leaves, hearts) ---
    type Sprite = {
      x: number;
      y: number;
      vy: number;
      size: number;
      sway: number;
      swaySpeed: number;
      phase: number;
      rot: number;
      vrot: number;
      color: string;
      opacity: number;
    };

    // Paleta de marca BlissB + algunos rojos cálidos (minoría) para los corazones.
    const HEART_COLORS = ['#9B562C', '#C58B66', '#7A4522', '#9B562C', '#C58B66', '#B4472E', '#C0553B'];
    // Tonos de otoño (marca + rust + ámbar/calabaza) para las hojas.
    const LEAF_COLORS = ['#9B562C', '#C0553B', '#C58B66', '#B4472E', '#C87A2C', '#A85A28'];

    // Los corazones se sesgan hacia los bordes (menos densidad en el centro, donde
    // va el contenido del hero).
    const heartX = () => {
      const d = Math.sqrt(Math.random()); // 0=centro, 1=borde — sesgado a bordes
      const side = Math.random() < 0.62 ? -1 : 1; // un poco más hacia la izquierda
      return width / 2 + side * d * (width / 2);
    };

    const makeSprite = (fromTop: boolean, decoKind: Decoration): Sprite => {
      const isSnow = decoKind === 'snowfall';
      const isHeart = decoKind === 'hearts';
      const isLeaf = decoKind === 'autumn-leaves';
      return {
        x: isHeart ? heartX() : rand(0, width),
        y: fromTop ? rand(-height, 0) : rand(0, height),
        vy: isSnow ? rand(0.4, 1.4) : isHeart ? rand(0.2, 0.55) : isLeaf ? rand(0.4, 1.0) : rand(0.6, 1.6),
        size: isSnow ? rand(2, 4.5) : rand(16, 30),
        sway: rand(15, 45),
        swaySpeed: isHeart ? rand(0.25, 0.6) : isLeaf ? rand(0.3, 0.8) : rand(0.4, 1.2),
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        vrot: rand(-0.018, 0.018),
        color: isHeart
          ? HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]
          : isLeaf
            ? LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
            : '',
        opacity: isSnow ? rand(0.4, 0.9) : rand(0.8, 1),
      };
    };

    // --- Fireworks: periodic radial bursts with gravity + fade ---
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };
    const sparks: Spark[] = [];
    // 4 de julio — rojo / crema / azul (+ dorado cálido). Sin verde ni morado.
    const FIRE_COLORS = ['#D64545', '#F7F3EC', '#2B5DAA', '#C0553B', '#F0B44B', '#3D6FB5'];
    let nextBurst = 0;

    const burst = () => {
      const cx = rand(width * 0.15, width * 0.85);
      const cy = rand(height * 0.12, height * 0.5);
      const color = FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)];
      const count = Math.floor(rand(36, 60));
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.05, 0.05);
        const speed = rand(1.5, 4.2);
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: rand(50, 90),
          color,
        });
      }
    };

    // Seed continuous emitters
    const sprites: Sprite[] = [];
    if (decoration === 'snowfall' || decoration === 'autumn-leaves' || decoration === 'hearts') {
      const per = decoration === 'snowfall' ? 140 : decoration === 'hearts' ? 18 : 26;
      const minCount = decoration === 'hearts' ? 9 : 14;
      const count = Math.round((width / 1440) * per);
      for (let i = 0; i < Math.max(minCount, count); i++) sprites.push(makeSprite(false, decoration));
    }

    let t = 0;
    const step = () => {
      ctx.clearRect(0, 0, width, height);
      t += 1;

      if (decoration === 'snowfall') {
        ctx.fillStyle = '#ffffff';
        for (const s of sprites) {
          s.y += s.vy;
          s.phase += s.swaySpeed * 0.02;
          const x = s.x + Math.sin(s.phase) * s.sway;
          ctx.globalAlpha = s.opacity;
          ctx.beginPath();
          ctx.arc(x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          if (s.y - s.size > height) {
            s.y = -s.size;
            s.x = rand(0, width);
          }
        }
        ctx.globalAlpha = 1;
      } else if (decoration === 'hearts') {
        for (const s of sprites) {
          s.y -= s.vy; // flotan hacia arriba
          s.phase += s.swaySpeed * 0.02;
          const x = s.x + Math.sin(s.phase) * s.sway;
          const tilt = Math.sin(s.phase) * 0.3; // balanceo suave, no giro completo
          ctx.save();
          ctx.globalAlpha = s.opacity;
          ctx.translate(x, s.y);
          ctx.rotate(tilt);
          ctx.translate(0, -s.size * 0.3);
          ctx.fillStyle = s.color;
          drawHeart(ctx, s.size);
          ctx.fill();
          ctx.restore();
          if (s.y + s.size < 0) {
            s.y = height + s.size;
            s.x = heartX();
          }
        }
        ctx.globalAlpha = 1;
      } else if (decoration === 'autumn-leaves') {
        for (const s of sprites) {
          s.y += s.vy;
          s.phase += s.swaySpeed * 0.02;
          s.rot += s.vrot; // giro lento tipo hoja cayendo
          const x = s.x + Math.sin(s.phase) * s.sway;
          ctx.save();
          ctx.globalAlpha = s.opacity;
          ctx.translate(x, s.y);
          ctx.rotate(s.rot);
          ctx.fillStyle = s.color;
          drawLeaf(ctx, s.size);
          ctx.fill();
          drawLeafVeins(ctx, s.size);
          ctx.restore();
          if (s.y - s.size > height) {
            s.y = -s.size;
            s.x = rand(0, width);
          }
        }
        ctx.globalAlpha = 1;
      } else if (decoration === 'fireworks') {
        if (t >= nextBurst) {
          burst();
          nextBurst = t + Math.floor(rand(35, 75));
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.life += 1;
          p.vy += 0.04; // gravity
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          const k = 1 - p.life / p.maxLife;
          if (k <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = k;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [decoration]);

  if (decoration === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}
