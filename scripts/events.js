window.addEventListener("load", function (e) {
    pingServiceWorker();

    changeLanguage("en-US")

    let lang = getLanguage();
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        await searchVideo(text);
    };

    recognition.onerror = async (err) => {
        console.error(err);

        let lang = getLanguage();
        await speak(translate[lang]["cannot_hear_you"], lang)

        await searchVideo(translate[lang]["default_search"])

    };

    // expose function so popup can trigger it
    window.startVoiceSearch = () => {
        recognition.start();
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

/**
 * Language selection
 */
document.addEventListener('click',  async (e) => {
    pingServiceWorker();

    if (e.target.name === "lang" && e.target.checked) {

        let lang = e.target.value;

        console.log(lang);

        changeLanguage(lang)

        await speak(translate[lang]["role_change"], lang)
    }
})


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

        if(e.target.getAttribute("data-action") === 'voiceRecognition'){

            let video = document.querySelector("video.video-stream");
            if(video) video.pause();

            let lang = getLanguage();
            await speak(translate[lang]["what_to_watch"], lang)

            startVoiceSearch()
        }
        else{
            let searchIcon = document.querySelector("#search-icon");
            fillSearchResult(e);

            const handler = (evt) => {

                setTimeout(() => {
                    searchIcon.click()
                }, 0); // or 50ms if needed
                document.removeEventListener('pointerup', handler);
                triggerTouch(searchIcon, 'touchend', evt);
            };

            document.addEventListener('pointerup', handler);

        }

    }

});
