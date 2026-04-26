// src/voice/recognition.js

import { emit } from "../core/bus.js";
import {getLang} from "../core/config";

let recognition = null;
let isRunning = false;
let isStarting = false;

/**
 * Wait safely for recognition to end
 */
function waitForEndSafe(timeout = 1000) {
    return new Promise((resolve) => {
        let done = false;

        const timer = setTimeout(() => {
            if (!done) {
                done = true;
                resolve();
            }
        }, timeout);

        recognition.addEventListener("end", function handler() {
            if (done) return;

            done = true;
            clearTimeout(timer);
            recognition.removeEventListener("end", handler);
            resolve();
        });
    });
}

export async function initRecognition() {
    if (recognition) return;

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
        isRunning = true;
        isStarting = false;
        emit("voice:start");
    };

    recognition.onend = () => {
        isRunning = false;
        isStarting = false;

        emit("voice:end");
    };

    recognition.onresult = (event) => {
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

    recognition.onerror = async () => {
        emit("voice:error");
        emit("voice:end");
    };
}

export async function startRecognition() {
    await initRecognition();

    // stop previous safely
    if (isRunning || isStarting) {
        recognition.abort();
        await waitForEndSafe();
    }

    const { speech: lang } = await getLang();

    recognition.lang = lang;

    try {
        isStarting = true;
        recognition.start();
    } catch (e) {
        isStarting = false;
        console.warn("Start failed:", e);
    }
}

export async function stopRecognition() {
    if (!recognition) return;

    if (isRunning) {
        recognition.abort();
        await waitForEndSafe();
    }
}
