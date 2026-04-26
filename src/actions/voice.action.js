// src/actions/voice.action.js

import { on } from "../core/bus.js";
import {startRecognition, stopRecognition} from "../services/recognition.service.js";
import { emit } from "../core/bus.js";

export function initVoiceActions() {

    // 🔊 START VOICE
    on("action:voiceRecognition", async () => {
        await startRecognition();
    });

    // 🛑 STOP VOICE
    on("action:stopRecognition", async () => {
        await stopRecognition();
    });

    // 🎙 START EVENT (real source of truth)
    on("voice:start", () => {
        emit("ui:particle:start");
    });

    // 🛑 END EVENT (single place to stop UI)
    on("voice:end", () => {
        emit("ui:particle:stop");
        emit("media:play");
    });

    // ⚠️ ERROR → also stop UI
    on("voice:error", () => {
        emit("ui:speak_i18n", "cannot_hear_you");
    });

    // ✏️ INTERIM TEXT
    on("voice:interim", (text) => {
        emit("ui:text:update", text);
    });

    // ✅ FINAL RESULT
    on("voice:final", (text) => {
        emit("ui:text:update", text);
        emit("intent:search", text);
    });
}
