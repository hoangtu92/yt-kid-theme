import vi from "./vi-VN.js";
import en from "./en-US.js";

const languages = {
    "vi-VN": vi,
    "en-US": en
};

export function getLanguagePack(lang = "en-US") {
    return languages[lang] || languages["en-US"];
}
