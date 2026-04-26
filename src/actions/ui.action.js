// src/actions/video.dom.js

import { on } from "../core/bus.js";
import { exitVideoMode } from "../ui/dom/video.dom.js";

export function initUIAction() {
    on("intent:exitVideoMode", () => {
        exitVideoMode();
    });
}
