"use strict";

const id = $("#id").text();
const video = $("#main_video");
const current = $("#current");
const duration = $("#duration");
const video_box = $("#video_box");
const append_videos = $(".append_videos");
const append_video = $(".append_video");
const append_videos_button = $("#append_videos_button");
const advance_setting_button = $(".advance_setting_button");

const playButton = $("#main_video_play_pause");
const main_muteButton = $("#main_video_mute");
const append_muteButton = $(".append_video_mute");
const append_popButton = $(".append_video_pop");
const seekBar = $("#seek-bar");
const volumeBar = $("#volume-bar");
const overlay = $("#main_video_overlay");
const inner = $(".overlay-inner");
const private_box = $("#private_box");
const advance_drawing = $("#advance_drawing");
const people_count = $("#people_count");
const people_count_total = $("#people_count_total");
const male_count = $("#male_count");
const male_count_total = $("#male_count_total");
const female_count = $("#female_count");
const female_count_total = $("#female_count_total");

let interval;
let is_private = true;
let is_advance_drawing = true;
let next_sec = 0;

$(window).on("resize", () => resize_overlay());

video_box.resize(() => resize_overlay());

video.resize(() => resize_overlay());

playButton.click(() => {
    video_toggle();
    $(this).toggleClass("fa-play fa-pause");
});

overlay.click((e) => {
    const target = $(e.target);
    if (target.is('#main_video_overlay')) {
        video_toggle();
    } else if (target.is('.boundary_box') || target.is('.emotion_img')) {
        pause_video();
        set_emotion_per_frame_per_ppl_chart(e.target);
        return false
    }
});

append_video.click(() => video_toggle());

append_popButton.click(function () {
    const append_video = $(this).parent(".append_video_bg");
    append_video.toggleClass("on_screen");
    if (append_video.hasClass("on_screen")) {
        append_video.draggable();
    } else {
        append_video.draggable("destroy");
        append_video.removeAttr('style');
    }
});

main_muteButton.click(function () {
    video.prop("muted", $(this).hasClass("fa-volume-up"));
    $(this).toggleClass("fa-volume-off fa-volume-up");
});

append_muteButton.click(function () {
    $(this).siblings("video").prop("muted", $(this).hasClass("fa-volume-up"));
    $(this).toggleClass("fa-volume-off fa-volume-up");
});

volumeBar.change(function () {
    video.prop("volume", $(this).val());
    append_videos.find("video").prop("volume", $(this).val());
});

seekBar.mousedown(() => pause_video());

$(document).on("input", "#seek-bar", () => {
    video[0].currentTime = video[0].duration * seekBar.val();
    append_videos.find("video").each(function () {
        this.currentTime = video[0].duration * seekBar.val();
    });
    $("#current").text(format(video[0].currentTime));
    clean_boundary_box();
    next_sec = ~~video[0].currentTime + 1;
    propagate_info();
});

advance_setting_button.click(function () {
    $('.advance_setting_inner').fadeToggle("fast");
    $(this).find("i").toggleClass("fa-spin");
});

private_box.change(function () {
    remove_emotion_per_frame_per_ppl_chart();
    $(".boundary_box").toggleClass("private");
    is_private = this.checked;
});

advance_drawing.change(function () {
    is_advance_drawing = this.checked;
});

append_videos_button.click(function () {
    append_videos.toggleClass("hide");
    $("#main_video_bg").toggleClass("show_menu");
    const resize_interval = setInterval(() => resize_overlay(), 1);
    setTimeout(() => clearInterval(resize_interval), 1000);
});

const video_toggle = () => playButton.hasClass("fa-pause") ? pause_video() : play_video();

const pause_video = () => {
    playButton.removeClass("fa-pause").addClass("fa-play");
    video[0].pause();
    append_videos.find("video").each(function () {
        this.pause();
    });
    clearInterval(interval);
};

const play_video = () => {
    playButton.removeClass("fa-play").addClass("fa-pause");
    inner.removeClass("showchart");
    remove_emotion_per_frame_per_ppl_chart();
    video[0].play();
    append_videos.find("video").each(function () {
        this.play();
    });
    if (video[0].currentTime === 0) next_sec = 1;
    interval = setInterval(() => {
        seekBar.val((1 / video[0].duration) * video[0].currentTime);
        current.text(format(video[0].currentTime));
        if (next_sec - video[0].currentTime <= 0.1 && video[0].currentTime - next_sec >= 0) {
            propagate_info();
            next_sec++;
        }
    }, 10);
};

const video_goto = (time) => {
    remove_emotion_per_frame_per_ppl_chart();
    pause_video();
    video[0].currentTime = time + 0.3;
    append_videos.find("video").each(function () {
        this.currentTime = time + 0.3;
    });
    seekBar.val((1 / video[0].duration) * (time + 0.3));
    current.text(format(video[0].currentTime));
    clean_boundary_box();
    next_sec = ~~video[0].currentTime + 1;
    propagate_info();
};

const propagate_ppl_count = () => {
    people_count.text($(".boundary_box").length);
    male_count.text($(".boundary_box.male").length);
    female_count.text($(".boundary_box.female").length);
};

const resize_overlay = () => {
    const video_height = video.height();
    const ratio = video_height / video[0].videoHeight;
    overlay.css({"width": video[0].videoWidth * ratio + "px", "height": video_height + "px"});
};

const format = (s) => {
    let ms = Number(String(s % 1).split(".")[1] || 0);
    ms = (ms >= 100) ? ms : "0" + ms;
    ms = (ms >= 10) ? ms : "0" + ms;
    let m = ~~(s / 60);
    m = (m >= 10) ? m : "0" + m;
    s = ~~(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s + ":" + ms.toString().substring(0, 3);
};