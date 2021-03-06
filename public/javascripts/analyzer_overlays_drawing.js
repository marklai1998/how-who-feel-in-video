"use strict";

const clean_boundary_box = () => {
    $(".boundary_box").remove();
    $(".name_box").remove();
    $(".landmark").remove();
    emotions = [];
};

const propagate_info = () => {
    let current_time = ~~video[0].currentTime + 1;
    clean_boundary_box();
    all_frame.map((people, index) => {
        const data = people[current_time];
        if (data) {
            const bb = data.BoundingBox;
            const lm = data.Landmarks;
            const emotion = data.Emotions[0].Type;
            const gender = data.Gender.Value;
            const id = data.FaceId;
            if (is_advance_drawing && !is_private) create_lm(lm, gender, id);
            create_bb(bb, emotion, gender, id);
            create_name(bb, gender, id, index);
            propagate_emotion_per_frame_per_ppl_chart(data, id);
        }
    });
    propagate_ppl_count();
    propagate_emotion_per_frame_graph(current_time);
};

const create_bb = (bb, emotion, gender, id) => {
    const prepare_bb = "<div class='boundary_box' id='" + id + "'>" +
        "<img class='emotion_img' src='/images/emotion/" + emotion + "_" + gender + ".png'>" +
        "</div>";
    $(prepare_bb).appendTo("#main_video_overlay");
    const new_overlay_bb = $("#" + id);
    if (is_private) new_overlay_bb.addClass("private");
    gender === "Male" ? new_overlay_bb.addClass("male") : new_overlay_bb.addClass("female");
    const css = {
        "width": bb.Width * 100 + "%",
        "height": bb.Height * 100 + "%",
        "top": bb.Top * 100 + "%",
        "left": bb.Left * 100 + "%"
    };
    new_overlay_bb.css(css);
};

const create_name = (bb, gender, id, index) => {
    const prepare_name = "<div class='name_box' id='" + id + "_name'>" +
        name[index] +
        "</div>";
    $(prepare_name).appendTo("#main_video_overlay");
    const new_overlay_name = $("#" + id + "_name");
    gender === "Male" ? new_overlay_name.addClass("male") : new_overlay_name.addClass("female");
    const css = {
        "top": (bb.Top + bb.Height + 0.01) * 100 + "%",
        "left": bb.Left * 100 + "%"
    };
    new_overlay_name.css(css);
};

const create_lm = (lms, gender, id) => {
    lms.map((lm, index) => {
        const prepare_landmark = "<div class='landmark ' id='" + id + "_landmark_" + lm.Type + "'>" +
            "</div>";
        $(prepare_landmark).appendTo("#main_video_overlay");
        const new_overlay_landmark = $("#" + id + "_landmark_" + lm.Type);
        gender === "Male" ? new_overlay_landmark.addClass("male") : new_overlay_landmark.addClass("female");
        const css = {
            "top": lm.Y * 100 + "%",
            "left": lm.X * 100 + "%"
        };
        new_overlay_landmark.css(css);
    });
};