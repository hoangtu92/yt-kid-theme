// src/actions/language.action.js

import { on, emit } from "../core/bus.js";
import { setLang } from "../core/config";
import {speak_i18n} from "../services/tts.service";

export function initLanguageAction() {
    on("action:switchLanguage", async ({ targetLang }) => {
        if (!targetLang) return;

        await setLang(targetLang);

        emit("language:changed", targetLang);

        await speak_i18n("language_change");
    });
}
