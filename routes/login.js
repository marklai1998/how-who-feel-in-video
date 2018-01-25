const express = require('express');
const router = express.Router();

const db = require('../db/users');
const mongoose = require('mongoose');
const users = mongoose.model('users');

const crypto = require('crypto');

router.get('/', function (req, res, next) {
    if (req.session.loginsuccess) {
        res.redirect('/');
    } else {
        let show_message = false,
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
        res.render('login', {title: title, field: field, type: type, show_message: show_message, message: message});
        req.session.message = null;
    }
});

router.get('/message/:message', function (req, res, next) {
    req.session.message = req.params.message;
    res.redirect("/login");
});

router.post('/', function (req, res, next) {
    if (req.session.loginsuccess) res.redirect("/");
    if (req.body.username) {
        const login = async (username) => {
            try {
                const user = await users.findOne({username: username});
                if (user) {
                    req.session.username = user.username;
                    req.session.password = user.password;
                    res.render('login', {title: 'Welcome ' + username, field: 'Password', type: 'Password'});
                } else res.redirect('/login/message/no_user');
            } catch (err) {
                return err
            }
        };
        console.log(login(req.body.username));
    } else if (req.body.password) {
        if (req.session.username && req.session.password) {
            const login = async (username, password) => {
                const hash = crypto.createHash('sha256').update(password).digest('base64');
                if (req.session.password === hash) {
                    try {
                        await users.update({username: username}, {updated_at: Date.now()});
                        req.session.loginsuccess = true;
                        res.redirect("/");
                    } catch (err) {
                        return err
                    }
                } else res.redirect('/login/message/wrong_password')
            };
            console.log(login(req.session.username, req.body.password));
        } else res.redirect("/")
    } else res.redirect("/")
});

module.exports = router;
