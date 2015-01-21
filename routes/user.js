var express = require('express');
var User = require('../models/User.js');
var mail = require('../services/mail.js');
var hash = require('./../services/hash');
var ConfirmationToken = require('./../models/ConfirmationToken');
var passport = require('passport');
var router = express.Router();


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).end();
};


router.post('/', function(req, res) {
    if (req.isAuthenticated()) {
        return res.json({err: 'Already have a session.'});
    }

    if (!req.body.username) return res.json({err: 'Username was not provided.'});
    if (!req.body.email) return res.json({err: 'Email was not provided.'});
    if (!req.body.password) return res.json({err: 'Password was not provided.'});

    hash(req.body.password, function(err, hash) {
        if (err) {
            console.log('Error: Cannot calculate hash at registration.');
            return res.json({err: 'Cannot calculate hash. Please try again.'});
        }

        var user = new User({
            username: req.body.username,
            displayName: req.body.displayName,
            email: req.body.email,
            password: hash
        });

        user.save(function(err, user) {
            if (err) {
                console.log('Error: Cannot register user', err);
                return res.json({err: err});
            }

            var token = new ConfirmationToken.ConfirmationToken({
                username: user.username
            });

            token.createToken(function(err, token) {
                if (err) {
                    console.log('Err: Could not create confirmation token', err);
                    return res.json({err: 'There is major problem going on. Please try again, if your problem continues, contact us.'});
                }

                mail.sendConfirmationMail(user, token);
                res.json(user.toObject());
            });
        });
    });
});

router.get('/me', ensureAuthenticated, function(req, res) {
    mail.sendWelcomeMail(req.user);
    res.json(req.user.toObject());
});


router.get('/confirmation/:token', function(req, res) {

    ConfirmationToken.confirmUserEmail(req.params.token, function(err) {
        if (err) console.log('Err: Cannot confirm email address.', err);
        res.redirect('/');
    });

    return;

    ConfirmationToken.ConfirmationToken.findOne({
        token: req.params.token
    }, function(err, token) {
        if (err || !token) {
            console.log('Err: Confirmation error', err);
            return res.redirect('/');
        }

        var userId = token._userId;

        User.findOne({_id: token._userId}, function(err, user) {
            if (err || !user) {
                console.log('Err: The user who to be confirm was not found', err);
                return res.redirect('/');
            }

            user.verified = true;
            user.save(function(err) {
                if (err) {
                    console.log('Err: Verified user document could not saved.', err);
                    return res.redirect('/');
                }

                res.redirect('/');
            });
        });
    });
});


router.post('/login',
    passport.authenticate('local', { failureRedirect: '/user/loginFailed' }),
    function(req, res, next) {
        //res.json(req.user);
        res.redirect('/admin');
    });

router.get('/loginFailed', function(req, res) {
    res.status(401).end();
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
