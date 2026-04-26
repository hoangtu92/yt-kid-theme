// src/actions/video.js

import { on } from "../core/bus.js";
import {enterVideoMode, exitVideoMode, pauseVideo, playVideo} from "../dom/videoMode.js";

export function initVideoActions() {

    on("media:pause", () => {
        pauseVideo();
    })

    on("media:play", () => {
        playVideo();
    })

    on("video:ready", () => {
        enterVideoMode();
    });

    on("video:list", async () => {
        exitVideoMode();
    });
}
