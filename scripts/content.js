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
        nav.style.display = "block"
    }, 5000);



}

let video, container, videoWidth, videoHeight, videoLeft, videoTop;

const exitFullscreen = function (e){
    document.body.classList.remove("fullscreen");
    window.dispatchEvent(new Event("resize"));

    if(timeout){
        clearTimeout(timeout);
        timeout = 0;
    }

    video.style.width = videoWidth + "px";
    video.style.height = videoHeight + "px";

}

document.addEventListener("click", function (e){

    if(!video && !container){
        video = document.querySelector("video.video-stream");
        container = document.querySelector("ytk-player");
        nav = document.querySelector("#secondary-results");

        if(video && container){

            videoWidth = video.clientWidth;
            videoHeight = video.clientHeight;

            video.addEventListener("pause", function () {
                this.play();
                console.log("Video pause")
            });

            video.addEventListener("play", function (e) {
                console.log("Video play")
                enterFullscreen();
                nav.style.display = "none"
            });

            video.addEventListener("click", function (e) {
                video.currentTime += 20;
                console.log("Video click to seek")
            });

            container.addEventListener("yt-playback-ended", function (e){
                exitFullscreen();
            })

            let playerOverlay = htmlToElement(`<div class="player-overlay"></div>`);

            playerOverlay.addEventListener("click", function (e){
                video.currentTime += 20;

            });


            document.querySelector("#player-container-inner").append(playerOverlay);




        }
    }
})
