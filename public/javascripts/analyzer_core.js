const emotion_label = ["HAPPY", "SAD", "ANGRY", "CONFUSED", "DISGUSTED", "SURPRISED", "CALM"];
let all_frame = [];
const name = ["Mark Lai", "Karlos Lam"];

$(document).ready(() => {
    video.get(0).load();
    append_videos.find("video").each(function () {
        this.load();
    });
    video.on("loadeddata", () => {
        duration.text(format(video[0].duration));
        resize_overlay();
        $.getJSON("/upload/" + id + "/original.json", (file) => {
            const json = file.Record;
            json.map((value, person_count) => {
                const person = value.Person;
                all_frame[person_count] = [];
                person.map((data) => {
                    const sec = data.FrameNumber;
                    all_frame[person_count][sec] = data;
                });
                const prepare_name = "<li>" +
                    name[person_count] +
                    "</li>";
                if (person[0].Gender.Value === "Male") {
                    male_count_total.text(parseInt(male_count_total.text()) + 1);
                    $(prepare_name).appendTo("ul.styled.male");
                } else {
                    female_count_total.text(parseInt(female_count_total.text()) + 1);
                    $(prepare_name).appendTo("ul.styled.female");
                }

            });
            people_count_total.text(json.length);
            set_video_overall_emotion_graph();
            propagate_info();
            overlay.fadeIn("");
        });
        $.getJSON("/upload/" + id + "/node.json", (file) => {
            const json = file.Result;
            for (let sec = 0; sec <= video[0].duration; sec++) {
                const key = String(sec + 1);
                for (let index = 0; index < total_emotions.length; index++) total_emotions[index][sec] = 0
                emotion_time[sec] = "Time: " + format(sec);
                if (json[key]) {
                    json[key].map((people) => {
                        emotion_label.map((value, index) => {
                            if (people.Emotions[0].Type === value) total_emotions[index][sec]++
                        });
                    });
                }
            }
            set_video_overall_emotion_graph();
        });
    });
    set_emotion_per_frame_graph();
});