/**
 *
 * @returns {boolean}
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * trigger a touch event
 * @param eventTarget
 * @param eventName
 * @param mouseEv
 */
function triggerTouch(eventTarget, eventName, mouseEv) {
    let touches = [];
    if(mouseEv.clientX){
        touches =  [new Touch({
            identifier: Date.now(),
            target: eventTarget,
            clientX: mouseEv.clientX,
            clientY: mouseEv.clientY,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
        })];
    }

    let touchEvent = new TouchEvent(eventName, {
        cancelable: true,
        bubbles: true,
        touches: touches,
        targetTouches: touches,
        changedTouches: touches,
        shiftKey: true,
        altKey: mouseEv.altKey,
        ctrlKey: mouseEv.ctrlKey,
    });

    eventTarget.dispatchEvent(touchEvent);
}




/**
 *
 * @param lang
 */
function changeLanguage(lang){
    chrome.storage.local.set({ selected_language: lang });
}


function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/**
 *
 * @returns {Promise<unknown>}
 */
const getLanguage = async () => {

    return new Promise(resolve => {
        chrome.storage.local.get(["selected_language"], (res) => {
            resolve(res.selected_language || 'en-US');
        });
    });

}

/**
 * Send to background
 */

function pingServiceWorker() {
    chrome.runtime.sendMessage("ContentJS: Wake up baby", function (response) {
        console.log(response);
    });
}
