/**
 * Listen to background event message
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Receive background message: ", message)
    switch (message.action) {
        case "video_ready":

            let nav = document.querySelector("#secondary-results");
            let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);
            document.querySelector("#player-container-inner").append(playerOverlay);
            renderSearch(nav, searchData);

            enterFullscreen();
            break;
        case "video_list":
            let lang = getLanguage();
            await speak(`${translate[lang]["found_it"]}: ${message.speak}`, lang)
            break;

    }
    sendResponse("Content: ", message.action + " Ok");
});



