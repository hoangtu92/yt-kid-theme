import createAudioSystem from "./audio";
import createEngine from "./engine";
import {destroyLayers} from "./layers";

export function initParticleRoot(canvas) {

    const ctx = createContext();
    const audio = createAudioSystem();
    const engine = createEngine(ctx, audio);

    engine.init(canvas);

    return {
        ctx,
        engine,
        audio,

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
