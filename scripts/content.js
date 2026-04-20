let video, container, videoWidth, videoHeight, videoLeft, videoTop, nav, search, anchorRow;
function speak(text) {
    const voices = speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(v => v.lang === 'vi-VN');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN'; // or 'vi-VN'
    utterance.voice = vietnameseVoice;

    speechSynthesis.speak(utterance);
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang = 'vi-VN';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    let searchIcon = document.querySelector("#search-icon");
    let input = document.querySelector("input.style-scope.ytk-search-box")
    if (input) {
        input.value = text;

        speak("Ok, để mẹ tìm cho nhé")

        searchIcon.click();
    }

    console.log(text);
};

recognition.onerror = (err) => {
    console.error(err);
};



// expose function so popup can trigger it
window.startVoiceSearch = () => {
    recognition.start();
};





function clickSearch(e){
    console.log(e)
    if(e.target.getAttribute("data-action") === "startMic") {
        speak("Hello, Con muốn xem gì nào?");
        recognition.start();
    }
    else
    document.querySelector("input.style-scope.ytk-search-box").value = e.currentTarget.getAttribute("data-search")

}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * trigger a touch event
 * @param eventTarget
 * @param eventName
 * @param mouseEv
 */
function triggerTouch(eventTarget, eventName, mouseEv) {

    const touchObj = new Touch({
        identifier: Date.now(),
        target: eventTarget,
        clientX: mouseEv.clientX,
        clientY: mouseEv.clientY,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
    });

    let touchEvent = new TouchEvent(eventName, {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [touchObj],
        changedTouches: [touchObj],
        shiftKey: true,
        altKey: mouseEv.altKey,
        ctrlKey: mouseEv.ctrlKey,
    });

    eventTarget.dispatchEvent(touchEvent);
}

const enterFullscreen = function (){
    document.body.classList.add("fullscreen");
    document.body.classList.remove("search-mode");
    window.dispatchEvent(new Event('resize'));

}
function hideNav(){
    nav.style.display = "none";
    document.body.classList.remove("search-mode");
}
function showNav(){
    nav.style.display = "block";
    document.body.classList.add("search-mode");
}

const toggleNav = function (e) {
    if (nav.style.display === "block") {
        hideNav()
    } else {
        showNav();
    }
}

function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


/**
 * Send to background
 */

function pingServiceWorker() {
    chrome.runtime.sendMessage("ContentJS: Wake up baby", function (response) {
        console.log(response);
    });
}


function initYtTheme (request) {


    if (!video && !container) {

        video = document.querySelector("video.video-stream");
        container = document.querySelector("ytk-player");
        nav = document.querySelector("#secondary-results");
        search = document.querySelector("#masthead");

        if (video && container) {

            videoWidth = video.clientWidth;
            videoHeight = video.clientHeight;

            video.addEventListener("pause", function () {
                showNav();
            });

            video.addEventListener("play", function () {
                hideNav();
            });

            container.addEventListener("yt-playback-ended", function (e) {
                showNav();
            })

            let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);
            playerOverlay.addEventListener("click", function (){
                //video.currentTime += 20;
                toggleNav();
            });



            let xDown = null;
            let yDown = null;

            function getTouches(evt) {
                return evt.touches ||             // browser API
                    evt.originalEvent.touches; // jQuery
            }

            function handleTouchStart(evt) {
                const firstTouch = getTouches(evt)[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            }


            playerOverlay.addEventListener("touchstart", handleTouchStart);
            playerOverlay.addEventListener("touchmove", function (evt){
                if ( ! xDown || ! yDown ) {
                    return;
                }

                let xUp = evt.touches[0].clientX;
                let yUp = evt.touches[0].clientY;

                let xDiff = xDown - xUp;
                let yDiff = yDown - yUp;

                if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                    if ( xDiff > 0 ) {
                        /* left swipe */
                        console.log("Left swipe")
                    } else {
                        /* right swipe */
                        console.log("Right swipe")

                    }
                } else {
                    if ( yDiff > 0 ) {
                        /* up swipe */
                        console.log("Up swipe")


                    } else {
                        /* down swipe */
                        console.log("Down swipe")
                        showNav();
                    }
                }
                /* reset values */
                xDown = null;
                yDown = null;
            });

            document.querySelector("#player-container-inner").append(playerOverlay);




            let quickSearch = htmlToElement(`<div id="quick-search">
<a data-search="Nhạc thiếu nhi, Kids songs" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/music.gif")}"/></a>
<a data-search="Disney, cartoon, 3D animated, hoạt hình" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/watching-movie.gif")}"/></a>
 
<a data-search="learn English, học nói, learn to speak" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/teacher.gif")}"/></a>

<a data-search="Painting, color, drawing" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/creativity.gif")}"/></a>
<a data-search="outdoor, fun game" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/children.gif")}"/></a>
<a class="search-item-button search-item" data-action="startMic" href="#"><img data-action="startMic" src="${chrome.runtime.getURL("img/podcast.gif")}"/></a>

</div>`);

            nav.prepend(quickSearch);

            let searchIcon = document.querySelector("#search-icon");
            searchIcon.addEventListener("touchstart", (e) => {
                console.log("Touch Start", e)
            })
            searchIcon.addEventListener("touchend", (e) => {
                console.log("Touch End", e)
            })


            document.querySelectorAll("a.search-item-button").forEach((o) => {

                if(isTouchDevice()){
                    console.log("Touch device")

                    o.addEventListener("touchstart", (e) => {
                        clickSearch(e)
                        triggerTouch(searchIcon, 'touchstart', e);
                    })

                    o.addEventListener("touchend", (e) => {
                        triggerTouch(searchIcon, 'touchend', e);
                    })

                    o.addEventListener("mousedown", (e) => {
                        clickSearch(e)
                        triggerTouch(searchIcon, 'touchstart', e);
                    })

                    o.addEventListener("mouseup", (e) => {
                        triggerTouch(searchIcon, 'touchend', e);
                    })
                }
                else{
                    o.onclick = function (e){
                        e.preventDefault();
                        clickSearch(e)
                        searchIcon.click();
                    };
                }


            })

        }
    }
}
/**
 * Listen to background event message
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Receive background message: ", message)
    switch (message.action) {
        case "video_ready":
            initYtTheme(message.request)
            enterFullscreen();
            break;
    }
    sendResponse("Content: ", message.action + " Ok");
});

window.addEventListener("keyup", function (e){
    console.log(e);
    switch(e.key){
        case "ArrowDown":
            showNav();
            break;
    }
})


window.addEventListener("load", function (e) {
    pingServiceWorker();
})

window.addEventListener("click", function (e) {
    pingServiceWorker();
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
