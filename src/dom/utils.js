/**
 *
 * @returns {boolean}
 */
export function isTouchDevice() {
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
export function triggerTouch(eventTarget, eventName, mouseEv) {
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


export function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}
