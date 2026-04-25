import * as THREE from "three";

/**
 *
 * @param text
 * @returns
 */
export function createTextMesh(text) {
    const texture = createTextTexture(text);

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

/**
 *
 * @param textMesh
 * @param text
 */
export function updateTextMesh(textMesh, text) {
    if (!textMesh) return;

    const newTexture = createTextTexture(text);

    // 🔥 dispose old texture to avoid memory leak
    if (textMesh.material.map) {
        textMesh.material.map.dispose();
    }

    textMesh.material.map = newTexture;
    textMesh.material.needsUpdate = true;
}

/**
 *
 * @param text
 * @param color
 * @returns {CanvasTexture}
 */
export function createSingleTextTexture(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '50px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = color; ctx.fillText(text, 32, 32);
    let texture = new THREE.CanvasTexture(canvas);
    texture.flipY = true;
    texture.premultiplyAlpha = false;
    texture.needsUpdate = true;
    return texture;
}


/**
 *
 * @param text
 * @returns {CanvasTexture}
 */
export function createTextTexture(text) {
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

    let texture = new THREE.CanvasTexture(canvas);
    texture.flipY = true;
    texture.premultiplyAlpha = false;
    texture.needsUpdate = true;
    return texture;
}
