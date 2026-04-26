// src/actions/video.action.js

import { on } from "../core/bus.js";
import {
    ensureAutoPlay,
    enterVideoMode,
    exitVideoMode,
    pauseVideo,
    playFirstVideo,
    playVideo
} from "../ui/dom/video.dom.js";

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

    on("video:list", () => {
        playFirstVideo();
    });

    on("ui:pointerup", () => {
        ensureAutoPlay();
    })
}
