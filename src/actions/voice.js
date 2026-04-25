// src/actions/voice.js

import { on } from "../core/bus.js";
import {startRecognition, stopRecognition} from "../voice/recognition.js";
import { emit } from "../core/bus.js";

export function initVoiceActions() {

    on("action:voiceRecognition", async () => {

        emit("ui:particle:start");
        emit("ui:speak_i18n", "what_to_watch");

        await startRecognition();
    });

    on("action:stopRecognition", async () => {
        await stopRecognition()
    })

    on("voice:interim", (text) => {
        emit("ui:text:update", text);
    });

    on("voice:final", async (text) => {
        emit("ui:text:update", text);
        emit("intent:search", text);
    });

    on("voice:error",  () => {
        emit("ui:speak_i18n", "cannot_hear_you");
    });

    on("voice:end", () => {
        emit("ui:particle:stop");
    });
}
