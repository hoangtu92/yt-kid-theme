// src/actions/video.js

import { on } from "../core/bus.js";
import {enterVideoMode, exitVideoMode, pauseVideo} from "../dom/videoMode.js";

export function initVideoActions() {

    on("media:pause", () => {
        pauseVideo();
    })

    on("video:ready", () => {
        enterVideoMode();
    });

    on("video:list", async () => {
        exitVideoMode();
    });
}
