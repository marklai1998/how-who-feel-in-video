'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var db_videos = mongoose.model('videos');
var videos = mongoose.model('videos');

var s3_file = require('./s3_file');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var ffmpeg = require('fluent-ffmpeg');

exports.remove = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id, calllback) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return rimraf('./public/upload/' + id, function (err) {});

                    case 3:
                        _context.next = 5;
                        return videos.find({ _id: id }).remove().exec();

                    case 5:
                        _context.next = 7;
                        return calllback();

                    case 7:
                        _context.next = 12;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', _context.t0);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 9]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

exports.upload = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(upload_video, size, res) {
        var ext, name, video, id, _path;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        ffmpeg.setFfmpegPath("c:\\ffmpeg\\bin\\ffmpeg.exe");
                        ffmpeg.setFfprobePath("c:\\ffmpeg\\bin\\ffprobe.exe");
                        ext = path.extname(upload_video.name);
                        name = path.basename(upload_video.name).slice(0, 0 - ext.length);
                        _context2.t0 = ext;
                        _context2.next = _context2.t0 === ".mov" ? 7 : _context2.t0 === ".mp4" ? 7 : 27;
                        break;

                    case 7:
                        _context2.prev = 7;
                        _context2.next = 10;
                        return videos({
                            file_name: name,
                            file_type: ext,
                            size: formatBytes(size)
                        }).save();

                    case 10:
                        video = _context2.sent;
                        id = video.id;
                        _path = './public/upload/' + id;
                        _context2.next = 15;
                        return fs.mkdir(_path);

                    case 15:
                        _context2.next = 17;
                        return upload_video.mv(_path + '/' + id + '_original' + ext);

                    case 17:
                        _context2.next = 19;
                        return new ffmpeg(_path + '/' + id + '_original' + ext).screenshots({
                            timestamps: ['50%'],
                            filename: id + '.png',
                            folder: _path
                        });

                    case 19:
                        _context2.next = 21;
                        return ffmpeg.ffprobe(_path + '/' + id + '_original' + ext, function (err, metadata) {
                            if (err) {
                                console.error(err);
                            } else {
                                // metadata should contain 'width', 'height' and 'display_aspect_ratio'
                                var dimension = metadata.streams[0].width + " x " + metadata.streams[0].height;
                                var duration = toHHMMSS(metadata.streams[0].duration);
                                videos.update({ _id: id }, { duration: duration, dimension: dimension }, function () {
                                    console.log(duration);
                                });
                            }
                        });

                    case 21:
                        _context2.next = 26;
                        break;

                    case 23:
                        _context2.prev = 23;
                        _context2.t1 = _context2['catch'](7);
                        return _context2.abrupt('return', _context2.t1);

                    case 26:
                        return _context2.abrupt('break', 28);

                    case 27:
                        res.status(500).send(err);

                    case 28:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[7, 23]]);
    }));

    return function (_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}();

function formatBytes(bytes, decimals) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function toHHMMSS(second) {
    var sec_num = parseInt(second, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

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
//# sourceMappingURL=local_file.js.map