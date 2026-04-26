import createAudioSystem from "./audio";
import createEngine from "./engine";
import {destroyLayers} from "./layers";
import {animate} from "./renderer";

export function initParticleRoot(canvas) {

    const ctx = createContext();
    const audio = createAudioSystem();
    const engine = createEngine(ctx);

    async function bootstrap() {

        await audio.init();
        engine.init(canvas);        // subscribe to audio events

        animate(ctx);            // 🔥 start render loop here
    }

    return {
        ctx,
        audio,
        engine,
        bootstrap,
        destroy() {
            audio.destroy?.();
            engine.destroy();
            destroyLayers(ctx);
        }
    };
}

function createContext() {
    return {
        scene: null,
        camera: null,
        renderer: null,
        layers: [],
        voiceLevel: 0,
        mouse: { x: 0, y: 0 }
    };
}
