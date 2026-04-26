import {on} from "../../core/bus";
import {initParticleRoot} from "./root";
import {ensureParticleWrapper} from "./dom";

let particle = null;

export function initParticles() {

    let particleDom = ensureParticleWrapper();
    let hasError = false;

    // ----------------------------
    // EVENT BUS SUBSCRIPTIONS
    // ----------------------------

    on("ui:particle:start", async () => {
        hasError = false;
        particle = initParticleRoot(particleDom.canvas);
        await particle.bootstrap();
        particleDom.wrapper.style.display = "block";
    });

    on("ui:particle:stop", async () => {
        particleDom.wrapper.style.display = "none";
        particle?.destroy();
        particle = null;
    });

    on("ui:text:update", async (interim) => {
        particle.engine.updateText(interim)
    });

    on("voice:error", async () => {
        hasError = true;
    });
}
