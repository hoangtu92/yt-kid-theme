// src/index.js

import {initActions} from "./actions";
import {initUI} from "./ui";

window.YKT = {
    autoplay: false,
};

(async () => {
    // init app
    initUI();
    initActions();
})();
