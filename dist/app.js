'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var videos = require('./routes/videos');
var analyzer = require('./routes/analyzer');
var users = require('./routes/users');
var about = require('./routes/about');
var login = require('./routes/login');
var logout = require('./routes/logout');

var app = express();

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Basic usage
mongoose.connect('mongodb://localhost/hwfiv', {
    useMongoClient: true
    /* other options */
});

app.use(session({
    secret: 'hwfiv',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 60 * 60 })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var fileUpload = require('express-fileupload');
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/videos', videos);
app.use('/analyzer', analyzer);
app.use('/users', users);
app.use('/about', about);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
//# sourceMappingURL=app.js.map