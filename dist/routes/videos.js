'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();

var db = require('../db/videos');
var mongoose = require('mongoose');
var videos = mongoose.model('videos');

var local_file = require('../function/local_file');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');

router.get('/', function (req, res, next) {
    var _this = this;

    if (req.session.username) {
        var show_message = false;
        var message = "";
        switch (req.session.message) {
            case "no_file":
                show_message = true;
                message = "No file selected";
                break;
            case "success":
                show_message = true;
                message = "Upload success";
                break;
            case "error":
                show_message = true;
                message = "Error";
                break;
            case "delete":
                show_message = true;
                message = "Video deleted";
                break;
        }
        var find_all_videos = function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var all_videos;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return videos.find();

                            case 3:
                                all_videos = _context.sent;

                                res.render('videos', {
                                    title: 'Videos',
                                    show_message: show_message,
                                    message: message,
                                    username: req.session.username,
                                    videos: all_videos
                                });
                                _context.next = 10;
                                break;

                            case 7:
                                _context.prev = 7;
                                _context.t0 = _context['catch'](0);
                                return _context.abrupt('return', _context.t0);

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[0, 7]]);
            }));

            return function find_all_videos() {
                return _ref.apply(this, arguments);
            };
        }();
        console.log(find_all_videos());
        req.session.message = null;
    } else res.redirect('/login');
});

router.get('/message/:message', function (req, res, next) {
    if (req.session.username) {
        req.session.message = req.params.message;
        res.redirect("/videos");
    } else res.redirect('/login');
});

router.get('/delete/:_id', function (req, res, next) {
    if (req.session.username) {
        console.log(local_file.remove(req.params._id, function () {
            res.redirect("/videos/message/delete");
        }));
    } else res.redirect('/login');
});

router.post('/upload', function (req, res, next) {
    if (req.session.username) {
        if (!req.files) {
            res.redirect("/videos/message/no_file");
        }
        if (req.files.video.length > 1) {
            req.files.video.forEach(function (upload_video) {
                console.log(local_file.upload(upload_video, req.headers['content-length'], res));
            });
        } else {
            console.log(local_file.upload(req.files.video, req.headers['content-length'], res));
        }
    } else res.redirect('/login');
});

module.exports = router;
//# sourceMappingURL=videos.js.map