'use client';

/**
 * <Preloader />
 * -------------
 * Cinematic once-per-session intro: gold/oud dust assembles into the
 * Oud Nomad camel mark (sampled live from the logo), holds, then the
 * wordmark burns in as the dust blows away on the wind. A desert
 * curtain parts to reveal the page underneath.
 *
 * Gated by sessionStorage — shows once per browser session, on
 * whichever page the visitor lands on first, then stays quiet for the
 * rest of the session (per product decision).
 *
 * Mount this once in app/layout.tsx, as a sibling of {children},
 * near the top of <body>. It's `position: fixed` and manages its own
 * stacking (z-[9999]) and lifecycle — no props required.
 *
 * Respects prefers-reduced-motion (skips the particle/camera work
 * entirely and does a plain fade) and reduces particle count on
 * small viewports.
 */

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './preloader/Preloader.module.css';
import { OUD_NOMAD_LOGO_DATA_URI } from './preloader/preloader-logo';

const SESSION_KEY = 'oud-nomad-intro-seen';

export default function Preloader() {
    const [visible, setVisible] = useState(true);
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Gated by sessionStorage disabled so preloader loads on every page reload for testing
        // const seenThisSession = false;

        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.innerWidth < 720;

        // ---------------- three.js particle camel ----------------
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 6.4);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        function makeSprite() {
            const c = document.createElement('canvas');
            c.width = 64;
            c.height = 64;
            const ctx = c.getContext('2d')!;
            const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, 'rgba(255,244,214,1)');
            g.addColorStop(0.4, 'rgba(240,205,140,.7)');
            g.addColorStop(1, 'rgba(240,205,140,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 64, 64);
            return new THREE.CanvasTexture(c);
        }
        const sprite = makeSprite();

        const MAX_PARTICLES = isMobile ? 1600 : 3400;

        let points: THREE.Points | null = null;
        let posAttr: THREE.BufferAttribute | null = null;
        let startPos: Float32Array = new Float32Array();
        let targetPos: Float32Array = new Float32Array();
        let windDir: Float32Array = new Float32Array();
        let seeds: Float32Array = new Float32Array();
        let particlesReady = false;

        function smooth(t: number) {
            return t * t * (3 - 2 * t);
        }

        function buildParticles(pts: number[]) {
            if (!pts || pts.length < 2) return;
            const shapeCount = Math.floor(pts.length / 2);
            const n = Math.min(MAX_PARTICLES, Math.max(shapeCount, 600));

            startPos = new Float32Array(n * 3);
            targetPos = new Float32Array(n * 3);
            windDir = new Float32Array(n * 3);
            seeds = new Float32Array(n * 4); // delay, speed, phase, unused

            const posArr = new Float32Array(n * 3);
            const colArr = new Float32Array(n * 3);

            const goldA = new THREE.Color('#8a7040');
            const goldB = new THREE.Color('#f1d999');
            const redC = new THREE.Color('#5a1c12');

            for (let idx = 0; idx < n; idx++) {
                const si = idx % shapeCount;
                const tx = pts[si * 2];
                const ty = pts[si * 2 + 1];
                const tz = (Math.random() - 0.5) * 0.5;

                targetPos[idx * 3] = tx;
                targetPos[idx * 3 + 1] = ty;
                targetPos[idx * 3 + 2] = tz;

                const ang = Math.random() * Math.PI * 2;
                const rad = 4.5 + Math.random() * 6;
                startPos[idx * 3] = Math.cos(ang) * rad;
                startPos[idx * 3 + 1] = -3.5 + Math.random() * 2.5 - Math.abs(Math.sin(ang)) * 1.5;
                startPos[idx * 3 + 2] = (Math.random() - 0.5) * 6 - 2;

                const wAng = Math.random() * 0.6 - 0.3 + 0.15;
                const wSpeed = 5 + Math.random() * 6;
                windDir[idx * 3] = Math.cos(wAng) * wSpeed;
                windDir[idx * 3 + 1] = Math.sin(wAng) * wSpeed * 0.6 + 1.2;
                windDir[idx * 3 + 2] = (Math.random() - 0.5) * 4;

                seeds[idx * 4] = Math.random() * 0.65;
                seeds[idx * 4 + 1] = 0.7 + Math.random() * 0.8;
                seeds[idx * 4 + 2] = Math.random() * Math.PI * 2;

                posArr[idx * 3] = startPos[idx * 3];
                posArr[idx * 3 + 1] = startPos[idx * 3 + 1];
                posArr[idx * 3 + 2] = startPos[idx * 3 + 2];

                const mixed = Math.random();
                const col =
                    mixed < 0.18
                        ? redC.clone().lerp(goldA, Math.random() * 0.5)
                        : goldA.clone().lerp(goldB, Math.random());
                colArr[idx * 3] = col.r;
                colArr[idx * 3 + 1] = col.g;
                colArr[idx * 3 + 2] = col.b;
            }

            const geometry = new THREE.BufferGeometry();
            posAttr = new THREE.BufferAttribute(posArr, 3);
            geometry.setAttribute('position', posAttr);
            geometry.setAttribute('color', new THREE.BufferAttribute(colArr, 3));

            const material = new THREE.PointsMaterial({
                size: isMobile ? 0.075 : 0.06,
                map: sprite,
                transparent: true,
                opacity: 0.95,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            });

            points = new THREE.Points(geometry, material);
            scene.add(points);
            particlesReady = true;
        }

        function sampleLogoAndBuild(img: HTMLImageElement) {
            const size = 130;
            const c = document.createElement('canvas');
            c.width = size;
            c.height = size;
            const ctx = c.getContext('2d')!;
            ctx.drawImage(img, 0, 0, size, size);
            const data = ctx.getImageData(0, 0, size, size).data;
            const pts: number[] = [];
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const i = (y * size + x) * 4;
                    if (data[i + 3] > 40) {
                        pts.push((x / size - 0.5) * 4.4, -(y / size - 0.5) * 4.4);
                    }
                }
            }
            if (pts.length === 0) {
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        const i = (y * size + x) * 4;
                        if (data[i] < 200 || data[i + 1] < 200 || data[i + 2] < 200) {
                            pts.push((x / size - 0.5) * 4.4, -(y / size - 0.5) * 4.4);
                        }
                    }
                }
            }
            buildParticles(pts);
        }

        const img = new Image();
        let logoBuilt = false;
        const onLogoReady = () => {
            if (!logoBuilt) {
                logoBuilt = true;
                sampleLogoAndBuild(img);
            }
        };
        img.onload = onLogoReady;
        img.onerror = () => console.warn('[Preloader] logo failed to load — particle formation skipped');
        img.src = OUD_NOMAD_LOGO_DATA_URI;
        if (img.complete) {
            onLogoReady();
        }

        let mx = 0;
        let my = 0;
        function onPointerMove(e: PointerEvent) {
            mx = e.clientX / window.innerWidth - 0.5;
            my = e.clientY / window.innerHeight - 0.5;
        }
        window.addEventListener('pointermove', onPointerMove);

        let rafId = 0;
        let formT = 0;
        let dispersion = 0;
        let clock = 0;

        function animate() {
            rafId = requestAnimationFrame(animate);
            clock += 0.016;

            camera.position.x += (mx * 0.5 - camera.position.x) * 0.03;
            camera.position.y += (-my * 0.35 - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            if (particlesReady && posAttr) {
                const arr = posAttr.array as Float32Array;
                const n = arr.length / 3;
                for (let i = 0; i < n; i++) {
                    const d = seeds[i * 4];
                    const sp = seeds[i * 4 + 1];
                    const ph = seeds[i * 4 + 2];
                    let t = (formT - d) / (1 - d);
                    t = Math.max(0, Math.min(1, t));
                    t = smooth(t);

                    const sx = startPos[i * 3];
                    const sy = startPos[i * 3 + 1];
                    const sz = startPos[i * 3 + 2];
                    const tx = targetPos[i * 3];
                    const ty = targetPos[i * 3 + 1];
                    const tz = targetPos[i * 3 + 2];

                    let x = sx + (tx - sx) * t;
                    let y = sy + (ty - sy) * t;
                    let z = sz + (tz - sz) * t;

                    x += Math.sin(clock * 1.6 * sp + ph) * 0.012 * t;
                    y += Math.cos(clock * 1.3 * sp + ph) * 0.012 * t;

                    if (dispersion > 0) {
                        const dt = Math.max(0, dispersion - d * 0.4);
                        const de = smooth(Math.min(1, dt * 1.3));
                        x += windDir[i * 3] * de * de;
                        y += windDir[i * 3 + 1] * de * de;
                        z += windDir[i * 3 + 2] * de * de;
                    }

                    arr[i * 3] = x;
                    arr[i * 3 + 1] = y;
                    arr[i * 3 + 2] = z;
                }
                posAttr.needsUpdate = true;
                if (points && points.material instanceof THREE.PointsMaterial) {
                    points.material.opacity = Math.max(0, 0.95 - dispersion * 1.05);
                }
            }

            renderer.render(scene, camera);
        }
        animate();

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onResize);

        // ---------------- gsap orchestrated timeline ----------------
        const chSpans = root.querySelectorAll<HTMLSpanElement>('[data-pl="ch"]');
        const lineEl = root.querySelector<HTMLElement>('[data-pl="line"]');
        const subEl = root.querySelector<HTMLElement>('[data-pl="sub"]');
        const taglineEl = root.querySelector<HTMLElement>('[data-pl="tagline"]');
        const barWrapEl = root.querySelector<HTMLElement>('[data-pl="bar-wrap"]');
        const barFillEl = root.querySelector<HTMLElement>('[data-pl="bar-fill"]');
        const pctEl = root.querySelector<HTMLElement>('[data-pl="pct"]');
        const panelLeftEl = root.querySelector<HTMLElement>('[data-pl="panel-left"]');
        const panelRightEl = root.querySelector<HTMLElement>('[data-pl="panel-right"]');

        const formProxy = { v: 0 };
        const dispProxy = { v: 0 };

        const finish = () => {
            // Session persistence disabled so preloader runs on each reload for checking
            setVisible(false);
        };

        const tl = gsap.timeline({ onComplete: finish });

        if (reduceMotion) {
            tl.to(chSpans, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03 })
                .to([subEl, taglineEl, barWrapEl], { opacity: 1, duration: 0.5 })
                .to({}, { duration: 0.6 })
                .to(panelLeftEl, { xPercent: -100, duration: 0.8, ease: 'power3.inOut' })
                .to(panelRightEl, { xPercent: 100, duration: 0.8, ease: 'power3.inOut' }, '<')
                .to(root, { autoAlpha: 0, duration: 0.4 });
        } else {
            tl.to(lineEl, { width: '42vw', duration: 1.1, ease: 'power2.out' })
                // sand assembles into the camel silhouette
                .to(
                    formProxy,
                    {
                        v: 1,
                        duration: 2.3,
                        ease: 'power2.out',
                        onUpdate: () => {
                            formT = formProxy.v;
                        },
                    },
                    0.15
                )
                // hold the formed camel a moment
                .to({}, { duration: 0.55 })
                // wordmark + arabic reveal while camel still glows behind
                .to(chSpans, { opacity: 1, y: 0, duration: 0.7, stagger: 0.045, ease: 'power2.out' })
                .to(chSpans, { backgroundPosition: '100% 0%', duration: 1.4, ease: 'sine.inOut' }, '<')
                .to(subEl, { opacity: 1, duration: 0.7 }, '-=.3')
                .to(taglineEl, { opacity: 1, duration: 0.7 }, '-=.5')
                .to(barWrapEl, { opacity: 1, duration: 0.5 }, '-=.4')
                // sand disperses on the wind as loading completes
                .to(
                    dispProxy,
                    {
                        v: 1,
                        duration: 1.6,
                        ease: 'power1.in',
                        onUpdate: () => {
                            dispersion = dispProxy.v;
                        },
                    },
                    '-=.2'
                )
                .to(barFillEl, { width: '100%', duration: 1.9, ease: 'power1.inOut' }, '<')
                .to(
                    pctEl,
                    {
                        duration: 1.9,
                        ease: 'power1.inOut',
                        onUpdate: function () {
                            const p = Math.round(this.progress() * 100);
                            if (pctEl) pctEl.textContent = (p < 10 ? '0' : '') + p + '%';
                        },
                    },
                    '<'
                )
                .to({}, { duration: 0.5 })
                // desert curtain parts to reveal the page
                .to(panelLeftEl, { xPercent: -100, duration: 1.1, ease: 'power3.inOut' })
                .to(panelRightEl, { xPercent: 100, duration: 1.1, ease: 'power3.inOut' }, '<')
                .to(root, { autoAlpha: 0, duration: 0.5 }, '-=.3');
        }

        // NOTE: this timeline drives itself on a fixed schedule for the launch
        // demo. To gate the reveal on real asset loading instead, replace the
        // fixed-duration `formProxy`/`dispProxy` tweens with calls that resolve
        // once your actual loading promise (fonts, hero image, etc.) settles,
        // then call `tl.play()` / let it proceed from there.

        return () => {
            tl.kill();
            cancelAnimationFrame(rafId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (points) {
                points.geometry.dispose();
                (points.material as THREE.Material).dispose();
            }
            sprite.dispose();
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={rootRef}
            className={styles.root}
            role="status"
            aria-live="polite"
            aria-label="Oud Nomad is loading"
        >
            <canvas ref={canvasRef} className={styles.canvas} />

            <div className={styles.horizon}>
                <div className={styles.line} data-pl="line" />
            </div>
            {/* 
            <div className={styles.content}>
                <div className={styles.mark}>
                    <Word word="OUD" />
                    <Word word="NOMAD" />
                </div>
                <div className={styles.sub} data-pl="sub" dir="rtl" lang="ar">
                    عبق الصحراء
                </div>
                <div className={styles.tagline} data-pl="tagline">
                    An ode to Arabian perfumery
                </div>
                <div className={styles.barWrap} data-pl="bar-wrap">
                    <div className={styles.barTrack}>
                        <div className={styles.barFill} data-pl="bar-fill" />
                    </div>
                    <div className={styles.pct} data-pl="pct">
                        00%
                    </div>
                </div>
            </div> */}

            <div className={styles.panels}>
                <div className={styles.panel} data-pl="panel-left" />
                <div className={styles.panel} data-pl="panel-right" />
            </div>
        </div>
    );
}

function Word({ word }: { word: string }) {
    return (
        <span className={styles.word}>
            {word.split('').map((ch, i) => (
                <span key={i} className={styles.ch} data-pl="ch">
                    {ch}
                </span>
            ))}
        </span>
    );
}