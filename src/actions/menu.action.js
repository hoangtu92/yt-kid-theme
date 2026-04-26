import {on} from "../core/bus";
import {renderQuickSearchMenu, updateMenu} from "../ui/dom/menu.dom";

/**
 * Init menu system
 */
export function initMenu() {
    on("video:ready", async () => {
        const container = document.querySelector("#secondary-results"); // or your custom root
        await renderQuickSearchMenu(container);
    });

    on("video:list", async () => {
        const container = document.querySelector("#top-row.masthead-row"); // or your custom root
        await renderQuickSearchMenu(container);
    });

    // react to language change
    on("action:switchLanguage", () => {
        setTimeout(updateMenu, 50);
    });
}
