export function animate(ctx) {

    ctx.animationFrameId = requestAnimationFrame(() => animate(ctx));

    const now = performance.now();
    const level = ctx.voiceLevel;

    const { textMesh, layers, camera, renderer, mouse, scene } = ctx;

    // --- TEXT MESH ---
    if (textMesh) {

        const scale = 1 + level * 2;

        textMesh.scale.set(3 * scale, 0.8 * scale, 1);

        textMesh.material.opacity = 0.6 + level * 1.5;

        textMesh.position.z = 0.5 + level * 2.0;
    }

    // --- LAYERS LOOP ---
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
                s.rotationSpeed/10 * (1.0 + level * 5.0);

            u.uMouse.value.set(mouse.x, mouse.y);

            u.uTurbulence.value = s.turbulence/100 + level/10;
            u.uScatter.value = s.scatterSize + level * 3;
            u.uBrightness.value = s.brightness/20 + level*10;

            if (u.uRipple) {
                u.uRippleSpeed.value = s.rippleSpeed/100 + level;
            }

            u.uCollision.value = s.collisionStrength/100 + level/5;
        }
    }

    // --- CAMERA BREATHING ---
    camera.position.z = 7 + level * 1.5;

    renderer.render(scene, camera);
}
