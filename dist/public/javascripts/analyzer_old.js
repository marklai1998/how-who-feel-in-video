"use strict";

var id = $("#id").text();
var video = $("#video");
var current = $("#current");
var duration = $("#duration");
var video0 = video.get(0);
var playButton = $("#play-pause");
var muteButton = $("#mute");
var seekBar = $("#seek-bar");
var volumeBar = $("#volume-bar");
var overlay = $("#overlay-bg");
var inner = $(".overlay-inner");
var private_box = $("#private_box");
var people_count = $("#people_count");
var people_count_total = $("#people_count_total");
var male_count = $("#male_count");
var male_count_total = $("#male_count_total");
var female_count = $("#female_count");
var female_count_total = $("#female_count_total");
var element_height = void 0;
var ratio = void 0;
var time = void 0;
var is_private = false;

var all_frame = [];
var remove_query = [];
var emotions = [];
var next_sec = 0;

$.getJSON("/upload/" + id + "/" + id + ".json", function (file) {
    $.each(file.People, function (i, people) {
        all_frame[i] = people.Frames;
    });
    people_count_total.text(file.People.length);
    $.each(all_frame, function (i, frame) {
        if (frame[0].Gender.Value === "Male") {
            male_count_total.text(parseInt(male_count_total.text()) + 1);
        } else {
            female_count_total.text(parseInt(female_count_total.text()) + 1);
        }
    });
});

$(document).ready(function () {
    video.get(0).load();
    video.on("loadeddata", function () {
        duration.text("/ " + format(video0.duration));
        resize_overlay();
        overlay.fadeIn("");
        propagate_info();
    });
    var canvas = document.getElementById("test");
    var parent = document.getElementById('parent');

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    var ctx = document.getElementById("test").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Happy',
                data: [10, 20, 30, 40, 50, 60, 70, 80, 90],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255,99,132,1)'],
                borderWidth: 1,
                type: 'line'
            }, {
                label: 'Sad',
                data: [50, 50, 50, 50, 50, 50, 50, 50, 100],
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1,

                // Changes this dataset to become a line
                type: 'line'
            }]
        },
        options: {
            legend: {
                position: 'right'
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    position: 'right'
                }]
            }
        }
    });
});

$(window).on("resize", function () {
    resize_overlay();
});

playButton.click(function () {
    video_toggle();
});
overlay.click(function (e) {
    if ($(e.target).is('.overlay-inner') || $(e.target).is('.emotion_img')) {
        pause_video();
        create_emotion_chart(e.target);
        return false;
    } else {
        video_toggle();
    }
});
seekBar.mousedown(function () {
    pause_video();
});

muteButton.click(function () {
    if ($(this).hasClass("fa-volume-off")) {
        $(this).removeClass("fa-volume-off");
        $(this).addClass("fa-volume-up");
        video.prop("muted", false);
    } else {
        muteButton.removeClass("fa-volume-up");
        muteButton.addClass("fa-volume-off");
        video.prop("muted", true);
    }
});

volumeBar.change(function () {
    video.prop("volume", $(this).val());
});

$(document).on("input", "#seek-bar", function () {
    video0.currentTime = video0.duration * seekBar.val();
    $.each(all_frame, function (i) {
        $("#" + i).remove();
    });
    next_sec = Math.floor(video0.currentTime);
    remove_query = [];
    emotions = [];
    propagate_info();
    $("#current").text(format(video0.currentTime));
});

private_box.change(function () {
    remove_create_emotion_chart();
    $(".overlay-inner").toggleClass("private");
    is_private = this.checked;
});

function video_toggle() {
    if (playButton.hasClass("fa-pause")) {
        pause_video();
    } else {
        play_video();
    }
}

function pause_video() {
    playButton.removeClass("fa-pause");
    playButton.addClass("fa-play");
    video0.pause();
    clearInterval(time);
}

function play_video() {
    playButton.removeClass("fa-play");
    playButton.addClass("fa-pause");
    inner.removeClass("showchart");
    remove_create_emotion_chart();
    video0.play();
    time = setInterval(function () {
        seekBar.val(1 / video0.duration * video0.currentTime);
        current.text(format(video0.currentTime));
        if (video0.currentTime === 0) next_sec = 0;
        if (next_sec - video0.currentTime <= 0.1) {
            propagate_info();
            next_sec++;
        }
    }, 1);
}

function propagate_info() {
    $.each(remove_query, function (i, overlay) {
        if (overlay[1] === next_sec) {
            $("#" + overlay[0]).fadeOut("fast", function () {
                $("#" + overlay[0]).remove();
            });
        }
    });
    $.each(all_frame, function (i, frames) {
        for (var count = 0; count < frames.length; count++) {
            var frame = frames[count];
            var next_frame = frames[count + 1];
            if (frame.FrameNumber === Math.floor(video0.currentTime + 2)) {
                var bb = frame.BoundingBox;
                create_bb(frame, i);
                propagate_emotion(frame, i);
                if (next_frame) {
                    var bb_next = next_frame.BoundingBox;
                    if (next_frame.FrameNumber - frame.FrameNumber > 2) {
                        remove_overlay(i, next_sec);
                    } else if (Math.abs(bb.Top - bb_next.Top) < 0.2 && Math.abs(bb.Left - bb_next.Left) < 0.2 && playButton.hasClass("fa-pause")) {
                        $("#" + i).animate({
                            top: bb_next.Top * 100 + "%",
                            left: bb_next.Left * 100 + "%"
                        }, { duration: 1000, queue: false }, function () {
                            // Animation complete.
                        });
                    } else {
                        remove_overlay(i, next_sec);
                    }
                } else remove_overlay(i, next_sec);
            }
        }
    });
    propagate_ppl_count();
}

function propagate_ppl_count() {
    people_count.text($(".overlay-inner").length);
    male_count.text($(".male").length);
    female_count.text($(".female").length);
}

function propagate_emotion(frame, i) {
    var emotion = frame.Emotions;
    emotions[i] = {
        labels: [emotion[0].Type, emotion[1].Type, emotion[2].Type],
        datasets: [{
            label: "Percentage",
            data: [emotion[0].Confidence, emotion[1].Confidence, emotion[2].Confidence],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1
        }]
    };
}

function create_bb(frame, i) {
    var bb = frame.BoundingBox;
    var overlay_bb = $("#" + i);
    var prepare_bb = "";
    var emotion = frame.Emotions[0].Type;
    var gender = frame.Gender.Value;
    if (overlay_bb.length) {
        overlay_bb.remove();
        prepare_bb += "<div class='overlay-inner' id=" + i + ">";
    } else {
        prepare_bb += "<div class='overlay-inner' style='display:none' id=" + i + ">";
    }
    prepare_bb += "<img class='emotion_img' src='/images/emotion/" + emotion + "_" + gender + ".png'>";
    prepare_bb += "</div>";
    $(prepare_bb).appendTo("#overlay-bg");
    var new_overlay_bb = $("#" + i);
    if (is_private) {
        new_overlay_bb.addClass("private");
    }
    if (gender === "Male") {
        new_overlay_bb.addClass("male");
    } else {
        new_overlay_bb.addClass("female");
    }
    new_overlay_bb.css({ "width": bb.Width * 100 + "%" });
    new_overlay_bb.css({ "height": bb.Height * 100 + "%" });
    new_overlay_bb.css({ "top": bb.Top * 100 + "%" });
    new_overlay_bb.css({ "left": bb.Left * 100 + "%" });
    new_overlay_bb.fadeIn("");
}

function remove_overlay(i, next_sec) {
    remove_query.push([i, next_sec + 1]);
}

function resize_overlay() {
    element_height = video.height();
    ratio = element_height / video0.videoHeight;
    overlay.css({ "width": video0.videoWidth * ratio + "px" });
    overlay.css({ "height": element_height + "px" });
    var block = $(".chart_block_overlay");
    block.css({ "top": block.parent(".overlay-inner").height() + 3 + "px" });
}

function create_emotion_chart(target) {
    remove_create_emotion_chart();
    var id = target.id;
    var block = $("<div class='chart_block_overlay' style='display:none'>Emotion<canvas id='chart_block_overlay' width='400' height='200'></canvas></div>");
    block.appendTo(target);
    $(target).addClass("showchart");
    block.css({ "top": $(target).height() + 3 + "px" });
    if ($(target).css("left") > "40%") {
        block.addClass("left");
    } else {
        block.addClass("right");
    }
    block.fadeIn("", function () {
        var ctx = document.getElementById("chart_block_overlay").getContext('2d');
        ctx.font = "Rajdhani";
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: emotions[id],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
                            callback: function callback(value) {
                                return value + "%";
                            }
                        }
                    }]
                },
                legend: {
                    display: false,
                    labels: {
                        // This more specific font property overrides the global property
                        defaultFontFamily: "Rajdhani"
                    }
                }
            }
        });
    });
}

function remove_create_emotion_chart() {
    $(".showchart").removeClass("showchart");
    var overlay = $(".chart_block_overlay");
    if (overlay.length) {
        overlay.fadeOut("fast", function () {
            overlay.remove();
        });
    }
}

function format(s) {
    ms = Number(String(s % 1).split(".")[1] || 0);
    ms = ms >= 100 ? ms : "0" + ms;
    ms = ms >= 10 ? ms : "0" + ms;
    m = Math.floor(s / 60);
    m = m >= 10 ? m : "0" + m;
    s = Math.floor(s % 60);
    s = s >= 10 ? s : "0" + s;
    return m + ":" + s + ":" + ms.toString().substring(0, 3);
}
//# sourceMappingURL=analyzer_old.js.map