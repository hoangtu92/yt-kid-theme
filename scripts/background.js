let pos_tab;
/**
 * Trigger when admin load order list or click next page
 */

chrome.webRequest.onCompleted.addListener(function(request) {
        console.log(request);
        if(request.statusCode === 204){
            console.log(pos_tab)
            // Todo open loading indicate for creating order
            if(pos_tab){
                chrome.tabs.sendMessage(pos_tab.id, {action: "video_ready", request: request}, function (response){
                    console.log(response)
                });
            }
        }
    },
    {urls: ["*://*.youtubekids.com/api/stats/playback*"]},
    ["responseHeaders"]
);


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
