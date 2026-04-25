// src/actions/video.js

import { on } from "../core/bus.js";
import {enterVideoMode, exitVideoMode, pauseVideo} from "../dom/videoMode.js";
import { speak } from "../services/speech.js";
import {getLang} from "../core/config";

export function initVideoActions() {

    on("media:pause", () => {
        pauseVideo();
    })

    on("video:ready", () => {
        enterVideoMode();
    });

    on("video:list", async (message) => {
        exitVideoMode();

        if (message.speak) {
            let lang = await getLang();
            await speak(message.speak, lang.speech);
        }
    });
}
