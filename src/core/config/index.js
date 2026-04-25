// src/core/config/index.js

import { defaultConfig } from "./defaults.js";
import { getSetting } from "../settings.js";

/**
 * Get merged config (default + user override)
 */
export async function getConfig() {
    const stored = await getSetting("config");

    if (!stored) return defaultConfig;

    return deepMerge(defaultConfig, stored);
}

/**
 * Get only language
 */
export async function getLang() {
    const config = await getConfig();
    return config.lang;
}

export async function setLang(lang) {
    const config = await getConfig();

    const newConfig = {
        ...config,
        lang: {
            ...config.lang,
            speech: lang
        }
    };

    await chrome.storage.local.set({ config: newConfig });

    return newConfig;
}
/**
 * Deep merge helper
 */
function deepMerge(base, override) {
    const result = { ...base };

    for (const key in override) {
        if (
            typeof override[key] === "object" &&
            !Array.isArray(override[key])
        ) {
            result[key] = deepMerge(base[key] || {}, override[key]);
        } else {
            result[key] = override[key];
        }
    }

    return result;
}
