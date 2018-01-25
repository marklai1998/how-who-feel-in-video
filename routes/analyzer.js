const express = require('express');
const router = express.Router();

const db = require('../db/videos');
const mongoose = require('mongoose');
const videos = mongoose.model('videos');
const append_video = require('../function/append_video');
const fs = require('fs');


router.get('/', function (req, res, next) {
    if (req.session.username) {
        res.redirect('/videos')
    } else res.redirect('/login')
});

router.get('/:id', function (req, res, next) {
    if (req.session.username) {
        let show_message = false;
        let message = "";
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
        const analyze_video = async (id) => {
            try {
                videos.findOne({_id: id}, function (err, video) {
                    if (video) {
                        const files = fs.readdirSync('./public/upload/' + id + '/append');
                        res.render('analyzer', {
                            title: 'Analyzer',
                            show_message: show_message,
                            message: message,
                            username: req.session.username,
                            id: video._id,
                            file_name: video.file_name,
                            ext: video.file_type,
                            append_video: files
                        });
                    } else {
                        res.redirect('/videos');
                    }
                });
            }
            catch (err) {
                return err
            }
        };
        console.log(analyze_video(req.params.id));
        req.session.message = null;
    } else res.redirect('/login')
});

router.get('/:id/message/:message', function (req, res, next) {
    if (req.session.username) {
        req.session.message = req.params.message;
        res.redirect("/analyzer/" + req.params.id);
    } else res.redirect('/login');
});

router.get('/delete/:_id/:count', function (req, res, next) {
    if (req.session.username) {
        console.log(local_file.remove(req.params._id,req.params.count,function () {
            res.redirect("/videos/message/delete");
        }));
    } else res.redirect('/login');
});

router.post('/:id/upload', function (req, res, next) {
    if (req.session.username) {
        if (!req.files) {
            res.redirect(req.params.id + "/message/no_file");
        }
        if (req.files.video.length > 1) {
            req.files.video.forEach(function (upload_video) {
                console.log(append_video.upload(upload_video, req.headers['content-length'],req.params.id, res));
            });
        } else {
            console.log(append_video.upload(req.files.video, req.headers['content-length'],req.params.id, res));
        }
    } else res.redirect('/login')
});


module.exports = router;
