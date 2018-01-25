'use strict';

var mongoose = require('mongoose');
var db_videos = mongoose.model('videos');

var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');

var buff = new Buffer(100);
fs.open(path + '/' + new_video.id + '_original' + ext, 'r', function (err, fd) {
    fs.read(fd, buff, 0, 100, 0, function (err, bytesRead, buffer) {
        var start = buffer.indexOf(new Buffer('mvhd')) + 17;
        var timeScale = buffer.readUInt32BE(start, 4);
        var duration = buffer.readUInt32BE(start + 4, 4);
        var movieLength = Math.floor(duration / timeScale);
        db_videos.update({ _id: id }, {
            duration: movieLength
        }, function (err, new_video, count) {
            console.log('time scale: ' + timeScale);
            console.log('duration: ' + duration);
            console.log('movie length: ' + movieLength + ' seconds');
        });
    });
});
//# sourceMappingURL=get_duration.js.map