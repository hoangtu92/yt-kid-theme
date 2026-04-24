/**
 *
 */
const enterVideoMode = function (){
    document.body.classList.add("fullscreen");
    document.body.classList.remove("controls-visible");
    document.body.classList.remove("search-mode");

    if(!document.querySelector("#player-container-inner .player-overlay")){
        let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);
        document.querySelector("#player-container-inner").append(playerOverlay);
    }

    window.dispatchEvent(new Event('resize'));
}

const exitVideoMode = function (){
    document.body.classList.remove("fullscreen");
    document.body.classList.add("controls-visible");
    document.body.classList.add("search-mode");

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


async function renderQuickSearchMenu(container ) {

    container.querySelectorAll(".search-row").forEach(e => e.parentNode.removeChild(e))
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


async function updateMenu() {
    const lang = await getLanguage();
    document.querySelectorAll(".search-row").forEach(e => {
        e.style.display = "none";
    });
    document.querySelectorAll(`.search-row[data-lang="${lang}"]`).forEach(e => {
        e.style.display = "block";
    });
}
