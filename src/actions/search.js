// src/actions/search.js

import { on } from "../core/bus.js";
import { isTouchDevice, triggerTouch} from "../dom/utils";
import {getLang} from "../core/config";
import {getLanguagePack} from "../core/i18n";

let lastEvt = null;
/**
 * Pure DOM-level search (your original logic, cleaned)
 */
function performSearch(text) {
    const input = document.querySelector("input.style-scope.ytk-search-box");

    if (!input) return false;

    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true })); // important

    return true;
}


// 🔧 keep internal (not exported)
function triggerSearch(evt) {
    const searchIcon = document.querySelector("#search-icon");
    if (!searchIcon) return;

    if (isTouchDevice()) {
        triggerTouch(searchIcon, 'touchstart', evt);
        triggerTouch(searchIcon, 'touchend', evt);
    } else {
        setTimeout(() => searchIcon.click(), 0);
    }
}

/**
 * Init action listeners
 */
export function initSearchAction() {
    let lastQuery = "";


    on("intent:search", async (text) => {
        if (!text) return;

        console.log("Search for: ", text)
        lastQuery = text;

        if (text === "default_search") {
            let lang = await getLang();
            let languagePack = getLanguagePack(lang.speech);
            text = languagePack[text];
        }

        performSearch(text);

        if (lastEvt) {
            triggerSearch(lastEvt);
            lastEvt = null;
        }
    });

    on("ui:pointerup", (evt) => {
        if (evt.target.classList?.contains("search-item")) {
            triggerSearch(evt);
            lastEvt = evt;
            lastQuery = "";
        }
    });
}
