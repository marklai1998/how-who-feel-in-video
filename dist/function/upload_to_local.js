'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoose = require('mongoose');
var db_videos = mongoose.model('videos');
var videos = mongoose.model('videos');

var S3 = require('./upload_to_S3');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

exports.remove = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callback) {
        var video;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        video = undefined.video;

                        rimraf('upload/' + video, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                videos.find({ _id: video }).remove().exec();
                                callback();
                            }
                        });

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.upload = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(upload_video, res) {
        var ext, name, video, id, _path;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        ext = path.extname(upload_video.name);
                        name = path.basename(upload_video.name).slice(0, 0 - ext.length);
                        _context2.t0 = ext;
                        _context2.next = _context2.t0 === ".mov" ? 5 : _context2.t0 === ".mp4" ? 5 : 21;
                        break;

                    case 5:
                        _context2.prev = 5;
                        _context2.next = 8;
                        return videos({
                            file_name: name,
                            file_type: ext
                        }).save();

                    case 8:
                        video = _context2.sent;
                        id = video.id;
                        _path = 'upload/' + id;
                        _context2.next = 13;
                        return fs.mkdir(_path);

                    case 13:
                        _context2.next = 15;
                        return upload_video.mv(_path + '/' + id + '_original' + ext);

                    case 15:
                        _context2.next = 20;
                        break;

                    case 17:
                        _context2.prev = 17;
                        _context2.t1 = _context2['catch'](5);
                        return _context2.abrupt('return', _context2.t1);

                    case 20:
                        return _context2.abrupt('break', 22);

                    case 21:
                        return _context2.abrupt('return', res.status(500).send(err));

                    case 22:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[5, 17]]);
    }));

    return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();
//# sourceMappingURL=upload_to_local.js.map