let currentText = '';
window.addEventListener("load", async function (e) {
    pingServiceWorker();

    document.body.append(htmlToElement(`<div class="particle-loader-wrapper" style="display: none">
        <canvas id="particle-canvas"></canvas>
        <div id="center-svg-container"></div>
    </div>`))

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();


    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;

        // Only update if text actually changed
        if (text !== currentText) {
            currentText = text;
            updateText(currentText)
        }

        await searchVideo(text);
    };

    recognition.onerror = async (err) => {
        let lang = await getLanguage();
        await speak(translate[lang]["cannot_hear_you"], lang);
        await searchVideo(translate[lang]["default_search"])
    }

    recognition.onstart = function (e){
        recognition.starting = true;
    }
    recognition.onend = function (e){
        recognition.starting = false;
        destroy();
        document.querySelector(".particle-loader-wrapper").style.display = "none"
    }

    // expose function so popup can trigger it
    window.startVoiceSearch = async () => {

        let lang = await getLanguage();
        recognition.lang = lang;
        recognition.continuous = false;
        recognition.interimResults = false;

        if (!recognition.starting) {
            await init();
            await speak(translate[lang]["what_to_watch"], lang);
            setTimeout(() => {

                recognition.start();
            });



        } else {
            console.log("Recognition is still open")
        }
    };



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

document.addEventListener("pointerdown", async function (e) {

    if(e.target.className.includes("search-item-button")){

        let video = document.querySelector("video.video-stream");
        if(video) video.pause();

        let action = e.target.getAttribute("data-action");

        switch (action){
            case "switchLanguage":
                let targetLang = e.target.dataset.lang;
                changeLanguage(targetLang)

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
