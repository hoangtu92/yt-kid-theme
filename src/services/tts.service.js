import {getLang} from "../core/config";
import {getLanguagePack} from "../core/i18n";

let currentUtterance = null;
let isSpeaking = false;

/**
 *
 * @param text
 * @param lang
 * @returns {Promise<unknown>}
 */
export function speak(text, lang = "en-US") {
    return new Promise((resolve) => {
        stopSpeak();

        isSpeaking = true;

        const utter = new SpeechSynthesisUtterance(text);

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === lang);

        utter.lang = lang;
        utter.voice = voice;

        utter.onend = () => {
            isSpeaking = false;
            resolve();
        };

        currentUtterance = utter;
        speechSynthesis.speak(utter);
    });
}

/**
 *
 * @param key
 * @returns {Promise<void>}
 */
export async function speak_i18n(key) {
    const { speech: lang } = await getLang();

    const languagePack = getLanguagePack(lang);

    const text = languagePack?.[key];

    if (!text) {
        console.warn(`Missing i18n key: ${key} for lang: ${lang}`);
        return;
    }

    await speak(text, lang);

    return text;
}

export function stopSpeak() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

export function isTTSRunning() {
    return isSpeaking;
}
