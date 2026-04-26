// src/dom/videoMode.js

function ensureOverlay() {
    const container = document.querySelector("#player-container-inner");
    if (!container) return;

    let overlay = container.querySelector(".player-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "player-overlay";
        container.appendChild(overlay);
    }

    return overlay;
}

export function exitVideoMode() {
    document.body.classList.remove("fullscreen");
    document.body.classList.add("controls-visible");
    document.body.classList.add("search-mode");

    // force layout recalculation
    window.dispatchEvent(new Event("resize"));
}

export function enterVideoMode() {
    const body = document.body;

    body.classList.add("fullscreen");
    body.classList.remove("controls-visible");
    body.classList.remove("search-mode");

    ensureOverlay();

    // force layout update
    window.dispatchEvent(new Event("resize"));
}

export function pauseVideo() {
    let video = document.querySelector("video.video-stream");
    if(video) video.pause();
}
export function playVideo() {
    let video = document.querySelector("video.video-stream");
    if(video) video.play();
}
