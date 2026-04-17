"use client";

import React, { useEffect, useRef } from 'react';

interface ShaderCloudProps {
    className?: string;
    height?: string;
}

// Simple Perlin noise implementation
const noise = (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = (X + Y + Z) & 255;
    const B = (X + Y + Z + 1) & 255;
    const AA = (A + Y + Z) & 255;
    const AB = (A + Y + Z + 1) & 255;
    const BA = (B + Y + Z) & 255;
    const BB = (B + Y + Z + 1) & 255;
    
    return lerp(w, lerp(v, lerp(u, grad(AA, x, y, z), grad(BA, x - 1, y, z)),
        lerp(u, grad(AB, x, y - 1, z), grad(BB, x - 1, y - 1, z))),
        lerp(v, lerp(u, grad(AA + 1, x, y, z - 1), grad(BA + 1, x - 1, y, z - 1)),
        lerp(u, grad(AB + 1, x, y - 1, z - 1), grad(BB + 1, x - 1, y - 1, z - 1))));
};

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);
const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

export const ShaderCloud: React.FC<ShaderCloudProps> = ({ className = '', height = '100vh' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            timeRef.current += 0.005;

            // Draw light blue gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#e8f4fc');
            gradient.addColorStop(0.3, '#d4e9f7');
            gradient.addColorStop(0.6, '#c5dff0');
            gradient.addColorStop(1, '#b8d4ea');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create smoke layers using noise
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let y = 0; y < canvas.height; y += 4) {
                for (let x = 0; x < canvas.width; x += 4) {
                    // Multi-layered noise for smoke effect
                    const noise1 = noise(x * 0.003, y * 0.003, timeRef.current * 0.5);
                    const noise2 = noise(x * 0.006 + 100, y * 0.006 + 100, timeRef.current * 0.3);
                    const noise3 = noise(x * 0.012 + 200, y * 0.012 + 200, timeRef.current * 0.2);
                    
                    // Combine noise layers
                    const combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
                    
                    // Create smoke density
                    const smokeDensity = (combinedNoise + 1) / 2;
                    
                    // Apply smoke color
                    const r = 200 + smokeDensity * 30;
                    const g = 215 + smokeDensity * 25;
                    const b = 235 + smokeDensity * 20;
                    const alpha = smokeDensity * 0.4;

                    // Fill 4x4 block
                    for (let dy = 0; dy < 4; dy++) {
                        for (let dx = 0; dx < 4; dx++) {
                            const px = x + dx;
                            const py = y + dy;
                            if (px < canvas.width && py < canvas.height) {
                                const index = (py * canvas.width + px) * 4;
                                data[index] = r;
                                data[index + 1] = g;
                                data[index + 2] = b;
                                data[index + 3] = alpha * 255;
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Add smoke wisps with gradient
            for (let i = 0; i < 20; i++) {
                const x = (noise(i * 100, timeRef.current * 0.2, 0) + 1) / 2 * canvas.width;
                const y = (noise(i * 200, timeRef.current * 0.15, 100) + 1) / 2 * canvas.height;
                const radius = 150 + noise(i * 300, timeRef.current * 0.1, 200) * 100;
                const opacity = (noise(i * 400, timeRef.current * 0.25, 300) + 1) / 2 * 0.15;

                const smokeGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                smokeGradient.addColorStop(0, `rgba(220, 235, 250, ${opacity})`);
                smokeGradient.addColorStop(0.5, `rgba(200, 220, 240, ${opacity * 0.5})`);
                smokeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = smokeGradient;
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
        </div>
    );
};
