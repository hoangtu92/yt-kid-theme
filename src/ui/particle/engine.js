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

    function disposeMaterial(material) {

        // Dispose textures
        for (const key in material) {

            const value = material[key];

            if (value && value.isTexture) {
                value.dispose();
            }
        }

        material.dispose();
    }

    function destroy() {

        cancelAnimationFrame(animationFrameId);

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("click", onWindowClick);

        for (const layer of layers) {
            layer.destroy?.();
        }

        if (scene) {

            scene.traverse((obj) => {

                // Geometry
                if (obj.geometry) {
                    obj.geometry.dispose();
                }

                // Material
                if (obj.material) {

                    // Multiple materials
                    if (Array.isArray(obj.material)) {

                        obj.material.forEach(mat => disposeMaterial(mat));

                    } else {

                        disposeMaterial(obj.material);

                    }
                }
            });

            // Remove all children
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
        }

        if (renderer) {

            renderer.renderLists.dispose();

            renderer.dispose();

            // 🔥 VERY IMPORTANT
            renderer.forceContextLoss();

            renderer.domElement = null;

            renderer = null;
        }

        // --- Dispose camera ---

        scene = null;
        camera = null;
        renderer = null;
        layers = [];

        const canvas = document.getElementById('particle-canvas');

        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    }

    return {
        init,
        updateText,
        destroy
    };
}
