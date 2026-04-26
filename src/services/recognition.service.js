// src/voice/recognition.service.js

import { emit } from "../core/bus.js";
import {getLang} from "../core/config";
import {speak_i18n} from "./tts.service";

let recognitionService = null;
let isActive = false;
let timeoutId;


function safeEnd() {
    if (!isActive) return;

    isActive = false;

    clearTimeout(timeoutId);

    emit("voice:end");
}

function forceStop() {
    try {
        recognitionService.abort();
    } catch (e) {}
}

export async function initRecognition() {
    if (recognitionService) {
        await stopRecognition();
        return;
    }

    recognitionService = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognitionService.continuous = false;
    recognitionService.interimResults = true;

    recognitionService.onstart = () => {
        isActive = true;
        emit("voice:start");

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            forceStop();   // 🔥 only stop
            safeEnd();     // 🔥 then finalize
        }, 7000);
    };

    recognitionService.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript;

            if (event.results[i].isFinal) final += text;
            else interim += text;
        }

        if (interim) emit("voice:interim", interim);
        if (final) emit("voice:final", final);
    };

    recognitionService.onerror = (e) => {
        emit("voice:error", e);
        forceStop();
        safeEnd();
    };

    recognitionService.onend = () => {
        // 🔥 do NOT call abort here
        safeEnd();
    };
}

export async function startRecognition() {
    await initRecognition();

    const { speech: lang } = await getLang();
    recognitionService.lang = lang;

    try {
        await speak_i18n("what_to_watch");
        recognitionService.start();
    } catch (e) {
        console.warn("Start failed:", e);
    }
}

export async function stopRecognition() {
    if (!recognitionService) return;

    if (isActive) {
        forceStop();
        safeEnd();
    }
}
