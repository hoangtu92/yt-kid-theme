// src/actions/navigation.dom.js

import { on } from "../core/bus.js";
import {hideNav, showNav, toggleNav, watchItAgain} from "../ui/dom/navigation.dom.js";
import {isAutoPlay} from "../ui/dom/video.dom";

export function initNavigationAction() {
    on("intent:showNav", () => {
        showNav();
    });
    on("intent:hideNav", () => {
        hideNav();
    });
    on("intent:toggleNav", () => {
        toggleNav();
    });

    on("media:paused", () => {
        if(!isAutoPlay()){
            showNav();
        }
    });

    on("media:play", () => {
        hideNav();
    });

    on("voice:error", () => {
        watchItAgain();
    });
}
