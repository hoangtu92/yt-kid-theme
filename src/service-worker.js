let pos_tab;
const lastUrlMap = {};
function handleUrl(tabId, url) {

    if(!pos_tab) return;

    if(!/#$/.test(url)) url += "#"

    if (!url || lastUrlMap[tabId] === url) return;


    if (url.includes('search') && url.includes("youtubekids")) {
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
                let msg = "";
                if(request.url.includes("api/stats/playback")){
                    eventName = "video_ready"
                }
                if(request.url.includes("browse")){
                    eventName = "video_list"
                }

                if(eventName){

                    chrome.tabs.sendMessage(pos_tab.id, {action: eventName, request: request, speak: msg}, function (response){
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


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "PING") {
        pos_tab = sender.tab;
        sendResponse({ ok: true, time: Date.now() });
    }
});
