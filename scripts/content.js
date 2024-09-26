let video, container, videoWidth, videoHeight, videoLeft, videoTop, nav, search, anchorRow;

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

if(isTouchDevice()){
    console.log("Touch device")
    new TouchEmulator();
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
                toggleNav();
            });
            document.querySelector("#player-container-inner").append(playerOverlay);




            let quickSearch = htmlToElement(`<div id="quick-search">
<a data-search="Baby Sensory Video" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/bear.png")}"/></a>

<a data-search="Rachel's English" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/teacher.png")}"/></a>
<a data-search="Wheel on the Bus, Bingo, Twinkle Twinkle Little star, Finger family" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/dancing.png")}"/></a>

<a data-search="Fruit slice, animal name" class="search-item search-item-button" href="#"><img src="${chrome.runtime.getURL("img/strawberry.png")}"/></a>

</div>`);

            nav.prepend(quickSearch);

            document.querySelectorAll("a.search-item").forEach((o) => {
                o.onclick = function (e){
                    e.preventDefault();
                    document.querySelector("input.style-scope.ytk-search-box").value = e.currentTarget.getAttribute("data-search")
                    document.body.classList.add("search-mode");
                    document.querySelector("#search-icon").click()
                };
            })

        }
    }
};
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



let timeout, interval;

const enterFullscreen = function (){
    document.body.classList.add("fullscreen");
    document.body.classList.remove("search-mode");
    window.dispatchEvent(new Event('resize'));

}
function hideNav(){
    nav.style.display = "none";
    //search.style.cssText = "display: none !important";
}
function showNav(){
    nav.style.display = "block";
    //search.style.cssText = "display: flex !important"
}

const toggleNav = function (e) {
    if (nav.style.display == "block") {
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

