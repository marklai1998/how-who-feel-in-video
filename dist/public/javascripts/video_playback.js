"use strict";

var video = $("#video");
var playButton = $("#play-pause");
var muteButton = $("#mute");
var seekBar = $("#seek-bar");
var volumeBar = $("#volume-bar");
var overlay = $('#overlay-outer');
var video_width = void 0;
var video_height = void 0;
var element_width = void 0;
var element_height = void 0;
var ratio = void 0;
var time = void 0;
$(document).ready(function () {
    video.load();
    video.on("loadeddata", function () {
        video_width = video.get(0).videoWidth;
        video_height = video.get(0).videoHeight;
        element_width = video.width();
        element_height = video.height();
        ratio = element_height / video_height;
        overlay.css({ "width": video_width * ratio + "px" });
        overlay.css({ "height": element_height + "px" });
        overlay.fadeIn();
        $("#duration").text(" / " + format(video.get(0).duration));
    });
});

$(window).resize(function () {
    video_width = video.get(0).videoWidth;
    video_height = video.get(0).videoHeight;
    element_width = video.width();
    element_height = video.height();
    ratio = element_height / video_height;
    overlay.css({ "width": video_width * ratio + "px" });
    overlay.css({ "height": element_height + "px" });
});

playButton.click(function () {
    $.fn.video_toggle();
});
video.click(function () {
    $.fn.video_toggle();
});
muteButton.click(function () {
    if ($(this).hasClass("fa-volume-off")) {
        $(this).removeClass("fa-volume-off");
        $(this).addClass("fa-volume-up");
        video.prop('muted', false);
    } else {
        muteButton.removeClass("fa-volume-up");
        muteButton.addClass("fa-volume-off");
        video.prop('muted', true);
    }
});
volumeBar.change(function () {
    video.prop("volume", $(this).val());
});
seekBar.mousedown(function () {
    playButton.removeClass("fa-pause");
    playButton.addClass("fa-play");
    video.get(0).pause();
    clearInterval(time);
});
seekBar.change(function () {
    video[0].currentTime = video[0].duration * (seekBar.val() / 10000);
    $("#current").text(format(video.get(0).currentTime));
});
$.fn.video_toggle = function () {
    if (playButton.hasClass("fa-pause")) {
        playButton.removeClass("fa-pause");
        playButton.addClass("fa-play");
        video.get(0).pause();
        clearInterval(time);
    } else {
        playButton.removeClass("fa-play");
        playButton.addClass("fa-pause");
        video.get(0).play();
        time = setInterval(function () {
            var value = 10000 / video.get(0).duration * video.get(0).currentTime;
            seekBar.val(value);
            $("#current").text(format(video.get(0).currentTime));
        }, 1);
    }
};
function format(s) {
    m = Math.floor(s / 60);
    m = m >= 10 ? m : "0" + m;
    s = Math.floor(s % 60);
    s = s >= 10 ? s : "0" + s;
    return m + ":" + s;
}
//# sourceMappingURL=video_playback.js.map