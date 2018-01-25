"use strict";

var id = $("#id").text();
var video = $("#video");
var current = $("#current");
var duration = $("#duration");
var whole_video = $("#whole_video");
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
var interval = void 0;
var is_private = false;

var all_frame = [];
var remove_query = [];
var emotions = [];
var next_sec = 0;

var total_emotion = void 0;
var emotion_time = [];
var happy = [];
var sad = [];
var angry = [];
var confused = [];
var disgusted = [];
var surprised = [];
var clam = [];

var emotion_per_frame = void 0;
var emotion_per_frame_config = {
    data: {
        datasets: [{
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(54, 162, 235, 0.5)'],
            borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(54, 162, 235, 1)']
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['Happy', 'Sad', 'Angry', 'Confused', 'Disgusted', 'Surprised', 'Clam']

    },
    type: 'doughnut',
    options: {
        legend: {
            position: 'right',
            labels: {
                fontColor: 'white'
            }
        }
    }
};

$(document).ready(function () {
    video.get(0).load();
    video.on("loadeddata", function () {
        duration.text("/ " + format(video0.duration));
        overlay.fadeIn("");
        $.getJSON("/upload/" + id + "/" + id + ".json", function (file) {
            var json = file.Result;

            var _loop = function _loop(sec) {
                emotion_time[sec] = sec;
                happy[sec] = 0;
                sad[sec] = 0;
                angry[sec] = 0;
                confused[sec] = 0;
                disgusted[sec] = 0;
                surprised[sec] = 0;
                clam[sec] = 0;
                var key = String(sec);
                if (json[key]) {
                    all_frame[sec] = json[key];
                    $.each(all_frame[sec], function (i, people) {
                        switch (people.Emotions[0].Type) {
                            case "HAPPY":
                                happy[sec]++;
                                break;
                            case "SAD":
                                sad[sec]++;
                                break;
                            case "ANGRY":
                                angry[sec]++;
                                break;
                            case "CONFUSED":
                                confused[sec]++;
                                break;
                            case "DISGUSTED":
                                disgusted[sec]++;
                                break;
                            case "SURPRISED":
                                surprised[sec]++;
                                break;
                            case "CLAM":
                                clam[sec]++;
                                break;
                        }
                    });
                }
            };

            for (var sec = 0; sec <= video0.duration; sec++) {
                _loop(sec);
            }

            // people_count_total.text(file.People.length);
            // $.each(all_frame, function (i, frame) {
            //     if (frame[0].Gender.Value === "Male") {
            //         male_count_total.text(parseInt(male_count_total.text()) + 1);
            //     } else {
            //         female_count_total.text(parseInt(female_count_total.text()) + 1);
            //     }
            // });

            var canvas = document.getElementById("total_emotion");
            var parent = document.getElementById('parent');

            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;

            var ctx = document.getElementById("total_emotion").getContext('2d');
            total_emotion = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: emotion_time,
                    datasets: [{
                        label: 'Happy',
                        data: happy,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(255,99,132,1)'],
                        borderWidth: 1,
                        type: 'line'
                    }, {
                        label: 'Sad',
                        data: sad,
                        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                        type: 'line'
                    }, {
                        label: 'Angry',
                        data: angry,
                        backgroundColor: ['rgba(255, 206, 86, 0.2)'],
                        borderColor: ['rgba(255, 206, 86, 1)'],
                        borderWidth: 1,
                        type: 'line'
                    }, {
                        label: 'Confused',
                        data: confused,
                        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)'],
                        borderWidth: 1,
                        type: 'line'
                    }, {
                        label: 'Disgusted',
                        data: disgusted,
                        backgroundColor: ['rgba(153, 102, 255, 0.2)'],
                        borderColor: ['rgba(153, 102, 255, 1)'],
                        borderWidth: 1,
                        type: 'line'
                    }, {
                        label: 'Surprised',
                        data: surprised,
                        backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 159, 64, 1)'],
                        borderWidth: 1,
                        type: 'line'
                    }, {
                        label: 'Clam',
                        data: clam,
                        backgroundColor: ['rgba(54, 162, 235, 0.5)'],
                        borderColor: ['rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                        type: 'line'
                    }]
                },
                options: {
                    legend: {
                        position: 'right',
                        labels: {
                            fontColor: 'white'
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            display: false,
                            ticks: {
                                fontColor: 'white'
                            }
                        }],
                        yAxes: [{
                            position: 'right',
                            ticks: {
                                fontColor: 'white',
                                userCallback: function userCallback(label, index, labels) {
                                    // when the floored value is the same as the value we have a whole number
                                    if (Math.floor(label) === label) {
                                        return label;
                                    }
                                }
                            }
                        }]
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    }
                }
            });
        });
        propagate_info();
    });
    var ctx = document.getElementById("emotion_per_frame").getContext('2d');
    emotion_per_frame = new Chart(ctx, emotion_per_frame_config);
});

$(window).on("resize", function () {
    resize_overlay();
});

whole_video.resize(function () {
    resize_overlay();
});

playButton.click(function () {
    video_toggle();
});

overlay.mouseup(function (e) {
    if (!whole_video.is('.ui-draggable-dragging')) {
        if ($(e.target).is('.slider')) {
            return false;
        } else if ($(e.target).is('.overlay-inner') || $(e.target).is('.emotion_img')) {
            pause_video();
            create_emotion_chart(e.target);
            return false;
        } else if ($(e.target).is('#scale')) {
            whole_video.toggleClass("col-12");
            whole_video.toggleClass("col-lg-7");
            whole_video.toggleClass("on_screen");
            if (whole_video.hasClass("on_screen")) {
                whole_video.draggable();
            } else {
                whole_video.draggable("destroy");
                whole_video.removeAttr('style');
            }
            return false;
        } else {
            video_toggle();
        }
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
        $(this).removeClass("fa-volume-up");
        $(this).addClass("fa-volume-off");
        video.prop("muted", true);
    }
});

volumeBar.change(function () {
    video.prop("volume", $(this).val());
});

$(document).on("input", "#seek-bar", function () {
    video0.currentTime = video0.duration * seekBar.val();
    $.each(all_frame, function (i) {
        $(".overlay-inner").remove();
    });
    next_sec = Math.floor(video0.currentTime);
    remove_query = [];
    emotions = [];
    $("#current").text(format(video0.currentTime));
    propagate_info();
});

private_box.change(function () {
    remove_emotion_chart();
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
    clearInterval(interval);
}

function play_video() {
    playButton.removeClass("fa-play");
    playButton.addClass("fa-pause");
    inner.removeClass("showchart");
    remove_emotion_chart();
    video0.play();
    interval = setInterval(function () {
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
    var current_time = Math.floor(video0.currentTime + 2);
    $.each(remove_query, function (i, overlay) {
        if (overlay[1] === next_sec) {
            $("#" + overlay[0]).remove();
        }
    });
    if (all_frame[current_time]) {
        $.each(all_frame[current_time], function (i, people) {
            var bb = people.BoundingBox;
            var id = people.FaceId;
            create_bb(people, id);
            propagate_emotion_chart(people, id);
            if (all_frame[current_time + 1]) {
                $.each(all_frame[current_time + 1], function (i, next_people) {
                    var bb_next = next_people.BoundingBox;
                    if (Math.abs(bb.Top - bb_next.Top) < 0.05 && Math.abs(bb.Left - bb_next.Left) < 0.05 && Math.abs(bb.Width - bb_next.Width) < 0.05 && Math.abs(bb.Height - bb_next.Height) < 0.05 && playButton.hasClass("fa-pause")) {
                        $("#" + id).animate({
                            top: bb_next.Top * 100 + "%",
                            left: bb_next.Left * 100 + "%",
                            width: bb_next.Width * 100 + "%",
                            height: bb_next.Height * 100 + "%"
                        }, { duration: 1000, queue: false }, function () {});
                    }
                });
            }
            remove_query.push([id, current_time]);
        });
    }
    propagate_ppl_count();
    var datasets = emotion_per_frame_config.data.datasets[0];
    datasets.data[0] = happy[current_time];
    datasets.data[1] = sad[current_time];
    datasets.data[2] = angry[current_time];
    datasets.data[3] = confused[current_time];
    datasets.data[4] = disgusted[current_time];
    datasets.data[5] = surprised[current_time];
    datasets.data[6] = clam[current_time];
    emotion_per_frame.update();
}

function propagate_ppl_count() {
    people_count.text($(".overlay-inner").length);
    male_count.text($(".male").length);
    female_count.text($(".female").length);
}

function propagate_emotion_chart(people, id) {
    var emotion = people.Emotions;
    emotions[id] = {
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

function create_bb(people, id) {
    var bb = people.BoundingBox;
    var prepare_bb = "";
    var emotion = people.Emotions[0].Type;
    var gender = people.Gender.Value;
    prepare_bb += "<div class='overlay-inner' id=" + id + ">";
    prepare_bb += "<img class='emotion_img' src='/images/emotion/" + emotion + "_" + gender + ".png'>";
    prepare_bb += "</div>";
    $(prepare_bb).appendTo("#overlay-bg");
    var new_overlay_bb = $("#" + id);
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
}

function resize_overlay() {
    element_height = video.height();
    ratio = element_height / video0.videoHeight;
    overlay.css({ "width": video0.videoWidth * ratio + "px", "height": element_height + "px" });
    var block = $(".chart_block_overlay");
    block.css({ "top": block.parent(".overlay-inner").height() + 3 + "px" });
}

function create_emotion_chart(target) {
    remove_emotion_chart();
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
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: emotions[id],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
                            callback: function callback(value) {
                                return value + "%";
                            },
                            fontColor: 'white'
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    });
}

function remove_emotion_chart() {
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
//# sourceMappingURL=analyzer.js.map