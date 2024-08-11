function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}


document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

document.addEventListener('dblclick', function (event) {
        event.preventDefault();
        event.stopPropagation();
    }, true //capturing phase!!
);

document.addEventListener('drag', function (event) {
    event.preventDefault();
    event.stopPropagation();
}, true);

let timeout;

const enterFullscreen = function (){
    document.body.classList.add("fullscreen");
    window.dispatchEvent(new Event('resize'));
    if(timeout){
        clearTimeout(timeout);
        timeout = 0;
    }

    timeout = setTimeout(function (){
        exitFullscreen()
    }, 20000);



}

const exitFullscreen = function (){
    document.body.classList.remove("fullscreen");
    window.dispatchEvent(new Event('resize'));
    if(timeout){
        clearTimeout(timeout);
        timeout = 0;
    }

}


document.addEventListener("ytk-masthead-data-ready", function (e){

    let video = document.querySelector("video.video-stream");
    let container = document.querySelector("ytk-player")

    console.log("Player Ready", e, video)

    if(video){

        video.addEventListener("pause", function () {
            this.play();
            console.log("Video pause")
        });

        video.addEventListener("play", function (e) {
            console.log("Video play")
            enterFullscreen()
        });

        video.addEventListener("click", function (e) {
            video.currentTime += 20;
            console.log("Video click to seek")
        });

        container.addEventListener("yt-playback-ended", function (e){
            exitFullscreen()
        })

        let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);

        playerOverlay.addEventListener("click", function (e){
            video.currentTime += 20
        });

        document.querySelector("ytk-player").append(playerOverlay);

    }

})
