// src/core/runtime/messaging.js

export function pingServiceWorker() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: "PING" },
            (response) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve(response);
            }
        );
    });
}
