import {clickEl} from "./helpers.dom";

export function setSearchInput(text) {
    const input = document.querySelector("input.style-scope.ytk-search-box");
    if (!input) return;

    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Pure DOM-level search (your original logic, cleaned)
 */
export function performSearch(text) {
    setSearchInput(text)
    clickEl("#search-icon");
}
