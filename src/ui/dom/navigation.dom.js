/**
 *
 * @param nav
 */
import {clickEl} from "./helpers.dom";

export function hideNav(nav = null){
    if(!nav) nav = document.querySelector("#secondary-results");
    if(nav){
        nav.style.display = "none";
        document.body.classList.remove("search-mode");
    }

}
let navTimeoutId;
/**
 *
 * @param nav
 */
export function showNav(nav = null){
    if(!nav) nav = document.querySelector("#secondary-results");
    if(nav){
        nav.style.display = "block";
        document.body.classList.add("search-mode");

        clearTimeout(navTimeoutId);
        navTimeoutId = setTimeout(function (){
            hideNav();
        }, 7000);
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



export const watchItAgain = function (){
    clickEl("#avatar-placeholder")
}

export const tabRecommend = function (){
    clickEl("#anchors-row-content ytk-kids-category-tab-renderer[title='Recommended']")
}
export const tabExplore = function (){
    clickEl("#anchors-row-content ytk-kids-category-tab-renderer[title='Explore']")
}
export const tabLearning = function (){
    clickEl("#anchors-row-content ytk-kids-category-tab-renderer[title='Learning']")
}
export const tabMusic = function (){
    clickEl("#anchors-row-content ytk-kids-category-tab-renderer[title='Music']")
}
