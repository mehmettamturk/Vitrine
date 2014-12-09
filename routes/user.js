var express = require('express');
var User = require('../models/User.js');

// Passport.js
var passport = require('passport');
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).end();
};


router.get('/me', ensureAuthenticated, function(req, res) {
    res.json(req.user.toObject());
});


router.post('/login',
    passport.authenticate('local', { failureRedirect: '/user/loginFailed' }),
    function(req, res) {
        res.json(req.user);
    });

router.get('/loginFailed', function(req, res) {
    res.status(401).end();
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
