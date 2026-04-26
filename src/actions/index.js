// src/actions/index.js

import { initSearchAction } from "./search.action.js";
import { initLanguageAction } from "./language.action.js";
import { initVoiceActions } from "./voice.action.js";
import { initNavigationAction } from "./navigation.action.js";
import {initUIAction} from "./ui.action";
import {initVideoActions} from "./video.action";
import {initMenu} from "./menu.action";

export function initActions() {
    initSearchAction();
    initLanguageAction();
    initVoiceActions();
    initUIAction();
    initNavigationAction();
    initVideoActions()
    initMenu();
}
