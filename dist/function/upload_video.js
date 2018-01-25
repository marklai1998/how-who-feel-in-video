'use strict';

var mongoose = require('mongoose');
var db_videos = mongoose.model('videos');
var videos = mongoose.model('videos');

var S3 = require('./upload_to_S3');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

function Video(file) {
    this.video = file;
}

Video.prototype.remove = function (callback) {
    var video = this.video;
    rimraf('upload/' + video, function (err) {
        if (err) {
            console.log(err);
        } else {
            videos.find({ _id: video }).remove().exec();
            callback();
        }
    });
};

Video.prototype.save = function () {
    var video = this.video;
    var ext = path.extname(video.name);
    var name = path.basename(video.name).slice(0, 0 - ext.length);
    switch (ext) {
        case ".mov":
        case ".mp4":
            new videos({
                file_name: name,
                file_type: ext
            }).save(function (err, new_video, count) {
                var id = new_video.id;
                var path = 'upload/' + id;
                fs.mkdir(path, function (err) {
                    video.mv(path + '/' + id + '_original' + ext, function (err) {
                        var s3 = new S3("fyp-videoinout-bucket", id + ext, video);
                        s3.save();
                    });
                });
            });
            break;
        default:
            return res.status(500).send(err);
    }
};

module.exports = Video;
//# sourceMappingURL=upload_video.js.map