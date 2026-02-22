"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
  color?: string;
}

export function AudioVisualizer({
  isActive,
  color = "#0e7490",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 24;
    const barWidth = 4;
    const gap = 3;
    const totalWidth = bars * (barWidth + gap) - gap;

    canvas.width = totalWidth;
    canvas.height = 60;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const height = isActive
          ? 8 + Math.random() * 44
          : 4 + Math.sin(Date.now() / 600 + i * 0.3) * 3;

        const x = i * (barWidth + gap);
        const y = (canvas.height - height) / 2;

        ctx.fillStyle = color;
        ctx.globalAlpha = isActive ? 0.8 : 0.25;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[168px] h-[60px]"
      style={{ imageRendering: "auto" }}
    />
  );
}
