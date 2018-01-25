'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var router = express.Router();

var db = require('../db/users');
var mongoose = require('mongoose');
var users = mongoose.model('users');

var crypto = require('crypto');

router.get('/', function (req, res, next) {
    if (req.session.loginsuccess) {
        res.redirect('/');
    } else {
        var show_message = false,
            message = "",
            title = 'Login',
            field = 'Username',
            type = 'Text';
        switch (req.session.message) {
            case "no_user":
                show_message = true;
                message = "Username not found";
                break;
            case "wrong_password":
                show_message = true;
                message = "Password is incorrect";
                type = 'Password';
                title = 'Welcome ' + req.session.username;
                field = 'Password';
                break;
        }
        res.render('login', { title: title, field: field, type: type, show_message: show_message, message: message });
        req.session.message = null;
    }
});

router.get('/message/:message', function (req, res, next) {
    req.session.message = req.params.message;
    res.redirect("/login");
});

router.post('/', function (req, res, next) {
    var _this = this;

    if (req.session.loginsuccess) res.redirect("/");
    if (req.body.username) {
        var login = function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(username) {
                var user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return users.findOne({ username: username });

                            case 3:
                                user = _context.sent;

                                if (user) {
                                    req.session.username = user.username;
                                    req.session.password = user.password;
                                    res.render('login', { title: 'Welcome ' + username, field: 'Password', type: 'Password' });
                                } else res.redirect('/login/message/no_user');
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

            return function login(_x) {
                return _ref.apply(this, arguments);
            };
        }();
        console.log(login(req.body.username));
    } else if (req.body.password) {
        if (req.session.username && req.session.password) {
            var _login = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(username, password) {
                    var hash;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    hash = crypto.createHash('sha256').update(password).digest('base64');

                                    if (!(req.session.password === hash)) {
                                        _context2.next = 14;
                                        break;
                                    }

                                    _context2.prev = 2;
                                    _context2.next = 5;
                                    return users.update({ username: username }, { updated_at: Date.now() });

                                case 5:
                                    req.session.loginsuccess = true;
                                    res.redirect("/");
                                    _context2.next = 12;
                                    break;

                                case 9:
                                    _context2.prev = 9;
                                    _context2.t0 = _context2['catch'](2);
                                    return _context2.abrupt('return', _context2.t0);

                                case 12:
                                    _context2.next = 15;
                                    break;

                                case 14:
                                    res.redirect('/login/message/wrong_password');

                                case 15:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this, [[2, 9]]);
                }));

                return function _login(_x2, _x3) {
                    return _ref2.apply(this, arguments);
                };
            }();
            console.log(_login(req.session.username, req.body.password));
        } else res.redirect("/");
    } else res.redirect("/");
});

module.exports = router;
//# sourceMappingURL=login.js.map