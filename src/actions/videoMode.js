// src/actions/videoMode.js

import { on } from "../core/bus.js";
import { exitVideoMode } from "../dom/videoMode.js";

export function initVideoModeAction() {
    on("intent:exitVideoMode", () => {
        exitVideoMode();
    });
}
