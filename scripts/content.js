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


document.addEventListener("fullscreenchange", function (e){

    if(timeout){
        clearTimeout(timeout);
        timeout = 0;
    }
    else{
        if(document.fullscreen){
            timeout = setTimeout(function (){
                document.exitFullscreen();
            }, 20000);
        }

    }

});

document.addEventListener("ytk-masthead-data-ready", function (e){

    let video = document.querySelector("video.video-stream");
    let container = document.querySelector("ytk-player")


    if(video){

        video.addEventListener("pause", function () {
            this.play();
        });

        video.addEventListener("play", function (e) {
            if(e.isTrusted && !document.fullscreen){
                this.requestFullscreen();
            }
        });

        video.addEventListener("click", function (e) {
            video.currentTime += 20
        });

        container.addEventListener("yt-playback-ended", function (e){
            if(document.fullscreen)
                document.exitFullscreen();
        })

        container.addEventListener("yt-navigate", function (e){
            console.log(e);
        })

        let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);

        playerOverlay.addEventListener("click", function (e){
            video.currentTime += 20
        });

        document.querySelector("#player-container-inner").append(playerOverlay);

    }

})
