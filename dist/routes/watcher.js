'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.username) {
        res.render('index', { title: 'Dashboard', username: req.session.username });
    } else {
        req.session.destroy();
        res.redirect('/login');
    }
});

module.exports = router;
//# sourceMappingURL=watcher.js.map