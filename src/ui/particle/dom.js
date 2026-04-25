export function ensureParticleWrapper() {

    let wrapper = document.querySelector(".particle-loader-wrapper");
    const canvas = document.createElement("canvas");

    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "particle-loader-wrapper";
        wrapper.style.display = "none";

        canvas.id = "particle-canvas";

        const svgContainer = document.createElement("div");
        svgContainer.id = "center-svg-container";

        wrapper.appendChild(canvas);
        wrapper.appendChild(svgContainer);

        document.body.appendChild(wrapper);
    }

    return { wrapper, canvas };
}

export function destroyParticleDom() {

    const container = document.getElementById('center-svg-container');
    if (container) container.innerHTML = '';

    const canvas = document.getElementById('particle-canvas');

    if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');

        if (gl?.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').loseContext();
        }
    }
}
