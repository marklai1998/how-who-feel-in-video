const mongoose = require('mongoose');
const videos = mongoose.model('videos');

const s3_file = require('./s3_file');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const ffmpeg = require('fluent-ffmpeg');

exports.remove = async (id, callback) => {
    try {
        await rimraf('./public/upload/' + id, function (err) {
        });
        await videos.find({_id: id}).remove().exec();
        await callback();
    } catch (err) {
        return err
    }
};

exports.upload = async (upload_video, size, res) => {
    ffmpeg.setFfmpegPath("c:\\ffmpeg\\bin\\ffmpeg.exe");
    ffmpeg.setFfprobePath("c:\\ffmpeg\\bin\\ffprobe.exe");
    let ext = path.extname(upload_video.name);
    let name = path.basename(upload_video.name).slice(0, 0 - ext.length);
    switch (ext) {
        case ".mov":
        case ".mp4":
            try {
                const video = await videos({
                    file_name: name,
                    file_type: ext,
                    size: formatBytes(size)
                }).save();
                const id = video.id;
                const path = './public/upload/' + id;
                await fs.mkdir(path);
                await fs.mkdir(path+"/append");
                await upload_video.mv(path + '/original' + ext);
                // await s3_file.upload("fyp-videoinout-bucket", id + ext, upload_video);
                await new ffmpeg(path + '/original' + ext).screenshots({
                    timestamps: ['50%'],
                    filename: 'thumbnail.png',
                    folder: path
                });
                await ffmpeg.ffprobe(path + '/original' + ext, function (err, metadata) {
                    if (err) {
                        console.error(err);
                    } else {
                        // metadata should contain 'width', 'height' and 'display_aspect_ratio'
                        let dimension = metadata.streams[0].width + " x " + metadata.streams[0].height;
                        let duration = toHHMMSS(metadata.streams[0].duration);
                        videos.update({_id: id}, {duration: duration, dimension: dimension}, function () {
                            console.log(duration)
                        });
                    }
                });
            } catch (err) {
                return err
            }
            break;
        default:
            res.status(500).send(err);
    }
};

function formatBytes(bytes, decimals) {
    if (bytes === 0) return '0 Bytes';
    let k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function toHHMMSS(second) {
    let sec_num = parseInt(second, 10); // don't forget the second param
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}