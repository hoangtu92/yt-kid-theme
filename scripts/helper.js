/**
 *
 * @param text
 * @param currentLang
 * @returns {Promise<unknown>}
 */
function speak(text, currentLang) {
    return new Promise((resolve, reject) => {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === currentLang);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang; // or 'vi-VN'
        utterance.voice = voice;

        speechSynthesis.speak(utterance);

        utterance.onend = resolve;
        utterance.onerror = reject;
    })
}

/**
 *
 * @param text
 * @returns {Promise<void>}
 */
async function searchVideo(text) {
    let searchIcon = document.querySelector("#search-icon");
    let input = document.querySelector("input.style-scope.ytk-search-box")
    if (input) {
        input.value = text;
        searchIcon.click();
    }
}

/**
 *
 * @param e
 */
function fillSearchResult(e) {
    let text = e.target.getAttribute("data-search");
    if (text) {
        document.querySelector("input.style-scope.ytk-search-box").value = text;
    }
}

/**
 *
 * @returns {boolean}
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

/**
 * trigger a touch event
 * @param eventTarget
 * @param eventName
 * @param mouseEv
 */
function triggerTouch(eventTarget, eventName, mouseEv) {
    let touches = [];
    if(mouseEv.clientX){
        touches =  [new Touch({
            identifier: Date.now(),
            target: eventTarget,
            clientX: mouseEv.clientX,
            clientY: mouseEv.clientY,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
        })];
    }

    let touchEvent = new TouchEvent(eventName, {
        cancelable: true,
        bubbles: true,
        touches: touches,
        targetTouches: touches,
        changedTouches: touches,
        shiftKey: true,
        altKey: mouseEv.altKey,
        ctrlKey: mouseEv.ctrlKey,
    });

    eventTarget.dispatchEvent(touchEvent);
}

/**
 *
 */
const enterFullscreen = function (){
    document.body.classList.add("fullscreen");
    document.body.classList.remove("search-mode");
    window.dispatchEvent(new Event('resize'));

}

/**
 *
 * @param nav
 */
function hideNav(nav = null){
    if(!nav) nav = document.querySelector("#secondary-results");
    if(nav){
        nav.style.display = "none";
        document.body.classList.remove("search-mode");
    }

}

/**
 *
 * @param nav
 */
function showNav(nav = null){
    if(!nav) nav = document.querySelector("#secondary-results");
    if(nav){
        nav.style.display = "block";
        document.body.classList.add("search-mode");
    }
}
/**
 *
 * @param e
 */
const toggleNav = function (e) {
    let nav = document.querySelector("#secondary-results");
    if(nav){
        if (nav.style.display === "block") {
            hideNav(nav)
        } else {
            showNav(nav);
        }
    }
}

/**
 *
 * @param html
 * @returns {ChildNode}
 */
function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 *
 * @param lang
 */
function changeLanguage(lang){

    chrome.storage.local.set({ selected_language: lang });

    document.querySelectorAll(".search-row").forEach(e => {
        e.style.display = "none";
    });
    document.querySelectorAll(`.search-row[data-lang="${lang}"]`).forEach(e => {
        e.style.display = "block";
    });
}

async function initRecognition() {

    let lang = await getLanguage();
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = async (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                final += transcript;
            } else {
                interim += transcript;
            }
        }

        // 🔥 LIVE text (updates while speaking)
        if (interim) {
            updateText(interim);
        }

        // ✅ FINAL text (stable)
        if (final) {
            updateText(final);
        }
        await speak(final, lang)
        await searchVideo(final);
    };

    recognition.onerror = async (err) => {
        let lang = await getLanguage();
        updateText(translate[lang]["cannot_hear_you"])
        await speak(translate[lang]["cannot_hear_you"], lang);
        await searchVideo(translate[lang]["default_search"])
    }

    recognition.onstart = function (e){
        recognition.starting = true;
    }
    recognition.onend = function (e){
        recognition.starting = false;
        setTimeout(() => {
            destroy();
        }, 2000)
    }

    return recognition;
}

/**
 *
 * @returns {Promise<unknown>}
 */
const getLanguage = async () => {

    return new Promise(resolve => {
        chrome.storage.local.get(["selected_language"], (res) => {
            resolve(res.selected_language || 'en-US');
        });
    });

}

async function renderQuickSearchMenu(container ) {
    //let container = document.querySelector(selector);


    let currentLang = await getLanguage();
    Object.entries(searchData).forEach(([lang, items], index) => {
        const row = document.createElement('div');
        row.className = 'search-row';
        row.dataset.lang = lang;
        row.style.display = lang === currentLang ? "block" : "none"

        const quick = document.createElement('div');
        quick.className = 'quick-search';

        items.forEach(item => {

            let tagName = "a"

            const a = document.createElement(tagName);
            a.href = '#';
            a.className = 'search-item search-item-button';
            a.dataset.search = item.keywords;
            a.setAttribute("data-action", item.action)

            if (item.targetLang) {
                a.dataset.lang = item.targetLang
            }


            const img = document.createElement('img');
            img.src = chrome.runtime.getURL(item.icon);

            a.appendChild(img);
            quick.appendChild(a);
        });

        row.appendChild(quick);
        container.prepend(row);
    });


}

/**
 * Send to background
 */

function pingServiceWorker() {
    chrome.runtime.sendMessage("ContentJS: Wake up baby", function (response) {
        console.log(response);
    });
}
