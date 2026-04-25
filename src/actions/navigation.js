// src/actions/navigation.js

import { on } from "../core/bus.js";
import {hideNav, showNav, toggleNav} from "../dom/navigation.js";

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
        showNav();
    });

    on("media:play", () => {
        hideNav();
    });

    on("media:ended", () => {
        showNav();
    });
}
