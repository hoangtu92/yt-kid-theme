/**
 *
 * @param text
 * @param currentLang
 * @returns {Promise<unknown>}
 */
function speak(text, currentLang) {
    return new Promise((resolve, reject) => {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === currentLang);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang; // or 'vi-VN'
        utterance.voice = voice;

        speechSynthesis.speak(utterance);

        utterance.onend = resolve;
        utterance.onerror = reject;
    })
}

/**
 *
 * @param text
 * @returns {Promise<void>}
 */
async function searchVideo(text) {
    let searchIcon = document.querySelector("#search-icon");
    let input = document.querySelector("input.style-scope.ytk-search-box")
    if (input) {
        input.value = text;
        searchIcon.click();
    }
}

/**
 *
 * @param e
 */
function fillSearchResult(e) {
    let text = e.target.getAttribute("data-search");
    if (text) {
        document.querySelector("input.style-scope.ytk-search-box").value = text;
    }
}

/**
 *
 * @returns {boolean}
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * trigger a touch event
 * @param eventTarget
 * @param eventName
 * @param mouseEv
 */
function triggerTouch(eventTarget, eventName, mouseEv) {
    let touches = [];
    if(mouseEv.clientX){
        touches =  [new Touch({
            identifier: Date.now(),
            target: eventTarget,
            clientX: mouseEv.clientX,
            clientY: mouseEv.clientY,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
        })];
    }

    let touchEvent = new TouchEvent(eventName, {
        cancelable: true,
        bubbles: true,
        touches: touches,
        targetTouches: touches,
        changedTouches: touches,
        shiftKey: true,
        altKey: mouseEv.altKey,
        ctrlKey: mouseEv.ctrlKey,
    });

    eventTarget.dispatchEvent(touchEvent);
}

/**
 *
 */
const enterFullscreen = function (){
    document.body.classList.add("fullscreen");
    document.body.classList.remove("search-mode");
    window.dispatchEvent(new Event('resize'));

}

/**
 *
 * @param nav
 */
function hideNav(nav = null){
    if(!nav) nav = document.querySelector("#secondary-results");
    if(nav){
        nav.style.display = "none";
        document.body.classList.remove("search-mode");
    }

}

/**
 *
 * @param nav
 */
function showNav(nav = null){
    if(!nav) nav = document.querySelector("#secondary-results");
    if(nav){
        nav.style.display = "block";
        document.body.classList.add("search-mode");
    }
}
/**
 *
 * @param e
 */
const toggleNav = function (e) {
    let nav = document.querySelector("#secondary-results");
    if(nav){
        if (nav.style.display === "block") {
            hideNav(nav)
        } else {
            showNav(nav);
        }
    }
}

/**
 *
 * @param html
 * @returns {ChildNode}
 */
function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 *
 * @param lang
 */
function changeLanguage(lang){

    chrome.storage.local.set({ selected_language: lang });

    document.querySelectorAll(".search-row").forEach(e => {
        e.style.display = "none";
    });
    document.querySelectorAll(`.search-row[data-lang="${lang}"]`).forEach(e => {
        e.style.display = "block";
    });
}

/**
 *
 * @returns {Promise<unknown>}
 */
const getLanguage = async () => {

    return new Promise(resolve => {
        chrome.storage.local.get(["selected_language"], (res) => {
            resolve(res.selected_language || 'en-US');
        });
    });

}

async function renderQuickSearchMenu(container ) {
    //let container = document.querySelector(selector);


    let currentLang = await getLanguage();
    Object.entries(searchData).forEach(([lang, items], index) => {
        const row = document.createElement('div');
        row.className = 'search-row';
        row.dataset.lang = lang;
        row.style.display = lang === currentLang ? "block" : "none"

        const quick = document.createElement('div');
        quick.className = 'quick-search';

        items.forEach(item => {

            let tagName = "a"

            const a = document.createElement(tagName);
            a.href = '#';
            a.className = 'search-item search-item-button';
            a.dataset.search = item.keywords;
            a.setAttribute("data-action", item.action)

            if (item.targetLang) {
                a.dataset.lang = item.targetLang
            }


            const img = document.createElement('img');
            img.src = chrome.runtime.getURL(item.icon);

            a.appendChild(img);
            quick.appendChild(a);
        });

        row.appendChild(quick);
        container.prepend(row);
    });


}

/**
 * Send to background
 */

function pingServiceWorker() {
    chrome.runtime.sendMessage("ContentJS: Wake up baby", function (response) {
        console.log(response);
    });
}


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

function init() {
    document.querySelector(".particle-loader-wrapper").style.display = "block"
    const canvas = document.getElementById('particle-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 7;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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
        layers.push({ points, uniforms: material.uniforms, settings });
    }

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    setupSVG();
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

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const now = performance.now();

    for (let l = 0; l < layers.length; l++) {
        const layer = layers[l];
        if (layer.type === 'binary') {
            const { binaryLayer, settings } = layer;
            for (let i = 0; i < settings.particleCount; i++) {
                binaryLayer.radii[i] += settings.outwardSpeed * 0.01;
                if (binaryLayer.radii[i] > 3.5) binaryLayer.radii[i] = 0;
                let ripple = settings.ripple ? Math.sin(now * 0.001 * settings.rippleSpeed + binaryLayer.angles[i] * 4.0) * 0.5 : 0;
                const r = binaryLayer.radii[i] + ripple;
                binaryLayer.points[i].position.set(Math.cos(binaryLayer.angles[i]) * r, Math.sin(binaryLayer.angles[i]) * r, 0);
                binaryLayer.points[i].material.opacity = (binaryLayer.radii[i] > 2.0) ? binaryLayer.opacities[i] * (1.0 - (binaryLayer.radii[i] - 2.0) / 1.5) : binaryLayer.opacities[i];
            }
        } else {
            layer.uniforms.uTime.value += 0.016;
            layer.uniforms.uRotation.value += layer.settings.rotationSpeed;
            layer.uniforms.uMouse.value.set(mouse.x, mouse.y);
        }
    }
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

