import { emit } from "../core/bus.js";

/**
 * Bridge: background → content
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Receive background message:", message);

    switch (message.action) {
        case "video_ready":
            emit("video:ready", message);
            break;

        case "video_list":
            emit("video:list", message);
            break;
    }

    sendResponse({ ok: true });
});
