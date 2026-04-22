/**
 * Listen to background event message
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Receive background message: ", message)
    switch (message.action) {
        case "video_ready":
            renderQuickSearchMenu();
            enterFullscreen();
            break;
        case "video_list":
            const lang = await getLanguage();

            await speak(`${translate[lang]["found_it"]}: ${message.speak}`, lang)

            break;

    }
    sendResponse("Content: ", message.action + " Ok");
});
