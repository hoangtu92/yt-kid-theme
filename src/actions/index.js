// src/actions/index.js

import { initSearchAction } from "./search.js";
import { initLanguageAction } from "./language.js";
import { initVoiceActions } from "./voice.js";
import { initNavigationAction } from "./navigation.js";
import {initVideoModeAction} from "./videoMode";
import {initMenu} from "../ui/menu";
import {initVideoActions} from "./video";

export function initActions() {
    initSearchAction();
    initLanguageAction();
    initVoiceActions();
    initVideoModeAction();
    initNavigationAction();
    initVideoActions()
    initMenu();
}
