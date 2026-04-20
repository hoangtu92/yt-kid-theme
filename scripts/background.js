let pos_tab;
const lastUrlMap = {};
function handleUrl(tabId, url) {

    if(!pos_tab) return;

    if(!/#$/.test(url)) url += "#"

    if (!url || lastUrlMap[tabId] === url) return;


    if (url.includes('search')) {
        lastUrlMap[tabId] = url;
        console.log('Search detected:', url);
        const parsedUrl = new URL(url);
        chrome.tabs.sendMessage(pos_tab.id, {action: "video_list",  speak: parsedUrl.searchParams.get('q')}, function (response){
            console.log(response)
        });
    }
}

chrome.webRequest.onCompleted.addListener(function(request) {

        if(request.statusCode <= 204 && request.statusCode >= 200){

            if(pos_tab){
                let eventName = "";
                if(request.url.includes("api/stats/playback")){
                    eventName = "video_ready"
                }

                if(eventName){

                    chrome.tabs.sendMessage(pos_tab.id, {action: eventName, request: request}, function (response){
                        console.log(response)
                    });
                }

            }
        }
    },
    {urls: ["*://*.youtubekids.com/*"]},
    ["responseHeaders"]
);

// normal load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        handleUrl(tabId, tab.url);
    }
});

// SPA navigation
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    handleUrl(details.tabId, details.url);
});

// hash change
chrome.webNavigation.onReferenceFragmentUpdated.addListener((details) => {
    handleUrl(details.tabId, details.url);
});


/**
 * On receiving message from content script
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Receive content script msg: ", request);
        pos_tab = sender.tab;
        sendResponse("Service Worker: Okie dookie!!");
        return true;
    }
);
