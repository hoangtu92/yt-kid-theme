let pos_tab;
let last_query_list;
/**
 * Trigger when admin load order list or click next page
 */
chrome.webRequest.onCompleted.addListener(function(request) {
        console.log(request);
        if(request.statusCode === 200){


        }
    },
    {urls: ["https://seller.shopee.tw/api/v3/order/search_order_list_index*"]},
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
