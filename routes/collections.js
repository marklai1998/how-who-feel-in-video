const express = require('express');
const router = express.Router();

const db = require('../db/collections');
const mongoose = require('mongoose');
const collections = mongoose.model('collections');

const create_collection = require('../function/create_collection');

router.get('/', function (req, res, next) {
    if (req.session.username) {
        let show_message = false;
        let message = "";
        switch (req.session.message) {
            case "error":
                show_message = true;
                message = "Error";
                break;
            case "delete":
                show_message = true;
                message = "Collection deleted";
                break;
        }
        const find_all_collections = async () => {
            try {
                const all_collections = await collections.find();
                res.render('collections', {
                    title: 'Collections',
                    show_message: show_message,
                    message: message,
                    username: req.session.username,
                    collections: all_collections
                });
            } catch (err) {
                return err;
            }
        };
        console.log(find_all_collections());
        req.session.message = null;
    } else res.redirect('/login')
});

router.get('/:id', function (req, res, next) {
    if (req.session.username) {
        let show_message = false;
        let message = "";
        switch (req.session.message) {
            case "error":
                show_message = true;
                message = "Error";
                break;
        }
        res.render('collection', {
            title: 'Collection',
            show_message: show_message,
            message: message,
            username: req.session.username,
            id: req.params.id
        });
        req.session.message = null;
    } else res.redirect('/login')
});

router.get('/message/:message', function (req, res, next) {
    if (req.session.username) {
        req.session.message = req.params.message;
        res.redirect("/collections");
    } else res.redirect('/login');
});

router.get('/delete/:_id', function (req, res, next) {
    if (req.session.username) {
        console.log(create_collection.remove(req.params._id, function () {
            res.redirect("/collections/message/delete");
        }));
    } else res.redirect('/login');
});

module.exports = router;
