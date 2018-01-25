const express = require('express');
const router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
    if (req.session.username) {
        res.render('about', {title: 'About',username: req.session.username});
    } else {
        req.session.destroy();
        res.redirect('/login');
    }
});

module.exports = router;
