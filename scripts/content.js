/**
 * Listen to background event message
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Receive background message: ", message)
    let container;
    switch (message.action) {

        case "video_ready":
            document.body.classList.remove("controls-visible");
            if(!document.querySelector("#player-container-inner .player-overlay")){
                let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);
                document.querySelector("#player-container-inner").append(playerOverlay);
            }


            container = document.querySelector("#secondary-results")
            container.querySelectorAll(".search-row").forEach(e => e.parentNode.removeChild(e))
            await renderQuickSearchMenu(container);
            enterFullscreen();

            break;
        case "video_list":
            document.body.classList.add("controls-visible");

            container = document.querySelector("#masthead .ytk-masthead")

            container.querySelectorAll(".navigation-control-container").forEach(e => {
                e.parentNode.removeChild(e)
            });
            container.querySelectorAll(".notice-content").forEach(e => {
                e.parentNode.removeChild(e)
            });
            container.querySelectorAll(".search-row").forEach(e => {
                e.parentNode.removeChild(e)
            });

            await renderQuickSearchMenu(container);
            const lang = await getLanguage();

            if(message.speak) await speak(`${message.speak}`, lang)

            break;

    }
    sendResponse("Content: ", message.action + " Ok");
});
