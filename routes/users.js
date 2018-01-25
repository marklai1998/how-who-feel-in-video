const express = require('express');
const router = express.Router();

const db = require('../db/users');
const mongoose = require('mongoose');
const users = mongoose.model('users');

const crypto = require('crypto');

router.get('/', function (req, res, next) {
    if (req.session.username) {
        let show_message = false,
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
        const find_all_users = async () => {
            try {
                const all_users = await users.find();
                res.render('users', {
                    title: 'Users',
                    show_message: show_message,
                    message: message,
                    username: req.session.username,
                    users: all_users
                });
            } catch (err) {
                return err;
            }
        };
        console.log(find_all_users());
        req.session.message = null;
    } else res.redirect('/login')
});

router.get('/message/:message', function (req, res, next) {
    if (req.session.username) {
        req.session.message = req.params.message;
        res.redirect("/users");
    } else res.redirect('/login')
});

router.get('/:action/:username', function (req, res, next) {
    if (req.session.username) {
        const remove_user = async (username) => {
            try {
                const delete_user = await users.find({username: username}).remove().exec();
                req.session.message = "delete";
                res.redirect("/users");
            } catch (err) {
                return err
            }
        };
        console.log(remove_user(req.params.username));
    } else res.redirect('/login')
});

router.post('/', function (req, res, next) {
    if (req.session.username && req.body.username && req.body.password) {
        const add_user = async (username, password) => {
            try {
                const user = await users.findOne({username: req.body.username});
                if (user) {
                    res.redirect('/users/message/exist');
                } else {
                    const hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
                    await new users({
                        username: req.body.username,
                        password: hash,
                        updated_at: Date.now()
                    }).save();
                    res.redirect('/users/message/create');
                }
            }
            catch (err) {
                return err
            }
        };
        console.log(add_user(req.body.username, req.body.password));
    } else res.redirect('/login')
});

module.exports = router;
