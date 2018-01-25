"use strict";

const emotion_label_lower = ["happy", "sad", "angry", "confused", "disgusted", "surprised", "calm"];
const color_reference = $(".emotion-color-reference").find("li");
const change_spot_control = $(".emotion-change-spot-control").find("i");
const chart_block_overlay = $(".chart_block_overlay");


let emotions = [];
let emotion_time = [];

let total_emotions = [[], [], [], [], [], [], []];
let change_spot = [[], [], [], [], [], [], []];

let video_overall_emotion_graph;
let video_overall_emotion_graph_config = {
    type: 'line',
    data: {
        labels: emotion_time,
        datasets: [{
            label: 'Happy',
            data: total_emotions[0],
            borderColor: [
                '#4CAF50'
            ],
            backgroundColor: [
                '#4CAF50'
            ],
            borderWidth: 1.5,
            type: 'line',
            fill: false,
            hidden: false
        }, {
            label: 'Sad',
            data: total_emotions[1],
            borderColor: [
                '#2196F3'
            ],
            backgroundColor: [
                '#2196F3'
            ],
            borderWidth: 1,
            type: 'line',
            fill: false,
            hidden: false
        }, {
            label: 'Angry',
            data: total_emotions[2],
            borderColor: [
                '#F44336'
            ],
            backgroundColor: [
                '#F44336'
            ],
            borderWidth: 1,
            type: 'line',
            fill: false,
            hidden: false
        }, {
            label: 'Confused',
            data: total_emotions[3],
            borderColor: [
                '#FF9800'
            ],
            backgroundColor: [
                '#FF9800'
            ],
            borderWidth: 1,
            type: 'line',
            fill: false,
            hidden: false
        }, {
            label: 'Disgusted',
            data: total_emotions[4],
            borderColor: [
                '#673AB7'
            ],
            backgroundColor: [
                '#673AB7'
            ],
            borderWidth: 1,
            type: 'line',
            fill: false,
            hidden: false
        }, {
            label: 'Surprised',
            data: total_emotions[5],
            borderColor: [
                '#FFEB3B'
            ],
            backgroundColor: [
                '#FFEB3B'
            ],
            borderWidth: 1,
            type: 'line',
            fill: false,
            hidden: false
        }, {
            label: 'CALM',
            data: total_emotions[6],
            borderColor: [
                '#009688'
            ],
            backgroundColor: [
                '#009688'
            ],
            borderWidth: 1,
            type: 'line',
            fill: false,
            hidden: false
        }]
    },
    options: {
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                position: 'right',
                ticks: {
                    beginAtZero: false,
                    fontColor: '#494949',
                    stepSize: 1
                }
            }]
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            displayColors: false,
            callbacks: {
                label: (t, d) => {
                    if (t.yLabel === 0) {
                        return false;
                    } else {
                        return d.datasets[t.datasetIndex].label + ": " + t.yLabel;
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }
};

let emotion_per_frame_graph;
let emotion_per_frame_graph_config = {
    data: {
        datasets: [{
            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#F44336',
                '#FF9800',
                '#673AB7',
                '#FFEB3B',
                '#009688'
            ]
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Happy',
            'Sad',
            'Angry',
            'Confused',
            'Disgusted',
            'Surprised',
            'CALM'
        ]
    },
    type: 'doughnut',
    options: {
        legend: {
            display: false
        }
    }
};

const set_video_overall_emotion_graph = () => {
    const canvas = document.getElementById("total_emotion");
    const parent = document.getElementById('parent');
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    let ctx = document.getElementById("total_emotion").getContext('2d');
    video_overall_emotion_graph = new Chart(ctx, video_overall_emotion_graph_config);

    const graph = video_overall_emotion_graph;
    for (let dataset_count = 0; dataset_count < graph.data.datasets.length; dataset_count++) {
        let dataset = graph.data.datasets[dataset_count];
        for (let dataset_data_count = 0; dataset_data_count < dataset.data.length; dataset_data_count++) {
            let point = graph.getDatasetMeta(dataset_count).data[dataset_data_count];
            if (dataset.data[dataset_data_count] > dataset.data[dataset_data_count + 1] && dataset.data[dataset_data_count] > dataset.data[dataset_data_count - 1]) {
                let dominate = 0;
                for (let compare_dataset_count = 0; compare_dataset_count < graph.data.datasets.length; compare_dataset_count++) {
                    if (graph.data.datasets[compare_dataset_count].data[dataset_data_count - 1] < dataset.data[dataset_data_count - 1]) {
                        dominate++;
                    }
                }
                if (dominate < 3) {
                    set_change_spot(point, dataset_count, dataset_data_count);
                }
            } else if (dataset.data[dataset_data_count] > dataset.data[dataset_data_count + 2] && dataset.data[dataset_data_count] > dataset.data[dataset_data_count - 2]) {
                let dominate = 0;
                for (let compare_dataset_count = 0; compare_dataset_count < graph.data.datasets.length; compare_dataset_count++) {
                    if (graph.data.datasets[compare_dataset_count].data[dataset_data_count - 2] < dataset.data[dataset_data_count - 2]) {
                        dominate++;
                    }
                }
                if (dominate < 3) {
                    set_change_spot(point, dataset_count, dataset_data_count);
                }
            }
        }
    }
    graph.update();
    for (let index = 0; index < total_emotions.length; index++) {
        if (change_spot[index].length === 0) {
            $("#change_spot_" + index).text("\xa0");
        }
    }
};

const set_change_spot = (point, dataset_count, dataset_data_count) => {
    point.custom = point.custom || {};
    point.custom.radius = 4;
    change_spot[dataset_count].push(dataset_data_count);
};

change_spot_control.click(function () {
    if ($(this).hasClass("fa-angle-left")) {
        const array = change_spot[$(this).closest('li').attr('id').replace('change_spot_', '')];
        const current_time = ~~video[0].currentTime;
        for (let count = array.length; count >= 0; count--) {
            if (array[count] < current_time) {
                video_goto(array[count]);
                break;
            }
        }
    } else if ($(this).hasClass("fa-angle-right")) {
        const array = change_spot[$(this).closest('li').attr('id').replace('change_spot_', '')];
        const current_time = ~~video[0].currentTime;
        for (let count = 0; count < array.length; count++) {
            if (array[count] > current_time) {
                video_goto(array[count]);
                break;
            }
        }
    }
});

color_reference.click(function () {
    $(this).toggleClass("non-visible");
    toggle_datasets_visibility_video_overall_emotion_graph(this.id);
});

const toggle_datasets_visibility_video_overall_emotion_graph = (emotion) => {
    let datasets = 0;
    emotion_label_lower.map((value, index)=>{
        if(emotion ===value){
            datasets = index;
        }
    });
    let dataset = video_overall_emotion_graph.data.datasets[datasets];
    dataset.hidden = !dataset.hidden;
    video_overall_emotion_graph.update();
};

const set_emotion_per_frame_graph = () => {
    let ctx = document.getElementById("emotion_per_frame").getContext('2d');
    emotion_per_frame_graph = new Chart(ctx, emotion_per_frame_graph_config);
};

const propagate_emotion_per_frame_graph = (current_time) => {
    let datasets = emotion_per_frame_graph_config.data.datasets[0];
    for (let data_count = 0; data_count <= 6; data_count++) {
        datasets.data[data_count] = total_emotions[data_count][current_time];
    }
    emotion_per_frame_graph.update();
};

const propagate_emotion_per_frame_per_ppl_chart = (people, id) => {
    let emotion = people.Emotions;
    emotions[id] = {
        labels: [emotion[0].Type, emotion[1].Type, emotion[2].Type],
        datasets: [{
            label: "Percentage",
            data: [emotion[0].Confidence, emotion[1].Confidence, emotion[2].Confidence],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255,99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };
};

const set_emotion_per_frame_per_ppl_chart = (target) => {
    remove_emotion_per_frame_per_ppl_chart();
    let id = target.id;
    chart_block_overlay.fadeIn("", () => {
        let ctx = document.getElementById("chart_block_overlay").getContext('2d');
        new Chart(ctx, {
            type: 'horizontalBar',
            data: emotions[id],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#494949'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
                            callback: (value) => value + "%",
                            fontColor: '#494949'
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    });
};

const remove_emotion_per_frame_per_ppl_chart = () => chart_block_overlay.fadeOut("fast");