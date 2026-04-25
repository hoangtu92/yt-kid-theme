// src/actions/voice.js

import { on } from "../core/bus.js";
import { startRecognition } from "../voice/recognition.js";
import { speak_i18n } from "../services/speech.js";
import { emit } from "../core/bus.js";
import {delay} from "../dom/utils";

export function initVoiceActions() {

    on("action:voiceRecognition", async () => {
        emit("ui:particle:start");

        await speak_i18n("what_to_watch");

        // small delay still OK (UX reason)
        await delay(400);

        await startRecognition();
    });

    on("voice:interim", (text) => {
        emit("ui:text:update", text);
    });

    on("voice:final", async (text) => {
        emit("ui:text:update", text);
        emit("intent:search", text);
    });

    on("voice:error",  () => {
        emit("ui:speak", "cannot_hear_you");
        emit("intent:search", "default_search");
    });

    on("voice:end", () => {
        emit("ui:particle:stop");
    });
}
