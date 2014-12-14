var express = require('express');
var Product = require('../models/Product.js');
var CategoryTree = require('../models/CategoryTree.js');

var router = express.Router();


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).end();
};


function ensureModerator(req, res, next) {
    if (req.isAuthenticated() &&
        req.user.permissions.indexOf('MODERATOR') != -1) {
        return next();
    }

    res.status(401).end();
};


router.get('/categories', function(req, res) {
    var categories = CategoryTree.categories;
    res.json(categories);
});


router.get('/all', function(req, res) {
    Product.find({}, function(err, products) {
        if (err) {
            console.log('Err: cannot get products list.', err);
            return res.send(500).end();
        }

        res.json(products);
    });
});


router.post('/', ensureModerator, function(req, res) {
    if (!req.body.name) return res.json({err: 'Name was not provided.'});
    if (!req.body.displayName) return res.json({err: 'Display name was not provided.'});
    if (!req.body.description) return res.json({err: 'Description was not provided.'});
    if (!req.body.body) return res.json({err: 'Body was not provided.'});
    if (!req.body.price) return res.json({err: 'Price was not provided.'});
    if (!req.body.quantity) return res.json({err: 'Quantity was not provided.'});
    if (!req.body.images) return res.json({err: 'Images were not provided.'});
    if (!req.body.images.length) return res.json({err: 'Images array was empty.'});

    var product = new Product({
        name: req.body.name,
        displayName: req.body.displayName,
        description: req.body.description,
        body: req.body.body,
        price: req.body.price,
        images: req.body.images,
        creator: req.user.username,
        creatorDisplayName: req.user.dispayName,
        remainingQuantity: req.body.quantity,
    });

    product.save(function(err, product) {
        if (err) {
            console.log('Err: cannot get products list.', err);
            return res.send(500).end();
        }

        res.json(product.toObject());
    });
});


module.exports = router;
