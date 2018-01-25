'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
    if (req.session.username) {
        res.render('index', { title: 'Dashboard', username: req.session.username });
    } else res.redirect('/login');
});

module.exports = router;
//# sourceMappingURL=index.js.map