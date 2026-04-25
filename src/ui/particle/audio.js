import {emit} from "../../core/bus";

export default function createAudioSystem() {

    let audioCtx;
    let analyser;
    let mic;
    let dataArray;

    async function init() {
        await initMic();
        startLoop();
    }

    async function initMic() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);

        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;

        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    function getLevel() {

        if (!analyser) return 0;

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }

        return (sum / dataArray.length) / 255;
    }

    function startLoop() {
        const tick = () => {

            let level = getLevel();

            emit("audio:level", level);

            requestAnimationFrame(tick);
        };

        tick();
    }

    function destroy() {

        mic?.disconnect();
        analyser?.disconnect();

        audioCtx?.close();

        audioCtx = null;
        analyser = null;
        mic = null;
        dataArray = null;
    }

    return {
        init,
        getLevel,
        destroy
    };
}
