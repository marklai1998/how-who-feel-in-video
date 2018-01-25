'use strict';

var db = require('../db/videos');

var mongoose = require('mongoose');
var videos = mongoose.model('videos');

var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');

exports.upload = function upload(video) {
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
                        var buff = new Buffer(100);
                        fs.open(path + '/' + new_video.id + '_original' + ext, 'r', function (err, fd) {
                            fs.read(fd, buff, 0, 100, 0, function (err, bytesRead, buffer) {
                                var start = buffer.indexOf(new Buffer('mvhd')) + 17;
                                var timeScale = buffer.readUInt32BE(start, 4);
                                var duration = buffer.readUInt32BE(start + 4, 4);
                                var movieLength = Math.floor(duration / timeScale);
                                videos.update({ _id: id }, {
                                    duration: movieLength
                                }, function (err, new_video, count) {
                                    console.log('time scale: ' + timeScale);
                                    console.log('duration: ' + duration);
                                    console.log('movie length: ' + movieLength + ' seconds');
                                });
                            });
                        });
                    });
                });
            });
            break;
        default:
            return res.status(500).send(err);
    }
};
//# sourceMappingURL=local_file.js.map
//# sourceMappingURL=local_file.js.map