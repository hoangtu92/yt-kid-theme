// src/actions/search.action.js

import {emit, on} from "../core/bus.js";
import {getLang} from "../core/config";
import {getLanguagePack} from "../core/i18n";
import {performSearch} from "../ui/dom/search.dom";


/**
 * Init action listeners
 */
export function initSearchAction() {
    let lastQuery = "";


    on("intent:search", async (text) => {
        if (!text) return;

        lastQuery = text;

        if (text === "default_search") {
            let lang = await getLang();
            let languagePack = getLanguagePack(lang.speech);
            text = languagePack[text];
        }

        emit("ui:speak", text);

        performSearch(text);
    });

}
