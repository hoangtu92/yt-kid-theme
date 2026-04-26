// src/dom/events.dom.js

import { emit } from "../../core/bus.js";

export function initDomEvents() {

    document.addEventListener("yt-search-box-update", (e) => {
        emit("ui:speak", e.detail.query);
    });

    document.addEventListener("ytk-page-updated", (e) => {
        const params = new URL(window.location.href);

        switch(params.pathname){
            case "/watch":
                emit("video:ready", e);
                break;
            default:
                emit("video:list", e);
                break;
        }
    });


    // 🔥 SEARCH TRIGGER (pointerup handling)
    document.addEventListener("pointerup", (e) => {
        emit("ui:pointerup", e);
    });


    // 🔥 PLAYER OVERLAY CLICK
    document.addEventListener("pointerdown", (e) => {
        if (e.target.classList?.contains("player-overlay")) {
            emit("intent:toggleNav");
        }
    });


    // 🔥 MEDIA EVENTS
    document.addEventListener("pause", (e) => {
        if (e.target.tagName === "VIDEO") {
            emit("media:paused");
        }
    }, true);

    document.addEventListener("play", (e) => {
        if (e.target.tagName === "VIDEO") {
            emit("media:play");
            emit("action:stopRecognition")
        }
    }, true);

    document.addEventListener("yt-playback-ended", (e) => {
        if (e.target.tagName === "YTK-PLAYER") {
            emit("media:ended");
        }
    }, true);


    // 🔥 BLOCK USER INTERACTIONS (kiosk mode)
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("dblclick", (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, true);

    document.addEventListener("drag", (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, true);


    window.addEventListener("wheel", (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
}
