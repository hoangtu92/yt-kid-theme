
/**
 *
 * @param el
 * @param evt
 */
export function clickEl(el, evt = null){

    if(typeof el === 'string') el = document.querySelector(el);

    if(!el) return;
    if (isTouchDevice()) {
        console.log("trigger touch", el)
        triggerTouch(el, 'touchstart', evt);
        triggerTouch(el, 'touchend', evt);
    } else {
        el.click();
    }

}

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
export function triggerTouch(eventTarget, eventName, mouseEv = null) {
    let touche =  new Touch({
        identifier: Date.now(),
        target: eventTarget,
        clientX: mouseEv?.clientX || 0,
        clientY: mouseEv?.clientY || 0,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
    });

    let touchEvent = new TouchEvent(eventName, {
        cancelable: true,
        bubbles: true,
        touches: [touche],
        targetTouches: [touche],
        changedTouches: [touche],
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
    });

    eventTarget.dispatchEvent(touchEvent);
}
