/**
 * Listen to background event message
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Receive background message: ", message)
    let container;
    switch (message.action) {

        case "video_ready":

            container = document.querySelector("#secondary-results")
            container.querySelectorAll(".search-row").forEach(e => e.parentNode.removeChild(e))

            document.body.classList.remove("controls-visible");
            if(!document.querySelector("#player-container-inner .player-overlay")){
                let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);
                document.querySelector("#player-container-inner").append(playerOverlay);
            }

            enterFullscreen();

            await renderQuickSearchMenu(container);

            break;
        case "video_list":

            container = document.querySelector("#masthead .ytk-masthead")
            await renderQuickSearchMenu(container);

            container.querySelectorAll(".navigation-control-container").forEach(e => {
                e.parentNode.removeChild(e)
            });
            container.querySelectorAll(".notice-content").forEach(e => {
                e.parentNode.removeChild(e)
            });
            container.querySelectorAll(".search-row").forEach(e => {
                e.parentNode.removeChild(e)
            });

            document.body.classList.add("controls-visible");

            const lang = await getLanguage();
            if(message.speak) await speak(`${message.speak}`, lang)

            break;

    }
    sendResponse("Content: ", message.action + " Ok");
});
