
// --- SVG CONTENT ---
const AI_BRAIN_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="brain-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a83aff"/>
      <stop offset="50%" stop-color="#0087cb"/>
      <stop offset="100%" stop-color="#ff23fc"/>
    </linearGradient>
  </defs>
  <path d="M12 18V5" stroke="url(#brain-stroke-gradient)"/>
  <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" stroke="url(#brain-stroke-gradient)"/>
  <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" stroke="url(#brain-stroke-gradient)"/>
  <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" stroke="url(#brain-stroke-gradient)"/>
  <path d="M18 18a4 4 0 0 0 2-7.464" stroke="url(#brain-stroke-gradient)"/>
  <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" stroke="url(#brain-stroke-gradient)"/>
  <path d="M6 18a4 4 0 0 1-2-7.464" stroke="url(#brain-stroke-gradient)"/>
  <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" stroke="url(#brain-stroke-gradient)"/>
</svg>`;

// === LAYER SETTINGS (Direct from demo-particles.js) ===
const LAYERS = [
    { enabled: true, particleCount: 20000, baseSize: 0.0001, sizeRandomness: 1, baseOpacity: 5, opacityRandomness: 1.0, rotationSpeed: -0.004, turbulence: 0.6, scatterSize: 0.6, collisionStrength: 0.2, colorStart: '#898989', colorEnd: '#ffffff', blending: 'additive', brightness: 5.0, shape: 'circle', uniformity: 0.0, ripple: false, rippleSpeed: 0.5 },
    { enabled: true, particleCount: 1000, baseSize: 0.03, sizeRandomness: 1.0, baseOpacity: 5, opacityRandomness: 1.0, rotationSpeed: 0.003, turbulence: 0.1, scatterSize: 1.8, collisionStrength: 0.8, colorStart: '#0fff00', colorEnd: '#00ffe8', blending: 'additive', brightness: 5.0, shape: 'organic', uniformity: 0.3, ripple: false, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 700, baseSize: 0.03, sizeRandomness: 1.5, baseOpacity: 5.0, opacityRandomness: 0.7, rotationSpeed: -0.002, turbulence: 0.4, scatterSize: -4, collisionStrength: 1, colorStart: '#ff00ff', colorEnd: '#ffffff', blending: 'additive', brightness: 1.0, shape: 'organic', uniformity: 0.1, ripple: true, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 8, baseSize: 0.3, sizeRandomness: 0.7, baseOpacity: 5.0, opacityRandomness: 1.3, rotationSpeed: -0.007, turbulence: 0.2, scatterSize: 1.5, collisionStrength: 1.5, colorStart: '#FA2C02', colorEnd: '#02FAEE', glow: true, blending: 'additive', brightness: 2.2, shape: 'organic', uniformity: 0.2, ripple: false, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 27, baseSize: 0.17, sizeRandomness: 1, baseOpacity: 2.0, opacityRandomness: 1, speed: 0.01, outwardSpeed: 0.7, color: '#00ffe5', binaryColor0: '#ff9900', binaryColor1: '#00ffff', blending: 'additive', brightness: 5.0, shape: 'binary', uniformity: 0.3, ripple: true, rippleSpeed: 1 }
];

const RADIUS = 2.2;
let scene, camera, renderer, layers = [], mouse = { x: 0, y: 0 }, animationFrameId;
let voiceLevel = 0;
let textMesh;

function createCanvas() {
    // Remove old canvas if exists
    const old = document.getElementById('particle-canvas');
    if (old && old.parentNode) {
        old.parentNode.removeChild(old);
    }

    // Create new canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';

    // Find wrapper
    const wrapper = document.querySelector('.particle-loader-wrapper');

    if (!wrapper) {
        console.warn('No .particle-loader-wrapper found');
        document.body.appendChild(canvas); // fallback
        return canvas;
    }

    // ✅ Prepend (insert as first child)
    wrapper.prepend(canvas);

    return canvas;
}

function updateText(text) {
    if (!textMesh) return;

    const newTexture = createTextTexture1(text);

    // 🔥 dispose old texture to avoid memory leak
    if (textMesh.material.map) {
        textMesh.material.map.dispose();
    }

    textMesh.material.map = newTexture;
    textMesh.material.needsUpdate = true;
}
/**
 *
 * @returns {Promise<void>}
 */
async function init() {
    document.querySelector(".particle-loader-wrapper").style.display = "block"
    const canvas = createCanvas();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    textMesh = createTextMesh("LISTENING");
    scene.add(textMesh);

    renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    for (let l = 0; l < LAYERS.length; l++) {
        const settings = LAYERS[l];
        if (!settings.enabled) continue;

        if (settings.shape === 'binary') {
            initBinaryLayer(settings);
            continue;
        }

        const geometry = initParticleGeometry(settings);
        const material = createParticleMaterial(settings, l);
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        layers.push({points, uniforms: material.uniforms, settings});
    }

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    //setupSVG();
    try {
        await initAudio();   // 🎤 wait for mic permission
    } catch (e) {
        console.warn("Mic not available:", e);
    }
    animate();
}

function initParticleGeometry(settings) {
    const N = settings.particleCount;
    const positions = new Float32Array(N * 3), angles = new Float32Array(N), speeds = new Float32Array(N);
    const sizes = new Float32Array(N), opacities = new Float32Array(N), randoms = new Float32Array(N), colorTs = new Float32Array(N);

    for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2;
        const r = RADIUS + (Math.random() - 0.5) * 0.12;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = Math.sin(angle) * r;
        positions[i * 3 + 2] = 0;
        angles[i] = angle;
        speeds[i] = 0.2 + Math.random() * 0.7;
        sizes[i] = settings.baseSize * (1.0 + (Math.random() - 0.5) * settings.sizeRandomness * 2.0);
        opacities[i] = settings.baseOpacity * (1.0 + (Math.random() - 0.5) * settings.opacityRandomness * 2.0);
        randoms[i] = Math.random();
        colorTs[i] = i / N;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aColorT', new THREE.BufferAttribute(colorTs, 1));
    return geometry;
}

function createParticleMaterial(settings, l) {
    let blendingMode = THREE.AdditiveBlending;
    if (settings.blending === 'normal') blendingMode = THREE.NormalBlending;
    else if (settings.blending === 'multiply') blendingMode = THREE.MultiplyBlending;

    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uRotation: { value: 0 },
            uTurbulence: { value: settings.turbulence },
            uScatter: { value: settings.scatterSize },
            uCollision: { value: settings.collisionStrength },
            uColorStart: { value: new THREE.Color(settings.colorStart) },
            uColorEnd: { value: new THREE.Color(settings.colorEnd) },
            uGlow: { value: settings.glow ? 1.0 : 0.0 },
            uBrightness: { value: settings.brightness },
            uShape: { value: settings.shape === 'circle' ? 0 : settings.shape === 'square' ? 1 : 2 },
            uUniformity: { value: settings.uniformity },
            uRipple: { value: settings.ripple ? 1.0 : 0.0 },
            uRippleSpeed: { value: settings.rippleSpeed }
        },
        vertexShader: `
            attribute float aAngle; attribute float aSpeed; attribute float aSize;
            attribute float aOpacity; attribute float aRandom; attribute float aColorT;
            uniform float uTime; uniform vec2 uMouse; uniform float uRotation;
            uniform float uTurbulence; uniform float uScatter; uniform float uCollision;
            uniform float uGlow; uniform float uUniformity; uniform float uRipple; uniform float uRippleSpeed;
            varying float vAlpha; varying float vOpacity; varying float vGlow; varying float vRandom; varying float vColorT;

            void main() {
                float swirl = aAngle + uTime * aSpeed * 0.18;
                float ripple = (uRipple > 0.5) ? sin(uTime * uRippleSpeed + aAngle * 4.0) * 0.5 : 0.0;
                float r = 2.2 + ripple;
                float turb = uTurbulence * (0.5 + 0.5 * aRandom);
                float scatter = uScatter * (0.5 + 0.5 * aRandom);
                float mx = uMouse.x * 0.7; float my = uMouse.y * 0.7;
                float organicTime = mix(uTime, uTime + aRandom * 10.0, 1.0 - uUniformity);
                float organic = 0.0;
                if (uTurbulence > 0.01) {
                    organic = sin(swirl * 6.0 + organicTime * 2.0 + aRandom * 10.0) * turb + cos(swirl * 3.0 - organicTime + aRandom * 5.0) * turb;
                }
                float px = cos(swirl) * (r + organic + scatter * (aRandom - 0.5) + mx * sin(swirl + organicTime));
                float py = sin(swirl) * (r + organic + scatter * (aRandom - 0.5) + my * cos(swirl - organicTime));
                float repel = 1.0;
                if (uCollision > 0.01) {
                    float dist = length(vec2(px, py));
                    repel = 1.0 + uCollision * 0.2 / (dist + 0.1);
                }
                vec3 pos = vec3(px * repel, py * repel, 0.0);
                float rot = uRotation; float cosR = cos(rot); float sinR = sin(rot);
                vec3 rotated = vec3(pos.x * cosR - pos.y * sinR, pos.x * sinR + pos.y * cosR, 0.0);
                vAlpha = 0.6 + 0.2 * sin(swirl * 8.0 + organicTime * 2.0);
                vOpacity = aOpacity; vGlow = uGlow; vRandom = aRandom; vColorT = aColorT;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(rotated, 1.0);
                gl_PointSize = aSize * (0.7 + 0.6 * vAlpha) * (400.0 / length(gl_Position.xyz));
            }
        `,
        fragmentShader: `
            uniform vec3 uColorStart; uniform vec3 uColorEnd; uniform float uTime;
            uniform float uBrightness; uniform int uShape;
            varying float vAlpha; varying float vOpacity; varying float vGlow; varying float vRandom; varying float vColorT;

            void main() {
                float d = length(gl_PointCoord - vec2(0.5));
                if (uShape == 0 && d > 0.5) discard;
                if (uShape == 1) {} 
                else if (uShape == 2) {
                    float edge = 0.5 + 0.35 * sin(32.0 * atan(gl_PointCoord.y-0.5, gl_PointCoord.x-0.5) + vRandom * 10.0 + uTime);
                    if (d > edge) discard;
                }
                float alpha = smoothstep(0.35, 0.15, d) * vAlpha * vOpacity * 0.7;
                vec3 color = mix(uColorStart, uColorEnd, vColorT);
                if (vGlow > 0.5) alpha *= (0.5 + 0.5 * sin(uTime * 2.0 + vRandom * 10.0));
                if (alpha < 0.04) discard;
                gl_FragColor = vec4(color * uBrightness, alpha);
            }
        `,
        transparent: true, depthWrite: false, blending: blendingMode
    });
}

function initBinaryLayer(settings) {
    const N = settings.particleCount;
    const tex0 = createTextTexture('0', settings.binaryColor0);
    const tex1 = createTextTexture('1', settings.binaryColor1);
    const binaryLayer = { radii: new Float32Array(N), angles: new Float32Array(N), opacities: new Float32Array(N), points: [], settings };

    for (let i = 0; i < N; i++) {
        const isOne = Math.random() > 0.5;
        const mat = new THREE.PointsMaterial({
            size: settings.baseSize * (1.0 + (Math.random() - 0.5) * settings.sizeRandomness * 2.0),
            map: isOne ? tex1 : tex0, transparent: true, opacity: settings.baseOpacity,
            blending: THREE.AdditiveBlending, depthWrite: false, color: '#white'
        });
        const mesh = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3)), mat);
        scene.add(mesh);
        binaryLayer.points.push(mesh);
        binaryLayer.angles[i] = (i / N) * Math.PI * 2 + Math.random() * Math.PI * 2;
        binaryLayer.radii[i] = 0.0;
        binaryLayer.opacities[i] = settings.baseOpacity;
    }
    layers.push({ binaryLayer, settings, type: 'binary' });
}

function createTextTexture(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '50px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = color; ctx.fillText(text, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

function createTextTexture1(text) {
    const canvas = document.createElement('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Text style
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glow effect
    ctx.shadowColor = '#00ffe5';
    ctx.shadowBlur = 30;

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}

/**
 *
 * @param text
 * @returns {Bo}
 */
function createTextMesh(text) {
    const texture = createTextTexture1(text);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(3, 0.8, 1); // adjust size

    return sprite;
}


function animate() {

    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    animationFrameId = requestAnimationFrame(animate);

    const now = performance.now();

    // --- 1. Get voice energy (smooth it to avoid jitter) ---
    const rawLevel = getAudioLevel ? getAudioLevel() : 0;
    voiceLevel = voiceLevel * 0.85 + rawLevel * 0.5; // smoothing
    //voiceLevel = Math.abs(Math.sin(performance.now() * 0.003));

    if (textMesh) {
        const scale = 1 + voiceLevel * 2;

        textMesh.scale.set(3 * scale, 0.8 * scale, 1);
        textMesh.material.opacity = 0.6 + voiceLevel * 1.5;
        textMesh.position.z = 0.5 + voiceLevel * 2.0;
    }

    // --- 2. Loop layers ---
    for (let l = 0; l < layers.length; l++) {
        const layer = layers[l];

        // =========================
        // 🔢 BINARY LAYER
        // =========================
        if (layer.type === 'binary') {
            const { binaryLayer, settings } = layer;

            for (let i = 0; i < settings.particleCount; i++) {

                // Voice pushes particles outward faster
                binaryLayer.radii[i] += (settings.outwardSpeed + voiceLevel * 2.0) * 0.01;

                if (binaryLayer.radii[i] > 3.5 + voiceLevel * 2.0) {
                    binaryLayer.radii[i] = 0;
                }

                let ripple = settings.ripple
                    ? Math.sin(now * 0.001 * (settings.rippleSpeed + voiceLevel * 3.0)
                    + binaryLayer.angles[i] * 4.0) * (0.5 + voiceLevel)
                    : 0;

                const r = binaryLayer.radii[i] + ripple;

                binaryLayer.points[i].position.set(
                    Math.cos(binaryLayer.angles[i]) * r,
                    Math.sin(binaryLayer.angles[i]) * r,
                    0
                );

                // Fade out based on distance + voice pulse
                const baseOpacity =
                    (binaryLayer.radii[i] > 2.0)
                        ? binaryLayer.opacities[i] * (1.0 - (binaryLayer.radii[i] - 2.0) / 1.5)
                        : binaryLayer.opacities[i];

                binaryLayer.points[i].material.opacity =
                    baseOpacity * (0.6 + voiceLevel * 1.8);
            }

            // =========================
            // 🌌 NORMAL PARTICLE LAYERS
            // =========================
        } else {
            const u = layer.uniforms;
            const s = layer.settings;

            // Time speeds up slightly with voice
            u.uTime.value += 0.016 + voiceLevel * 0.5;

            // Rotation reacts to voice (more energy → faster spin)
            u.uRotation.value += s.rotationSpeed * (1.0 + voiceLevel * 3.0);

            // Mouse stays
            u.uMouse.value.set(mouse.x, mouse.y);

            // 🔥 Voice-driven effects
            u.uTurbulence.value = s.turbulence + voiceLevel * 5;
            u.uScatter.value = s.scatterSize + voiceLevel * 2;
            u.uBrightness.value = s.brightness + voiceLevel * 8;

            // Ripple reacts to voice rhythm
            if (u.uRipple) {
                u.uRippleSpeed.value = s.rippleSpeed + voiceLevel * 7;
            }

            // Optional: make collisions stronger when loud
            u.uCollision.value = s.collisionStrength + voiceLevel * 4;
        }
    }

    // =========================
    // 🎥 Camera "breathing" effect
    // =========================
    camera.position.z = 7 + voiceLevel * 1.5;

    renderer.render(scene, camera);
}

function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Setup svg for canvas
 */
function setupSVG() {
    const container = document.getElementById('center-svg-container');
    container.innerHTML = AI_BRAIN_SVG_CONTENT;
    const svgEl = container.querySelector('svg');
    svgEl.setAttribute('stroke', '#ffb300');
    svgEl.setAttribute('stroke-width', '0.2');
    svgEl.classList.add('glow-fade');
    container.classList.add('ripple-effect');

    const thirdRipple = document.createElement('div');
    thirdRipple.className = 'third-ripple-wave';
    container.appendChild(thirdRipple);

    let time = 0;
    function animateStroke() {
        const sw = 0.2 + (2.3 * Math.sin((time % 750) / 750 * Math.PI));
        svgEl.setAttribute('stroke-width', sw.toFixed(2));
        time += 16;
        requestAnimationFrame(animateStroke);
    }
    animateStroke();
}


let audioCtx, analyser, dataArray, micSource;

/**
 *
 * @returns {Promise<void>}
 */
async function initAudio() {
    if (audioCtx && audioCtx.state !== 'closed') return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();

    micSource = audioCtx.createMediaStreamSource(stream);
    micSource.connect(analyser);

    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

/**
 *
 * @returns {number}
 */
function getAudioLevel() {
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }

    return sum / dataArray.length / 255; // normalize 0 → 1
}

/**
 * Destroy the canvas
 */
function destroy() {
    // --- 1. Stop animation loop ---
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // --- 2. Remove event listeners ---
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('mousemove', onMouseMove);

    // --- 3. Dispose all layers ---
    layers.forEach(layer => {

        // 🔢 Binary layer
        if (layer.type === 'binary') {
            const { binaryLayer } = layer;

            binaryLayer.points.forEach(p => {
                if (p.geometry) p.geometry.dispose();
                if (p.material) {
                    if (p.material.map) p.material.map.dispose();
                    p.material.dispose();
                }
                scene.remove(p);
            });

            // 🌌 Normal particle layers
        } else if (layer.points) {
            if (layer.points.geometry) {
                layer.points.geometry.dispose();
            }

            if (layer.points.material) {
                layer.points.material.dispose();
            }

            scene.remove(layer.points);
        }
    });

    layers = [];

    // --- 4. Dispose renderer ---
    if (renderer) {
        renderer.dispose();

        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }

        renderer = null;
    }

    // --- 5. Clear scene ---
    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        scene = null;
    }

    // --- 6. Dispose camera ---
    camera = null;

    // --- 7. Stop audio (if used) ---
    if (micSource) {
        try {
            micSource.disconnect();
        } catch (e) {}
        micSource = null;
    }

    if (analyser) {
        try {
            analyser.disconnect();
        } catch (e) {}
        analyser = null;
    }

    if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
    }

    // --- 8. Reset state ---
    dataArray = null;
    voiceLevel = 0;
    mouse = { x: 0, y: 0 };

    // --- 9. Clear SVG container ---
    const container = document.getElementById('center-svg-container');
    if (container) {
        container.innerHTML = '';
    }

    // --- 10. Optional: clear canvas ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
    }

    scene = null;
    camera = null;
    renderer = null;
    layers = [];
    animationFrameId = null;
    document.querySelector(".particle-loader-wrapper").style.display = "none"
}
