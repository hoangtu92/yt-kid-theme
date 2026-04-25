
/**
 *
 * @param nav
 */
export function hideNav(nav = null){
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
export function showNav(nav = null){
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
export const toggleNav = function (e) {
    let nav = document.querySelector("#secondary-results");
    if(nav){
        if (nav.style.display === "block") {
            hideNav(nav)
        } else {
            showNav(nav);
        }
    }
}
