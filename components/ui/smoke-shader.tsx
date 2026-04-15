import React, { useEffect, useRef } from 'react';

interface SmokeShaderProps {
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

type Plume = {
    x: number;
    y: number;
    z: number;
    radius: number;
    drift: number;
    speed: number;
    alpha: number;
    phase: number;
    tone: number;
    age: number;
};

type AiryStream = {
    x: number;
    y: number;
    speed: number;
    phase: number;
    length: number;
    thickness: number;
};

const drawCloudLobe = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rx: number,
    ry: number,
    c0: string,
    c1: string,
    c2: string
) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, c0);
    g.addColorStop(0.5, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};

export const SmokeShader: React.FC<SmokeShaderProps> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
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

        const noiseCanvas = document.createElement('canvas');
        const noiseCtx = noiseCanvas.getContext('2d');
        if (!noiseCtx) return;

        const plumes: Plume[] = Array.from({ length: 58 }).map(() => ({
            x: Math.random() * 2.8 - 1.4,
            y: Math.random() * 2.0 - 1.0,
            z: Math.random() * 2.2 + 1.0,
            radius: 170 + Math.random() * 280,
            drift: (Math.random() - 0.5) * 0.4,
            speed: 0.09 + Math.random() * 0.13,
            alpha: 0.11 + Math.random() * 0.16,
            phase: Math.random() * Math.PI * 2,
            tone: Math.random(),
            age: Math.random(),
        }));

        const airyStreams: AiryStream[] = Array.from({ length: 10 }).map(() => ({
            x: Math.random() * canvas.width,
            y: canvas.height * (0.28 + Math.random() * 0.34),
            speed: 18 + Math.random() * 24,
            phase: Math.random() * Math.PI * 2,
            length: 140 + Math.random() * 210,
            thickness: 8 + Math.random() * 16,
        }));

        const nearPlumes: Plume[] = Array.from({ length: 14 }).map(() => ({
            x: Math.random() * 1.8 - 0.9,
            y: Math.pow(Math.random(), 1.2) * 1.9 - 0.95,
            z: Math.random() * 0.7 + 0.45,
            radius: 170 + Math.random() * 300,
            drift: (Math.random() - 0.5) * 0.35,
            speed: 0.24 + Math.random() * 0.26,
            alpha: 0.18 + Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2,
            tone: Math.random(),
            age: Math.random(),
        }));

        let frameCount = 0;
        let lastTimestamp = performance.now();
        let noiseUpdateInterval = 2;
        let isRunning = true;

        const animate = (timestamp = performance.now()) => {
            if (!isRunning) return;

            const deltaMs = Math.max(0.1, timestamp - lastTimestamp);
            lastTimestamp = timestamp;
            const deltaFactor = Math.min(2, deltaMs / 16.67);

            timeRef.current += 0.02 * deltaFactor;
            frameCount += 1;
            const cx = canvas.width * 0.5;
            const cy = canvas.height * 0.58;
            const camX = cx + Math.sin(timeRef.current * 0.18) * canvas.width * 0.035;
            const camY = cy + Math.cos(timeRef.current * 0.14) * canvas.height * 0.022;

            // Scene cycle: Scene 1 (dense IFR) -> Scene 2 (above-cloud sea) -> back
            const sceneCycleSeconds = 78;
            const scenePhase = (timeRef.current % sceneCycleSeconds) / sceneCycleSeconds;
            let scene2Blend = 0;
            if (scenePhase >= 0.45 && scenePhase < 0.55) {
                scene2Blend = smoothStep(0.45, 0.55, scenePhase);
            } else if (scenePhase >= 0.55 && scenePhase < 0.92) {
                scene2Blend = 1;
            } else if (scenePhase >= 0.92) {
                scene2Blend = 1 - smoothStep(0.92, 1.0, scenePhase);
            }

            // IFR atmosphere: darker sky for better contrast with smooth gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#2a3f5a');
            gradient.addColorStop(0.2, '#344b6b');
            gradient.addColorStop(0.4, '#3f5f82');
            gradient.addColorStop(0.6, '#4f7a99');
            gradient.addColorStop(0.8, '#5f88ad');
            gradient.addColorStop(1, '#7aa3c4');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Scene 2 sky tint overlay (above cloud deck)
            if (scene2Blend > 0) {
                const sky2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
                sky2.addColorStop(0, '#7aa7c8');
                sky2.addColorStop(0.38, '#a9d1ea');
                sky2.addColorStop(0.72, '#c9e5f5');
                sky2.addColorStop(1, '#e5f3fb');
                ctx.save();
                ctx.globalAlpha = scene2Blend * 0.5;
                ctx.fillStyle = sky2;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }

            // Low-res turbulence map for realistic smoke texture
            if (deltaMs > 18) {
                noiseUpdateInterval = 3;
            } else if (deltaMs < 14) {
                noiseUpdateInterval = 2;
            }

            if (frameCount % noiseUpdateInterval === 0) {
                noiseCanvas.width = Math.max(160, Math.floor(canvas.width * 0.24));
                noiseCanvas.height = Math.max(110, Math.floor(canvas.height * 0.24));

                const texture = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
                const data = texture.data;

                for (let y = 0; y < noiseCanvas.height; y++) {
                    for (let x = 0; x < noiseCanvas.width; x++) {
                        const nx = x / noiseCanvas.width;
                        const ny = y / noiseCanvas.height;

                        const layerA = fbm(nx * 1.6, ny * 1.45, timeRef.current * 0.9);
                        const layerB = fbm(nx * 3.4 + 3.7, ny * 2.9 + 2.4, timeRef.current * 0.62);
                        const layerC = fbm(nx * 5.8 + 8.1, ny * 4.8 + 5.8, timeRef.current * 0.4);
                        const density = Math.max(0, Math.min(1, layerA * 0.54 + layerB * 0.31 + layerC * 0.15));
                        const billow = smoothStep(0.32, 0.82, density);
                        const mist = smoothStep(0.14, 0.55, density) * 0.42;
                        const formation = Math.max(0, Math.min(1, billow * 0.86 + mist * 0.14));
                        const shadowBand = smoothStep(0.46, 0.9, density) * (0.42 + ny * 0.48);
                        const overcastBias = 0.18 + (1 - Math.abs(ny - 0.5) * 1.25) * 0.14;

                        const idx = (y * noiseCanvas.width + x) * 4;
                        data[idx] = 138 + formation * 82 - shadowBand * 22;
                        data[idx + 1] = 148 + formation * 58 - shadowBand * 18;
                        data[idx + 2] = 208 + formation * 76 - shadowBand * 12;
                        data[idx + 3] = 62 + formation * 138 + overcastBias * 42;
                    }
                }

                noiseCtx.putImageData(texture, 0, 0);
            }

            // Multi-depth turbulence layers for travel motion
            const turbulenceLayers = [
                { scale: 1.1, alpha: 0.13, blur: 16, ox: timeRef.current * 12, oy: timeRef.current * 6 },
                { scale: 1.32, alpha: 0.09, blur: 26, ox: -timeRef.current * 28, oy: timeRef.current * 12 },
                { scale: 1.56, alpha: 0.06, blur: 36, ox: timeRef.current * 38, oy: -timeRef.current * 16 },
            ];

            turbulenceLayers.forEach((layer) => {
                const w = canvas.width * layer.scale;
                const h = canvas.height * layer.scale;
                ctx.save();
                ctx.globalAlpha = layer.alpha * (1 - scene2Blend * 0.42);
                ctx.filter = `blur(${layer.blur}px)`;
                ctx.drawImage(
                    noiseCanvas,
                    camX - w * 0.5 + layer.ox,
                    camY - h * 0.5 + layer.oy,
                    w,
                    h
                );
                ctx.restore();
            });

            // Far-field depth without radial rings
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.filter = 'blur(28px)';
            const farW1 = canvas.width * 1.82;
            const farH1 = canvas.height * 1.58;
            const farW2 = canvas.width * 2.08;
            const farH2 = canvas.height * 1.86;

            ctx.globalAlpha = 0.11;
            ctx.drawImage(
                noiseCanvas,
                camX - farW1 * 0.5 + Math.sin(timeRef.current * 0.12) * 120,
                camY - farH1 * 0.5 - Math.cos(timeRef.current * 0.09) * 96,
                farW1,
                farH1
            );

            ctx.globalAlpha = 0.08;
            ctx.drawImage(
                noiseCanvas,
                camX - farW2 * 0.5 - Math.cos(timeRef.current * 0.1) * 160,
                camY - farH2 * 0.5 + Math.sin(timeRef.current * 0.08) * 118,
                farW2,
                farH2
            );
            ctx.restore();

            // Dark cloud masses (multiply) for depth
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.filter = 'blur(9px)';
            const darknessPulse = 0.32 + (Math.sin(timeRef.current * 0.22) + 1) * 0.08;
            ctx.globalAlpha = darknessPulse * (1 - scene2Blend * 0.7);

            plumes.forEach((plume) => {
                plume.phase += plume.speed * 0.03;
                plume.z -= plume.speed * 0.006;
                plume.age = Math.min(1, plume.age + 0.008 * deltaFactor);
                if (plume.z < 0.08) {
                    plume.z = 2.8 + Math.random() * 1.8;
                    plume.x += (Math.random() - 0.5) * 0.9;
                    plume.y += (Math.random() - 0.5) * 0.6;
                    plume.x = Math.max(-1.3, Math.min(1.3, plume.x));
                    plume.y = Math.max(-1.0, Math.min(1.0, plume.y));
                    plume.radius = 120 + Math.random() * 240;
                    plume.tone = Math.random();
                    plume.age = 0;
                }

                const travelX = plume.x + Math.sin(plume.phase) * 0.05 + plume.drift * timeRef.current * 0.02;
                const travelY = plume.y + Math.cos(plume.phase * 0.7) * 0.04;
                const sx = camX + (travelX / plume.z) * canvas.width * 0.42;
                const sy = camY + (travelY / plume.z) * canvas.height * 0.3;

                const depth = Math.max(0, Math.min(1, 1.45 - plume.z));
                const evolution = 0.5 + 0.5 * Math.sin(timeRef.current * 0.22 + plume.phase * 0.7 + plume.tone * 6.28);
                const cumulate = smoothStep(0.44, 1, evolution);
                const dissipate = 1 - cumulate;
                const lateral = Math.abs((sx - camX) / (canvas.width * 0.5));
                const edgeBias = smoothStep(0.18, 0.88, lateral);
                const sideCumulate = 0.5 + (cumulate - 0.5) * edgeBias;
                const sideDissipate = 1 - sideCumulate;
                const radius = (plume.radius / plume.z) * (1.02 + depth * 0.56) * (0.94 + sideCumulate * 0.2 - sideDissipate * 0.06);
                const ageFade = smoothStep(0.06, 0.4, plume.age);
                const alpha = plume.alpha * depth * (plume.tone < 0.7 ? 0.74 : 0.44) * ageFade * (0.86 + sideCumulate * 0.28 - sideDissipate * 0.14);

                if (alpha <= 0.01) return;

                const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
                g.addColorStop(0, `rgba(24, 34, 56, ${alpha})`);
                g.addColorStop(0.45, `rgba(34, 49, 78, ${alpha * 0.76})`);
                g.addColorStop(1, 'rgba(58, 84, 128, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Near-field cloud volumes for strong travel-through feeling
            nearPlumes.forEach((plume) => {
                plume.phase += plume.speed * 0.05;
                plume.z -= plume.speed * 0.013;
                plume.age = Math.min(1, plume.age + 0.012 * deltaFactor);
                if (plume.z < 0.06) {
                    plume.z = 1.1 + Math.random() * 0.9;
                    plume.x += (Math.random() - 0.5) * 0.7;
                    plume.y += (Math.random() - 0.5) * 0.55;
                    plume.x = Math.max(-0.95, Math.min(0.95, plume.x));
                    plume.y = Math.max(-0.95, Math.min(0.95, plume.y));
                    plume.radius = 170 + Math.random() * 300;
                    plume.tone = Math.random();
                    plume.age = 0;
                }

                const clustered = plume.tone > 0.58;
                const wobbleBase = clustered ? 0.008 : 0.012;
                const wobble = (wobbleBase + plume.tone * 0.008) * (0.38 + plume.z * 0.45);
                const travelX = plume.x + Math.sin(plume.phase * 0.82) * wobble + plume.drift * timeRef.current * 0.022;
                const travelY = plume.y + Math.cos(plume.phase * 0.68) * (wobble * 0.72);
                const sx = camX + (travelX / plume.z) * canvas.width * 0.5;
                const sy = camY + (travelY / plume.z) * canvas.height * 0.36;
                const depth = Math.max(0, Math.min(1, 1.65 - plume.z));
                const evolution = 0.5 + 0.5 * Math.sin(timeRef.current * 0.3 + plume.phase * 0.9 + plume.tone * 7.1);
                const cumulate = smoothStep(0.42, 1, evolution);
                const dissipate = 1 - cumulate;
                const lateral = Math.abs((sx - camX) / (canvas.width * 0.5));
                const edgeBias = smoothStep(0.14, 0.84, lateral);
                const sideCumulate = 0.5 + (cumulate - 0.5) * edgeBias;
                const sideDissipate = 1 - sideCumulate;
                const radius = (plume.radius / plume.z) * (1.02 + depth * 0.78) * (0.9 + sideCumulate * 0.38 - sideDissipate * 0.1);
                const ageFade = smoothStep(0.02, 0.26, plume.age);
                const depthCore = smoothStep(0.18, 0.95, depth);
                const alpha = plume.alpha * depth * (0.9 + plume.tone * 0.4) * ageFade * (0.9 + depthCore * 0.25) * (0.82 + sideCumulate * 0.46 - sideDissipate * 0.2);
                if (alpha <= 0.01) return;

                const lobeScale = radius * 0.34;
                const puffs = [
                    { ox: 0, oy: 0, rx: radius * 1.0, ry: radius * 0.78 },
                    { ox: -lobeScale * 0.84, oy: -lobeScale * 0.14, rx: radius * 0.78, ry: radius * 0.58 },
                    { ox: lobeScale * 0.76, oy: -lobeScale * 0.18, rx: radius * 0.72, ry: radius * 0.56 },
                    { ox: -lobeScale * 0.18, oy: -lobeScale * 0.34, rx: radius * 0.58, ry: radius * 0.42 },
                ];

                puffs.forEach((puff, idx) => {
                    const puffAlpha = alpha * (idx === 0 ? 1 : 0.82);
                    drawCloudLobe(
                        ctx,
                        sx + puff.ox,
                        sy + puff.oy,
                        puff.rx,
                        puff.ry,
                        `rgba(24, 34, 56, ${puffAlpha})`,
                        `rgba(34, 49, 78, ${puffAlpha * 0.68})`,
                        'rgba(58, 84, 128, 0)'
                    );
                });

                const coreAlpha = alpha * (clustered ? 0.34 : 0.22) * (0.88 + sideCumulate * 0.3 - sideDissipate * 0.15);
                drawCloudLobe(
                    ctx,
                    sx,
                    sy - radius * 0.06,
                    radius * 0.62,
                    radius * 0.42,
                    `rgba(16, 27, 45, ${coreAlpha})`,
                    `rgba(28, 40, 63, ${coreAlpha * 0.66})`,
                    'rgba(28, 40, 63, 0)'
                );

                // Clustered clouds get darker internal wisp detail for volume depth
                if (clustered) {
                    const wispSeed = plume.phase * 1.7;
                    const wisps = [
                        {
                            ox: Math.sin(wispSeed) * radius * 0.24,
                            oy: -radius * 0.14 + Math.cos(wispSeed * 0.7) * radius * 0.06,
                            rx: radius * 0.44,
                            ry: radius * 0.18,
                            a: alpha * 0.36,
                        },
                        {
                            ox: -Math.cos(wispSeed * 0.8) * radius * 0.2,
                            oy: radius * 0.02 + Math.sin(wispSeed * 0.9) * radius * 0.05,
                            rx: radius * 0.38,
                            ry: radius * 0.16,
                            a: alpha * 0.31,
                        },
                        {
                            ox: Math.sin(wispSeed * 0.6) * radius * 0.12,
                            oy: radius * 0.18,
                            rx: radius * 0.34,
                            ry: radius * 0.14,
                            a: alpha * 0.27,
                        },
                    ];

                    wisps.forEach((w) => {
                        drawCloudLobe(
                            ctx,
                            sx + w.ox,
                            sy + w.oy,
                            w.rx,
                            w.ry,
                            `rgba(16, 26, 44, ${w.a})`,
                            `rgba(28, 40, 65, ${w.a * 0.66})`,
                            'rgba(28, 40, 65, 0)'
                        );
                    });
                }
            });

            nearPlumes.forEach((plume) => {
                const wobble = (0.01 + plume.tone * 0.009) * (0.42 + plume.z * 0.45);
                const travelX = plume.x + Math.sin(plume.phase * 1.05) * wobble;
                const travelY = plume.y + Math.cos(plume.phase * 0.84) * (wobble * 0.7);
                const sx = camX + (travelX / plume.z) * canvas.width * 0.5;
                const sy = camY + (travelY / plume.z) * canvas.height * 0.36;
                const depth = Math.max(0, Math.min(1, 1.7 - plume.z));
                const radius = (plume.radius / plume.z) * (0.78 + depth * 0.4);
                const evolution = 0.5 + 0.5 * Math.sin(timeRef.current * 0.34 + plume.phase * 1.1 + plume.tone * 6.5);
                const cumulate = smoothStep(0.45, 1, evolution);
                const dissipate = 1 - cumulate;
                const lateral = Math.abs((sx - camX) / (canvas.width * 0.5));
                const edgeBias = smoothStep(0.16, 0.86, lateral);
                const sideCumulate = 0.5 + (cumulate - 0.5) * edgeBias;
                const sideDissipate = 1 - sideCumulate;
                const alpha = plume.alpha * depth * (0.14 + plume.tone * 0.22) * (0.78 + sideCumulate * 0.42 - sideDissipate * 0.18);
                if (alpha <= 0.01) return;

                const lobeScale = radius * 0.3;
                const highlights = [
                    { ox: 0, oy: -lobeScale * 0.08, rx: radius * 0.86, ry: radius * 0.58 },
                    { ox: -lobeScale * 0.7, oy: -lobeScale * 0.24, rx: radius * 0.58, ry: radius * 0.4 },
                    { ox: lobeScale * 0.62, oy: -lobeScale * 0.2, rx: radius * 0.52, ry: radius * 0.36 },
                ];

                highlights.forEach((puff, idx) => {
                    const puffAlpha = alpha * (idx === 0 ? 1 : 0.78);
                    drawCloudLobe(
                        ctx,
                        sx + puff.ox,
                        sy + puff.oy,
                        puff.rx,
                        puff.ry,
                        `rgba(240, 247, 253, ${puffAlpha})`,
                        `rgba(198, 218, 236, ${puffAlpha * 0.52})`,
                        'rgba(150, 184, 216, 0)'
                    );
                });
            });

            // Scene 2: sea-of-clouds deck + airy penetration streaks
            if (scene2Blend > 0) {
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = 0.28 * scene2Blend;
                ctx.filter = 'blur(14px)';
                const seaW = canvas.width * 2.1;
                const seaH = canvas.height * 1.05;
                const seaY = canvas.height * 0.62 + Math.sin(timeRef.current * 0.12) * 18;
                ctx.drawImage(
                    noiseCanvas,
                    camX - seaW * 0.5 + Math.sin(timeRef.current * 0.18) * 90,
                    seaY - seaH * 0.5,
                    seaW,
                    seaH
                );
                ctx.restore();

                // Add denser cloud-top relief so scene 2 feels like a solid sea of clouds
                ctx.save();
                ctx.globalCompositeOperation = 'multiply';
                ctx.globalAlpha = 0.14 * scene2Blend;
                ctx.filter = 'blur(10px)';
                const reliefW = canvas.width * 1.9;
                const reliefH = canvas.height * 0.9;
                ctx.drawImage(
                    noiseCanvas,
                    camX - reliefW * 0.5 - Math.cos(timeRef.current * 0.22) * 70,
                    seaY - reliefH * 0.48,
                    reliefW,
                    reliefH
                );
                ctx.restore();

                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                airyStreams.forEach((stream) => {
                    stream.phase += 0.012 * deltaFactor;
                    stream.x += stream.speed * 0.016 * deltaFactor;
                    if (stream.x > canvas.width + stream.length) {
                        stream.x = -stream.length;
                        stream.y = canvas.height * (0.26 + Math.random() * 0.38);
                    }

                    const sx = stream.x + Math.sin(stream.phase) * 24;
                    const sy = stream.y + Math.cos(stream.phase * 0.8) * 10;
                    drawCloudLobe(
                        ctx,
                        sx,
                        sy,
                        stream.length,
                        stream.thickness,
                        `rgba(244, 251, 255, ${0.032 * scene2Blend})`,
                        `rgba(220, 239, 250, ${0.02 * scene2Blend})`,
                        'rgba(220, 239, 250, 0)'
                    );
                });
                ctx.restore();
            }

            ctx.restore();

            // Removed directional shear pass to avoid filter-like artifacts

            // Light cloud edges/highlights (screen) to feel like moving through gaps
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.filter = 'blur(6px)';

            plumes.forEach((plume) => {
                const travelX = plume.x + Math.sin(plume.phase * 1.2) * 0.06;
                const travelY = plume.y + Math.cos(plume.phase * 0.75) * 0.04;
                const sx = camX + (travelX / plume.z) * canvas.width * 0.42;
                const sy = camY + (travelY / plume.z) * canvas.height * 0.3;
                const depth = Math.max(0, Math.min(1, 1.4 - plume.z));

                const radius = (plume.radius / plume.z) * (0.72 + depth * 0.3);
                const alpha = plume.alpha * depth * (0.15 + plume.tone * 0.35);
                if (alpha <= 0.01) return;

                const smokeGradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
                smokeGradient.addColorStop(0, `rgba(214, 233, 245, ${alpha})`);
                smokeGradient.addColorStop(0.42, `rgba(170, 205, 226, ${alpha * 0.55})`);
                smokeGradient.addColorStop(1, 'rgba(145, 186, 210, 0)');
                ctx.fillStyle = smokeGradient;
                ctx.beginPath();
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();

            // Bright formation highlights so cloud bodies are visible
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.14;
            ctx.filter = 'blur(26px)';
            const w1 = canvas.width * 1.28;
            const h1 = canvas.height * 1.22;
            const w2 = canvas.width * 1.44;
            const h2 = canvas.height * 1.36;
            ctx.drawImage(
                noiseCanvas,
                camX - w1 * 0.5 + Math.sin(timeRef.current * 0.28) * 40,
                camY - h1 * 0.5 - Math.cos(timeRef.current * 0.22) * 34,
                w1,
                h1
            );
            ctx.globalAlpha = 0.11;
            ctx.drawImage(
                noiseCanvas,
                camX - w2 * 0.5 - Math.cos(timeRef.current * 0.33) * 56,
                camY - h2 * 0.5 + Math.sin(timeRef.current * 0.26) * 42,
                w2,
                h2
            );
            ctx.restore();

            // IFR veil to reduce overall clarity (low-visibility layer)
            const ifrVeil = ctx.createLinearGradient(0, 0, 0, canvas.height);
            ifrVeil.addColorStop(0, 'rgba(28, 47, 66, 0.035)');
            ifrVeil.addColorStop(0.4, 'rgba(48, 75, 99, 0.02)');
            ifrVeil.addColorStop(1, 'rgba(92, 133, 162, 0.016)');
            ctx.save();
            ctx.globalAlpha = 1 - scene2Blend * 0.66;
            ctx.fillStyle = ifrVeil;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            // Depth haze layer
            const haze = ctx.createLinearGradient(0, 0, 0, canvas.height);
            haze.addColorStop(0, 'rgba(18, 32, 47, 0.06)');
            haze.addColorStop(0.45, 'rgba(66, 105, 131, 0.03)');
            haze.addColorStop(1, 'rgba(181, 219, 238, 0.022)');
            ctx.save();
            ctx.globalAlpha = 1 - scene2Blend * 0.54;
            ctx.fillStyle = haze;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            if (canvas.width > 0 && canvas.height > 0) {
                const edgeTone = ctx.createLinearGradient(0, 0, 0, canvas.height);
                edgeTone.addColorStop(0, 'rgba(18, 46, 78, 0.03)');
                edgeTone.addColorStop(0.5, 'rgba(18, 46, 78, 0)');
                edgeTone.addColorStop(1, 'rgba(18, 46, 78, 0.025)');
                ctx.fillStyle = edgeTone;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Final vignette + anti-green color correction overlay
                const vignette = ctx.createRadialGradient(
                    canvas.width * 0.5,
                    canvas.height * 0.5,
                    canvas.width * 0.2,
                    canvas.width * 0.5,
                    canvas.height * 0.5,
                    canvas.width * 0.82
                );
                vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
                vignette.addColorStop(1, 'rgba(26, 44, 78, 0.06)');
                ctx.fillStyle = vignette;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

            }

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
        <div className={`relative w-full h-screen overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
        </div>
    );
};
