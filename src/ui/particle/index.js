import {on} from "../../core/bus";
import {initParticleRoot} from "./root";
import {ensureParticleWrapper} from "./dom";
import {getLang} from "../../core/config";
import {getLanguagePack} from "../../core/i18n";
import {delay} from "../../dom/utils";

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
        particleDom.wrapper.style.display = "block";
    });

    on("ui:particle:stop", async () => {
        if (hasError) {
            const {speech: lang} = await getLang();

            const languagePack = getLanguagePack(lang);
            particle.engine.updateText(languagePack['default_search']);

            await delay(2000);
        }
        particleDom.wrapper.style.display = "none";
        particle.destroy();
        particle = null;
    });

    on("ui:text:update", async (interim) => {
        console.log("text", interim)
        particle.engine.updateText(interim)
    });

    on("voice:error", async () => {
        console.log("error")
        hasError = true;
    });
}
