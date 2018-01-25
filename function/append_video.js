const mongoose = require('mongoose');
const db_videos = mongoose.model('videos');
const videos = mongoose.model('videos');

const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

exports.remove = async (id, count, calllback) => {
    try {
        await rimraf('./public/upload/' + id, function (err) {
        });
        await videos.find({_id: id}).remove().exec();
        await calllback();
    } catch (err) {
        return err
    }
};

exports.upload = async (upload_video, size, id, res) => {
    let ext = path.extname(upload_video.name);
    let name = path.basename(upload_video.name).slice(0, 0 - ext.length);
    switch (ext) {
        case ".mov":
        case ".mp4":
            try {
                const path = './public/upload/' + id + '/append';
                await upload_video.mv(path + '/' + name + ext);
            } catch (err) {
                return err
            }
            break;
        default:
            res.status(500).send(err);
    }
};