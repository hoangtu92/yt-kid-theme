let recognition;
let isRunning = false;
let isStarting = false;
/**
 * Listen to background event message
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Receive background message: ", message)
    let container;
    switch (message.action) {

        case "video_ready":
            container = document.querySelector("#secondary-results");
            await renderQuickSearchMenu(container);
            enterVideoMode();
            break;
        case "video_list":
            container = document.querySelector("#masthead .ytk-masthead");
            await renderQuickSearchMenu(container);
            exitVideoMode();
            const lang = await getLanguage();
            if(message.speak) await speak(`${message.speak}`, lang)
            break;
    }

    sendResponse("Content: ", message.action + " Ok");
});
