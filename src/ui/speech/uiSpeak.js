import { on } from "../../core/bus.js";
import { speak_i18n } from "../../services/speech.js";

export function initUiSpeech(){
    on("ui:speak", async (key) => {
        await speak_i18n(key);
    });
}
