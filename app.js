global.config = require('./config.json');

var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


var db = require('./models/db');
var User = require('./models/User.js');

var routes = require('./routes/index');
var user = require('./routes/user');
var product = require('./routes/product');
var category = require('./routes/category');




// Passport.js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    User.findOne({username: id}, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username, password);
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            user.verifyPassword(password, function(err, authentic) {
                if (err || !authentic) return done(null, false);
                else done(null, user);
            });
        });
    }
));


var app = express();
var myRedisStore = new RedisStore();
var myCookieParser = cookieParser();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(myCookieParser);
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({
    key: 'vitrine.sid',
    store: myRedisStore,
    secret: 'secret'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/product', product);
app.use('/category', category);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
