window.addEventListener("load", async function (e) {
    pingServiceWorker();

    document.body.append(htmlToElement(`<div class="particle-loader-wrapper" style="display: none">
        <canvas id="particle-canvas"></canvas>
        <div id="center-svg-container"></div>
    </div>`))

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

                await updateMenu();

                await speak(translate[targetLang]["language_change"], targetLang);

                break;
            case "voiceRecognition":
                await startVoiceSearch()
                break;
            default:

                fillSearchResult(e);

                let searchIcon = document.querySelector("#search-icon");

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
    }, true
);

document.addEventListener('drag', function (event) {
    event.preventDefault();
    event.stopPropagation();
}, true);
