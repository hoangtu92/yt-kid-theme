export default function createAudioSystem() {

    let audioCtx;
    let analyser;
    let mic;
    let dataArray;

    async function init() {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioCtx = new AudioContext();

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        mic = audioCtx.createMediaStreamSource(stream);
        mic.connect(analyser);

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
