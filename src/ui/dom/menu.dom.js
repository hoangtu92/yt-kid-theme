// src/ui/menu/menu.dom.js

import { emit} from "../../core/bus.js";
import { getLang } from "../../core/config";
import { searchPresets } from "../../core/presets/search.js";

/**
 * Render menu (build DOM once)
 */
export async function renderQuickSearchMenu(container) {
    container.querySelectorAll(".search-row").forEach(e => e.parentNode.removeChild(e));

    const { speech: currentLang } = await getLang();

    Object.entries(searchPresets).forEach(([langKey, items]) => {

        const row = document.createElement("div");
        row.className = "search-row";
        row.dataset.lang = langKey;
        row.style.display = langKey === currentLang ? "block" : "none";

        const quick = document.createElement("div");
        quick.className = "quick-search";

        items.forEach(item => {
            const btn = document.createElement("a");
            btn.href = "#";
            btn.className = "search-item search-item-button";

            btn.dataset.type = item.type;

            btn.onclick = (e) => {
                e.preventDefault();

                emit("media:pause");

                if (item.type === "search") {
                    emit("intent:search", item.query);
                }

                if (item.type === "action") {
                    emit("action:" + item.action, item);
                }
            };

            const img = document.createElement("img");
            img.src = chrome.runtime.getURL(`assets/img/${item.icon}`);

            btn.appendChild(img);
            quick.appendChild(btn);
        });

        row.appendChild(quick);
        container.prepend(row);
    });
}

/**
 * Update menu (switch visible language)
 */
export async function updateMenu() {
    const { speech: lang } = await getLang();

    document.querySelectorAll(".search-row").forEach(row => {
        row.style.display = row.dataset.lang === lang ? "block" : "none";
    });
}


