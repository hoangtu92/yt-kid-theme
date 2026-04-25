// src/content.js

import {initActions} from "../actions";
import {initDomEvents} from "../dom/events";
import {initParticles} from "../ui/particle";
import {initUI} from "../ui";

(async () => {


    initParticles();

    initDomEvents();

    // init app
    initUI();

    initActions();
})();
