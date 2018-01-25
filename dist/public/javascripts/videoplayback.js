"use strict";

$(document).ready(function () {
    var video = $("#video");
    var playButton = $("#play-pause");
    var muteButton = $("#mute");
    var seekBar = $("#seek-bar");
    var volumeBar = $("#volume-bar");
    video.load();
    setTimeout(function () {
        video.on('timeupdate', function () {
            var value = 10000 / this.duration * this.currentTime;
            seekBar.val(value);
        });
    }, 1000);
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
    });
    seekBar.change(function () {
        video[0].currentTime = video[0].duration * (seekBar.val() / 10000);
    });
    $.fn.video_toggle = function () {
        if (playButton.hasClass("fa-pause")) {
            playButton.removeClass("fa-pause");
            playButton.addClass("fa-play");
            video.get(0).pause();
        } else {
            playButton.removeClass("fa-play");
            playButton.addClass("fa-pause");
            video.get(0).play();
        }
    };
});
//# sourceMappingURL=videoplayback.js.map