import * as THREE from "three";
import {createTextMesh, updateTextMesh} from "./text";
import {createParticleLayers} from "./layers";
import {emit, on} from "../../core/bus";

export default function createEngine(ctx) {

    let scene, camera, renderer;
    let layers = [];
    let textMesh;
    let animationFrameId = null;
    let mouse = { x: 0, y: 0 };
    let voice = 0;

    function init(canvas) {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 7;

        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        textMesh = createTextMesh("LISTENING");
        scene.add(textMesh);

        layers = createParticleLayers(scene);

        ctx.scene = scene;
        ctx.camera = camera;
        ctx.renderer = renderer;
        ctx.layers = layers;
        ctx.textMesh = textMesh;

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onWindowResize);
        window.addEventListener("click", onWindowClick);

        on("audio:level", (level) => {
            // smoothing happens here
            voice = voice * 0.85 + level * 0.5;
            ctx.voiceLevel = voice;
        });

    }

    function updateText(text){
        updateTextMesh(ctx.textMesh, text);
    }

    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        ctx.camera.aspect = window.innerWidth / window.innerHeight;
        ctx.camera.updateProjectionMatrix();
        ctx.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onWindowClick(e){
        if(e.target.tagName === "CANVAS"){
            emit("action:stopRecognition")
        }

    }

    function destroy() {

        cancelAnimationFrame(animationFrameId);

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("click", onWindowClick);

        for (const layer of layers) {
            layer.destroy?.();
        }

        renderer?.dispose();

        // --- Dispose camera ---

        scene = null;
        camera = null;
        renderer = null;
        layers = [];
    }

    return {
        init,
        updateText,
        destroy
    };
}
