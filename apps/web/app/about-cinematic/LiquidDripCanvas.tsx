'use client';

import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface Drop {
  x: number;
  y: number;
  vy: number;
  radius: number;
  alpha: number;
  targetY: number;
}

export default function LiquidDripCanvas({
  className = '',
  onDropSound,
}: {
  className?: string;
  onDropSound?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const ripples: Ripple[] = [];
    const drops: Drop[] = [];

    // Periodic automatic golden droplet drop
    let lastDropTime = Date.now();

    const spawnDrop = (customX?: number) => {
      const dropX = customX !== undefined ? customX : width * (0.3 + Math.random() * 0.4);
      drops.push({
        x: dropX,
        y: height * 0.1,
        vy: 2.5,
        radius: 3.5,
        alpha: 0.95,
        targetY: height * (0.65 + Math.random() * 0.15),
      });
    };

    const spawnRipple = (x: number, y: number) => {
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 160 + Math.random() * 80,
        alpha: 0.85,
        speed: 1.4,
      });
      ripples.push({
        x,
        y,
        radius: 1,
        maxRadius: 100,
        alpha: 0.6,
        speed: 0.9,
      });
      if (onDropSound) {
        onDropSound();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnRipple(x, y);
    };

    canvas.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Auto drop every ~3.5 seconds
      if (Date.now() - lastDropTime > 3400) {
        spawnDrop();
        lastDropTime = Date.now();
      }

      // Update and render falling droplets
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy;
        d.vy += 0.22; // gravity acceleration

        // Draw tear-shaped droplet
        ctx.save();
        ctx.fillStyle = 'rgba(255, 195, 45, 0.9)';
        ctx.shadowColor = '#ffb91d';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();

        // Droplet tail
        ctx.beginPath();
        ctx.moveTo(d.x - d.radius * 0.8, d.y);
        ctx.lineTo(d.x, d.y - d.radius * 2.2);
        ctx.lineTo(d.x + d.radius * 0.8, d.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if (d.y >= d.targetY) {
          spawnRipple(d.x, d.y);
          drops.splice(i, 1);
        }
      }

      // Update and render concentric liquid ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha *= 0.982; // smooth decay

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.42, 0, 0, Math.PI * 2); // 3D perspective angle
        ctx.strokeStyle = `rgba(255, 185, 29, ${Math.max(0, r.alpha)})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ffb91d';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, [onDropSound]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full cursor-pointer ${className}`}
      aria-label="Interactive molten resin surface - click to generate amber ripples"
    />
  );
}
