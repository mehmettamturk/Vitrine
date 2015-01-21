var express = require('express');
var User = require('../models/User.js');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Vitrine'});
});

router.get('/admin', function (req, res) {
    console.log('ADMIN ')
    var username = req.session.passport && req.session.passport.user;

    if (username)
        User.findOne({username: username, permissions: 'MODERATOR'}, function (err, user) {
            if (user)
                res.render('admin', {title: 'Vitrine | Admin Panel'});
            else
                res.redirect('/admin/login');
        });
    else
        res.redirect('/admin/login');
});

router.get('/admin/login', function (req, res) {
    res.render('adminLogin', {title: 'Vitrine | Admin Panel'});
});

module.exports = router;
