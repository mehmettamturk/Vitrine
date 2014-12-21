var express = require('express');
var Product = require('../models/Product.js');
var CategoryTree = require('../models/CategoryTree.js');

var router = express.Router();


router.get('/list', function(req, res) {
    var categories = CategoryTree.categories;
    res.json(categories);
});


router.get('/:categoryName', function(req, res) {
    var categoryName = req.params.categoryName;

    Product.getProductsByCategoryName(categoryName, function(err, products) {
        if (err) {
            console.log('Err: cannot get products list.', err);
            return res.send(500).end();
        }

        res.json(products);
    });
});


module.exports = router;
