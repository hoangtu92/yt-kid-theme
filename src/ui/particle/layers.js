// === LAYER SETTINGS (Direct from demo-particles.js) ===
import * as THREE from "three";
import {createSingleTextTexture} from "./text";

const RADIUS = 2.2;
const LAYERS = [
    { enabled: true, particleCount: 20000, baseSize: 0.0001, sizeRandomness: 1, baseOpacity: 5, opacityRandomness: 1.0, rotationSpeed: -0.004, turbulence: 0.6, scatterSize: 0.6, collisionStrength: 0.2, colorStart: '#898989', colorEnd: '#ffffff', blending: 'additive', brightness: 5.0, shape: 'circle', uniformity: 0.0, ripple: false, rippleSpeed: 0.5 },
    { enabled: true, particleCount: 1000, baseSize: 0.03, sizeRandomness: 1.0, baseOpacity: 5, opacityRandomness: 1.0, rotationSpeed: 0.003, turbulence: 0.1, scatterSize: 1.8, collisionStrength: 0.8, colorStart: '#0fff00', colorEnd: '#00ffe8', blending: 'additive', brightness: 5.0, shape: 'organic', uniformity: 0.3, ripple: false, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 700, baseSize: 0.03, sizeRandomness: 1.5, baseOpacity: 5.0, opacityRandomness: 0.7, rotationSpeed: -0.002, turbulence: 0.4, scatterSize: -4, collisionStrength: 1, colorStart: '#ff00ff', colorEnd: '#ffffff', blending: 'additive', brightness: 1.0, shape: 'organic', uniformity: 0.1, ripple: true, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 9, baseSize: 0.5, sizeRandomness: 1.5, baseOpacity: 10, opacityRandomness: 0.2, rotationSpeed: -0.002, turbulence: 0.4, scatterSize: 0.6, collisionStrength: 0.2, colorStart: '#0000FF', colorEnd: '#FFA500', glow: true, blending: 'additive', brightness: 5, shape: 'circle', uniformity: 0, ripple: true, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 8, baseSize: 0.3, sizeRandomness: 0.7, baseOpacity: 5.0, opacityRandomness: 1.3, rotationSpeed: -0.007, turbulence: 0.2, scatterSize: 1.5, collisionStrength: 1.5, colorStart: '#FA2C02', colorEnd: '#02FAEE', glow: true, blending: 'additive', brightness: 2.2, shape: 'organic', uniformity: 0.2, ripple: false, rippleSpeed: 1.0 },
    { enabled: true, particleCount: 27, baseSize: 0.17, sizeRandomness: 1, baseOpacity: 2.0, opacityRandomness: 1, speed: 0.01, outwardSpeed: 0.7, color: '#00ffe5', binaryColor0: '#ff9900', binaryColor1: '#00ffff', blending: 'additive', brightness: 5.0, shape: 'binary', uniformity: 0.3, ripple: true, rippleSpeed: 1 }
];

/**
 *
 * @param settings
 * @returns {BufferGeometry}
 */
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

/**
 *
 * @param settings
 * @param l
 * @returns {ShaderMaterial}
 */
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

/**
 *
 * @param scene
 * @param settings
 * @returns {{settings, binaryLayer: {opacities: Float32Array, radii: Float32Array, settings, angles: Float32Array, points: *[]}, type: string}}
 */
function initBinaryLayer(scene, settings) {
    const N = settings.particleCount;
    const tex0 = createSingleTextTexture('0', settings.binaryColor0);
    const tex1 = createSingleTextTexture('1', settings.binaryColor1);
    const binaryLayer = { radii: new Float32Array(N), angles: new Float32Array(N), opacities: new Float32Array(N), points: [], settings };

    for (let i = 0; i < N; i++) {
        const isOne = Math.random() > 0.5;
        const mat = new THREE.PointsMaterial({
            size: settings.baseSize * (1.0 + (Math.random() - 0.5) * settings.sizeRandomness * 2.0),
            map: isOne ? tex1 : tex0, transparent: true, opacity: settings.baseOpacity,
            blending: THREE.AdditiveBlending, depthWrite: false, color: 'white'
        });
        const mesh = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3)), mat);
        scene.add(mesh);
        binaryLayer.points.push(mesh);
        binaryLayer.angles[i] = (i / N) * Math.PI * 2 + Math.random() * Math.PI * 2;
        binaryLayer.radii[i] = 0.0;
        binaryLayer.opacities[i] = settings.baseOpacity;
    }
    return { binaryLayer, settings, type: 'binary' }
}

/**
 *
 * @param scene
 * @param settings
 * @returns {{settings, uniforms: (Object|*), type: string, points: Points}}
 */
function initNormalLayer(scene, settings){
    const geometry = initParticleGeometry(settings);
    const material = createParticleMaterial(THREE, settings);

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    return {
        type: "normal",
        points,
        uniforms: material.uniforms,
        settings
    };
}

/**
 *
 * @param scene
 * @returns {[{settings, uniforms: (Object|*), type: string, points: Points}]}
 */
export function createParticleLayers(scene) {

    return LAYERS.map(setting =>  {
            if (setting.shape === 'binary') {
                return initBinaryLayer(scene, setting);
            }

            return initNormalLayer(scene, setting);
        }
    );

}

/**
 *
 * @param ctx
 */
export function destroyLayers(ctx) {

    if (!ctx?.layers || !ctx.scene) return;

    ctx.layers.forEach(layer => {

        if (layer.points) {
            ctx.scene.remove(layer.points);

            layer.points.geometry?.dispose?.();
            layer.points.material?.dispose?.();
        }

        if (layer.binaryLayer) {
            layer.binaryLayer.points.forEach(p => {
                ctx.scene.remove(p);
                p.geometry?.dispose?.();
                p.material?.map?.dispose?.();
                p.material?.dispose?.();
            });
        }
    });

    // 🧹 IMPORTANT: clear references
    ctx.layers.length = 0;
}
