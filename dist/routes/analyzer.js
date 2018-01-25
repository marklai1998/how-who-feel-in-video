'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();

var db = require('../db/videos');
var mongoose = require('mongoose');
var videos = mongoose.model('videos');

router.get('/', function (req, res, next) {
    if (req.session.username) {
        res.redirect('/videos');
    } else res.redirect('/login');
});

router.get('/:id', function (req, res, next) {
    var _this = this;

    if (req.session.username) {
        var analyze_video = function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;

                                videos.findOne({ _id: id }, function (err, video) {
                                    if (video) {
                                        res.render('analyzer', {
                                            title: 'Analyzer',
                                            username: req.session.username,
                                            id: video._id,
                                            file_name: video.file_name,
                                            ext: video.file_type
                                        });
                                    } else {
                                        res.redirect('/videos');
                                    }
                                });
                                _context.next = 7;
                                break;

                            case 4:
                                _context.prev = 4;
                                _context.t0 = _context['catch'](0);
                                return _context.abrupt('return', _context.t0);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[0, 4]]);
            }));

            return function analyze_video(_x) {
                return _ref.apply(this, arguments);
            };
        }();
        console.log(analyze_video(req.params.id));
    } else res.redirect('/login');
});

module.exports = router;
//# sourceMappingURL=analyzer.js.map