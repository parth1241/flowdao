"use client";

import { useEffect, useRef, useState } from "react";

export function Confetti({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger === 0 || !canvasRef.current) return;
    
    setActive(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const colors = ["#0ea5e9", "#6366f1", "#8b5cf6", "#d946ef", "#06b6d4"];
    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      color: string;
      tilt: number;
      tiltAngle: number;
      tiltAngleInc: number;
    }[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: width / 2,
        y: height / 2 + (Math.random() * 200 - 100),
        r: Math.random() * 6 + 2,
        dx: Math.random() * 20 - 10,
        dy: Math.random() * -15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.07) + 0.05
      });
    }

    let animationFrame: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle) * 2;
        p.dy += 0.05; // gravity
        p.y += p.dy;
        p.x += p.dx;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        if (p.y > height) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0 && frame < 300) {
        animationFrame = requestAnimationFrame(render);
      } else {
        setActive(false);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [trigger]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
