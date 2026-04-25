import * as THREE from "three";
import {createTextMesh, updateTextMesh} from "./text";
import {createParticleLayers} from "./layers";

export default function createEngine(ctx, audio) {

    let scene, camera, renderer;
    let layers = [];
    let textMesh;
    let animationFrameId = null;
    let mouse = { x: 0, y: 0 };

    function init(canvas) {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 7;

        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        textMesh = createTextMesh("LISTENING");
        scene.add(textMesh);

        layers = createParticleLayers(scene);

        ctx.scene = scene;
        ctx.camera = camera;
        ctx.renderer = renderer;
        ctx.layers = layers;
        ctx.textMesh = textMesh;

        audio.init();

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onWindowResize);

        animate();
    }

    function updateText(text){
        updateTextMesh(ctx.textMesh, text);
    }

    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        ctx.camera.aspect = window.innerWidth / window.innerHeight;
        ctx.camera.updateProjectionMatrix();
        ctx.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {

        animationFrameId = requestAnimationFrame(animate);

        const now = performance.now();

        const v = ctx.voiceLevel || 0;

        // --- 1. Voice energy smoothing ---
        const rawLevel = audio?.getLevel?.() || 0;
        ctx.voiceLevel = v * 0.85 + rawLevel * 0.5;

        const level = ctx.voiceLevel;

        // --- TEXT MESH ---
        if (textMesh) {

            const scale = 1 + level * 2;

            textMesh.scale.set(3 * scale, 0.8 * scale, 1);

            textMesh.material.opacity = 0.6 + level * 1.5;

            textMesh.position.z = 0.5 + level * 2.0;
        }

        // --- 2. LAYERS LOOP ---
        for (let i = 0; i < layers.length; i++) {

            const layer = layers[i];

            // =========================
            // 🔢 BINARY LAYER
            // =========================
            if (layer.type === "binary") {

                const { binaryLayer, settings } = layer;

                for (let j = 0; j < settings.particleCount; j++) {

                    binaryLayer.radii[j] +=
                        (settings.outwardSpeed + level * 2.0) * 0.01;

                    if (binaryLayer.radii[j] > 3.5 + level * 2.0) {
                        binaryLayer.radii[j] = 0;
                    }

                    const ripple = settings.ripple
                        ? Math.sin(
                        now * 0.001 *
                        (settings.rippleSpeed + level * 3.0) +
                        binaryLayer.angles[j] * 4.0
                    ) * (0.5 + level)
                        : 0;

                    const r = binaryLayer.radii[j] + ripple;

                    const p = binaryLayer.points[j];

                    p.position.set(
                        Math.cos(binaryLayer.angles[j]) * r,
                        Math.sin(binaryLayer.angles[j]) * r,
                        0
                    );

                    const baseOpacity =
                        binaryLayer.radii[j] > 2.0
                            ? binaryLayer.opacities[j] *
                            (1.0 - (binaryLayer.radii[j] - 2.0) / 1.5)
                            : binaryLayer.opacities[j];

                    p.material.opacity =
                        baseOpacity * (0.6 + level * 1.8);
                }

                // =========================
                // 🌌 NORMAL PARTICLES
                // =========================
            } else {

                const u = layer.uniforms;
                const s = layer.settings;

                u.uTime.value += 0.016 + level * 0.5;

                u.uRotation.value +=
                    s.rotationSpeed * (1.0 + level * 3.0);

                u.uMouse.value.set(mouse.x, mouse.y);

                u.uTurbulence.value = s.turbulence + level * 3;
                u.uScatter.value = s.scatterSize + level * 3;
                u.uBrightness.value = s.brightness + level * 10;

                if (u.uRipple) {
                    u.uRippleSpeed.value = s.rippleSpeed + level * 5;
                }

                u.uCollision.value = s.collisionStrength + level * 5;
            }
        }

        // --- 3. CAMERA BREATHING ---
        camera.position.z = 7 + level * 1.5;

        renderer.render(scene, camera);
    }


    function destroy() {

        cancelAnimationFrame(animationFrameId);

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onWindowResize);

        for (const layer of layers) {
            layer.destroy?.();
        }

        renderer?.dispose();

        // --- Dispose camera ---

        scene = null;
        camera = null;
        renderer = null;
        layers = [];
    }

    return {
        init,
        updateText,
        destroy
    };
}
