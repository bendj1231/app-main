import React, { useEffect, useRef } from 'react';

interface SkyCloudShaderProps {
    className?: string;
}

const hash = (x: number, y: number) => {
    const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return v - Math.floor(v);
};

const smoothNoise = (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const sx = x - x0;
    const sy = y - y0;

    const n00 = hash(x0, y0);
    const n10 = hash(x1, y0);
    const n01 = hash(x0, y1);
    const n11 = hash(x1, y1);

    const ix0 = n00 + (n10 - n00) * sx;
    const ix1 = n01 + (n11 - n01) * sx;
    return ix0 + (ix1 - ix0) * sy;
};

const fbm = (x: number, y: number, time: number) => {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;

    for (let i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(
            x * frequency + time * 0.08,
            y * frequency + time * 0.03
        );
        frequency *= 2;
        amplitude *= 0.5;
    }

    return value;
};

const smoothStep = (edge0: number, edge1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

type Cloud = {
    x: number;
    y: number;
    z: number;
    radius: number;
    drift: number;
    speed: number;
    alpha: number;
    phase: number;
};

export const SkyCloudShader: React.FC<SkyCloudShaderProps> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Sky gradient colors - enhanced
        const skyTopColor = { r: 70, g: 95, b: 125 };
        const skyHorizonColor = { r: 140, g: 160, b: 180 };
        const groundBottomColor = { r: 40, g: 35, b: 30 };
        const groundHorizonColor = { r: 140, g: 160, b: 180 };

        // Cloud particles - increased count for more detail
        const clouds: Cloud[] = Array.from({ length: 60 }).map(() => ({
            x: Math.random() * 2.0 - 1.0,
            y: Math.random() * 0.8 - 0.4,
            z: Math.random() * 1.5 + 0.5,
            radius: 80 + Math.random() * 250,
            drift: (Math.random() - 0.5) * 0.3,
            speed: 0.03 + Math.random() * 0.08,
            alpha: 0.4 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
        }));

        const noiseCanvas = document.createElement('canvas');
        const noiseCtx = noiseCanvas.getContext('2d');
        if (!noiseCtx) return;

        let frameCount = 0;
        let lastTimestamp = performance.now();
        let isRunning = true;

        const animate = (timestamp = performance.now()) => {
            if (!isRunning) return;

            const deltaMs = Math.max(0.1, timestamp - lastTimestamp);
            lastTimestamp = timestamp;
            const deltaFactor = Math.min(2, deltaMs / 16.67);

            timeRef.current += 0.015 * deltaFactor;
            frameCount += 1;

            // Draw sky gradient
            const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            skyGradient.addColorStop(0, `rgb(${skyTopColor.r}, ${skyTopColor.g}, ${skyTopColor.b})`);
            skyGradient.addColorStop(0.6, `rgb(${skyHorizonColor.r}, ${skyHorizonColor.g}, ${skyHorizonColor.b})`);
            skyGradient.addColorStop(1, `rgb(${skyHorizonColor.r}, ${skyHorizonColor.g}, ${skyHorizonColor.b})`);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Generate noise for clouds - enhanced detail
            if (frameCount % 2 === 0) {
                noiseCanvas.width = Math.max(250, Math.floor(canvas.width * 0.35));
                noiseCanvas.height = Math.max(180, Math.floor(canvas.height * 0.35));

                const texture = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
                const data = texture.data;

                for (let y = 0; y < noiseCanvas.height; y++) {
                    for (let x = 0; x < noiseCanvas.width; x++) {
                        const nx = x / noiseCanvas.width;
                        const ny = y / noiseCanvas.height;

                        const layerA = fbm(nx * 2.5, ny * 2.2, timeRef.current * 1.0);
                        const layerB = fbm(nx * 5.0 + 5.0, ny * 4.5 + 4.0, timeRef.current * 0.6);
                        const layerC = fbm(nx * 8.0 + 10.0, ny * 7.0 + 8.0, timeRef.current * 0.3);
                        const density = Math.max(0, Math.min(1, layerA * 0.5 + layerB * 0.35 + layerC * 0.15));
                        const cloud = smoothStep(0.25, 0.85, density);

                        const idx = (y * noiseCanvas.width + x) * 4;
                        data[idx] = 190 + cloud * 65;
                        data[idx + 1] = 205 + cloud * 50;
                        data[idx + 2] = 235 + cloud * 20;
                        data[idx + 3] = 120 + cloud * 135;
                    }
                }

                noiseCtx.putImageData(texture, 0, 0);
            }

            // Draw cloud layers with wind movement - enhanced
            const windOffset = timeRef.current * 30;
            const cloudLayers = [
                { scale: 1.4, alpha: 0.2, ox: windOffset * 0.6, oy: 0 },
                { scale: 1.8, alpha: 0.15, ox: -windOffset * 0.4, oy: 15 },
                { scale: 2.2, alpha: 0.1, ox: windOffset * 0.3, oy: -15 },
            ];

            // Comment out cloud layers to test if they're causing the overlay effect
            /*
            cloudLayers.forEach((layer) => {
                const w = canvas.width * layer.scale;
                const h = canvas.height * layer.scale;
                ctx.save();
                ctx.globalAlpha = layer.alpha;
                ctx.drawImage(
                    noiseCanvas,
                    canvas.width * 0.5 - w * 0.5 + layer.ox,
                    canvas.height * 0.3 - h * 0.5 + layer.oy,
                    w,
                    h
                );
                ctx.restore();
            });
            */

            // Draw individual cloud puffs - enhanced rendering
            clouds.forEach((cloud) => {
                cloud.phase += cloud.speed * 0.015;
                cloud.z -= cloud.speed * 0.002;
                if (cloud.z < 0.1) {
                    cloud.z = 1.5 + Math.random() * 1.0;
                    cloud.x += (Math.random() - 0.5) * 0.5;
                    cloud.y += (Math.random() - 0.5) * 0.3;
                    cloud.x = Math.max(-1.0, Math.min(1.0, cloud.x));
                    cloud.y = Math.max(-0.5, Math.min(0.5, cloud.y));
                }

                const travelX = cloud.x + Math.sin(cloud.phase) * 0.05 + cloud.drift * timeRef.current * 0.01;
                const travelY = cloud.y + Math.cos(cloud.phase * 0.7) * 0.03;
                const sx = canvas.width * 0.5 + (travelX / cloud.z) * canvas.width * 0.4;
                const sy = canvas.height * 0.4 + (travelY / cloud.z) * canvas.height * 0.3;
                const depth = Math.max(0, Math.min(1, 1.2 - cloud.z));
                const radius = (cloud.radius / cloud.z) * (0.8 + depth * 0.5);
                const alpha = cloud.alpha * depth;

                if (alpha <= 0.01) return;

                // Enhanced cloud puff with multiple gradient layers
                const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.3, `rgba(245, 250, 255, ${alpha * 0.8})`);
                gradient.addColorStop(0.6, `rgba(220, 235, 250, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(180, 210, 240, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Sun glow effect - enhanced
            const sunX = canvas.width * 0.7;
            const sunY = canvas.height * 0.2;
            const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 400);
            sunGradient.addColorStop(0, 'rgba(255, 250, 240, 0.4)');
            sunGradient.addColorStop(0.2, 'rgba(255, 240, 220, 0.25)');
            sunGradient.addColorStop(0.4, 'rgba(255, 220, 190, 0.12)');
            sunGradient.addColorStop(0.7, 'rgba(255, 200, 170, 0.05)');
            sunGradient.addColorStop(1, 'rgba(255, 200, 170, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground gradient (horizon to bottom) - simplified to remove overlay effect
            // Commented out to eliminate the overlay filter appearance
            /*
            const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.45, 0, canvas.height);
            groundGradient.addColorStop(0, `rgb(${groundHorizonColor.r}, ${groundHorizonColor.g}, ${groundHorizonColor.b})`);
            groundGradient.addColorStop(0.2, `rgb(${groundHorizonColor.r}, ${groundHorizonColor.g}, ${groundHorizonColor.b})`);
            groundGradient.addColorStop(1, `rgb(${groundBottomColor.r}, ${groundBottomColor.g}, ${groundBottomColor.b})`);
            ctx.fillStyle = groundGradient;
            ctx.fillRect(0, canvas.height * 0.45, canvas.width, canvas.height * 0.55);
            */

            // Atmospheric depth layer
            const depthLayer = ctx.createLinearGradient(0, 0, 0, canvas.height);
            depthLayer.addColorStop(0, 'rgba(100, 130, 160, 0.1)');
            depthLayer.addColorStop(0.5, 'rgba(80, 110, 140, 0.05)');
            depthLayer.addColorStop(1, 'rgba(60, 90, 120, 0.08)');
            ctx.fillStyle = depthLayer;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Vignette effect - enhanced
            const vignette = ctx.createRadialGradient(
                canvas.width * 0.5,
                canvas.height * 0.5,
                canvas.width * 0.15,
                canvas.width * 0.5,
                canvas.height * 0.5,
                canvas.width * 0.85
            );
            vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignette.addColorStop(0.6, 'rgba(0, 0, 0, 0.05)');
            vignette.addColorStop(1, 'rgba(20, 40, 70, 0.25)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationRef.current = requestAnimationFrame(animate);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isRunning = false;
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
                return;
            }

            isRunning = true;
            lastTimestamp = performance.now();
            animationRef.current = requestAnimationFrame(animate);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            isRunning = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
};
