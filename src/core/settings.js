// src/core/settings.js

export function getSetting(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (res) => {
            resolve(res?.[key]);
        });
    });
}

export function setSetting(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve(true);
        });
    });
}
