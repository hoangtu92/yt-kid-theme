// src/content.js
import "./runtimeListener.js";

import { pingServiceWorker } from "../core/runtime/messaging.js";
import {initActions} from "../actions";
import {initDomEvents} from "../dom/events";
import {initParticles} from "../ui/particle";
import {initUI} from "../ui";

(async () => {
    try {
        await pingServiceWorker();
        console.log("Service worker ready");
    } catch (e) {
        console.warn("SW not reachable", e);
    }

    initParticles();

    // init app
    initUI();
    initDomEvents();
    initActions();
})();
