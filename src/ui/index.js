import "./speech/uiSpeak.js";
import {initUiSpeech} from "./speech/uiSpeak";
import {initDomEvents} from "./dom/events.dom";
import {initParticles} from "./particle";

export function initUI() {
    // other UI bindings
    initUiSpeech();
    initParticles();
    initDomEvents();
}
