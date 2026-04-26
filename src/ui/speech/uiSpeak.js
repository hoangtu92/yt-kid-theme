import { on } from "../../core/bus.js";
import {speak, speak_i18n} from "../../services/tts.service.js";
import {getLang} from "../../core/config";

export function initUiSpeech(){
    on("ui:speak", async (text) => {
        let lang = await getLang();
        await speak(text, lang.speech);
    });

    on("ui:speak_i18n", async (key) => {
        await speak_i18n(key);
    });
}
