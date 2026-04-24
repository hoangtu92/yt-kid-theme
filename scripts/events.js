window.addEventListener("load", async function (e) {
    pingServiceWorker();

    document.body.append(htmlToElement(`<div class="particle-loader-wrapper" style="display: none">
        <canvas id="particle-canvas"></canvas>
        <div id="center-svg-container"></div>
    </div>`))

    // expose function so popup can trigger it
    window.startVoiceSearch = async () => {
        await initRecognition();

        // 👉 nếu đang chạy → abort
        if (isRunning || isStarting) {
            recognition.abort();
            await waitForEndSafe();
        }

        let lang = await getLanguage();

        await initParticle();

        await speak(translate[lang]["what_to_watch"], lang);

        await delay(400); // 🔥 fix miss voice

        recognition.lang = lang;

        try {
            isStarting = true;
            recognition.start();
        } catch (e) {
            isStarting = false;
            console.warn("Start failed:", e);
        }
    };

});

document.addEventListener("pointerdown", async function (e) {

    if(e.target.className.includes("search-item-button")){

        let video = document.querySelector("video.video-stream");
        if(video) video.pause();

        let action = e.target.getAttribute("data-action");

        switch (action){
            case "switchLanguage":
                let targetLang = e.target.dataset.lang;
                changeLanguage(targetLang);

                await speak(translate[targetLang]["language_change"], targetLang)
                break;
            case "voiceRecognition":
                await startVoiceSearch()
                break;
            default:
                let searchIcon = document.querySelector("#search-icon");
                fillSearchResult(e);

                const handler = (evt) => {
                    document.removeEventListener('pointerup', handler);

                    if(isTouchDevice()){
                        triggerTouch(searchIcon, 'touchstart', evt);
                        triggerTouch(searchIcon, 'touchend', evt);
                    }
                    else{
                        setTimeout(() => {
                            searchIcon.click()
                        }, 0); // or 50ms if needed
                    }

                };

                document.addEventListener('pointerup', handler);

                break;
        }


    }

});


document.addEventListener('pointerdown',  async (e) => {
    //video.currentTime += 20;
    if(e.target.className.includes("player-overlay")){
        toggleNav();
    }

});
document.addEventListener('pause',  async (e) => {
    if(e.target.tagName === "VIDEO"){
        showNav();
    }
}, true);
document.addEventListener('play',  async (e) => {
    if(e.target.tagName === "VIDEO"){
        hideNav();
    }
}, true);

document.addEventListener('yt-playback-ended',  async (e) => {
    if(e.target.tagName === "YTK-PLAYER"){
        showNav();
    }
}, true);


document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

document.addEventListener('dblclick', function (event) {
        event.preventDefault();
        event.stopPropagation();
    }, true //capturing phase!!
);

document.addEventListener('drag', function (event) {
    event.preventDefault();
    event.stopPropagation();
}, true);
