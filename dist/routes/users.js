'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();

var db = require('../db/users');
var mongoose = require('mongoose');
var users = mongoose.model('users');

var crypto = require('crypto');

router.get('/', function (req, res, next) {
    var _this = this;

    if (req.session.username) {
        var show_message = false,
            message = "";
        switch (req.session.message) {
            case "delete":
                show_message = true;
                message = "User is deleted";
                break;
            case "create":
                show_message = true;
                message = "User is created";
                break;
            case "exist":
                show_message = true;
                message = "User already exist";
                break;
        }
        var find_all_users = function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var all_users;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return users.find();

                            case 3:
                                all_users = _context.sent;

                                res.render('users', {
                                    title: 'Users',
                                    show_message: show_message,
                                    message: message,
                                    username: req.session.username,
                                    users: all_users
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

            return function find_all_users() {
                return _ref.apply(this, arguments);
            };
        }();
        console.log(find_all_users());
        req.session.message = null;
    } else res.redirect('/login');
});

router.get('/message/:message', function (req, res, next) {
    if (req.session.username) {
        req.session.message = req.params.message;
        res.redirect("/users");
    } else res.redirect('/login');
});

router.get('/:action/:username', function (req, res, next) {
    var _this2 = this;

    if (req.session.username) {
        var remove_user = function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(username) {
                var delete_user;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return users.find({ username: username }).remove().exec();

                            case 3:
                                delete_user = _context2.sent;

                                req.session.message = "delete";
                                res.redirect("/users");
                                _context2.next = 11;
                                break;

                            case 8:
                                _context2.prev = 8;
                                _context2.t0 = _context2['catch'](0);
                                return _context2.abrupt('return', _context2.t0);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this2, [[0, 8]]);
            }));

            return function remove_user(_x) {
                return _ref2.apply(this, arguments);
            };
        }();
        console.log(remove_user(req.params.username));
    } else res.redirect('/login');
});

router.post('/', function (req, res, next) {
    var _this3 = this;

    if (req.session.username && req.body.username && req.body.password) {
        var add_user = function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(username, password) {
                var user, hash;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return users.findOne({ username: req.body.username });

                            case 3:
                                user = _context3.sent;

                                if (!user) {
                                    _context3.next = 8;
                                    break;
                                }

                                res.redirect('/users/message/exist');
                                _context3.next = 12;
                                break;

                            case 8:
                                hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
                                _context3.next = 11;
                                return new users({
                                    username: req.body.username,
                                    password: hash,
                                    updated_at: Date.now()
                                }).save();

                            case 11:
                                res.redirect('/users/message/create');

                            case 12:
                                _context3.next = 17;
                                break;

                            case 14:
                                _context3.prev = 14;
                                _context3.t0 = _context3['catch'](0);
                                return _context3.abrupt('return', _context3.t0);

                            case 17:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, _this3, [[0, 14]]);
            }));

            return function add_user(_x2, _x3) {
                return _ref3.apply(this, arguments);
            };
        }();
        console.log(add_user(req.body.username, req.body.password));
    } else res.redirect('/login');
});

module.exports = router;
//# sourceMappingURL=users.js.map