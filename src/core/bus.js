export const bus = new EventTarget();

export const emit = (e, d) =>
    bus.dispatchEvent(new CustomEvent(e, { detail: d }));

export const on = (e, fn) =>
    bus.addEventListener(e, (ev) => fn(ev.detail));
