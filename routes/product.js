var express = require('express');
var Product = require('../models/Product.js');
var CategoryTree = require('../models/CategoryTree.js');
var fs = require('fs');
var multer  = require('multer');

var router = express.Router();

router.use(multer({
    dest: '../preserved/uploads/product/'
}));

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


router.get('/all', function(req, res) {
    Product.find({type: 'product'}, function(err, products) {
        if (err) {
            console.log('Err: cannot get products list.', err);
            return res.send(500).end();
        }

        res.json(products);
    });
});


router.get('/:productName', function(req, res) {
    var name = req.params.productName;

    Product.find({name: name}, function(err, product) {
        if (err) {
            console.log('Err: cannot find product.', err);
            return res.send(500).end();
        }

        res.json(product);
    });
});


router.put('/:productName', function(req, res) {
    var name = req.params.productName;

    Product.find({name: name}, function(err, product) {
        if (err) {
            console.log('Err: cannot find product.', err);
            return res.send(500).end();
        }

        req.body.name && product.name = req.body.name;
        req.body.displayName && product.displayName = req.body.displayName;
        req.body.description && product.description = req.body.description;
        req.body.body && product.body = req.body.body;
        req.body.price && product.price = req.body.price;
        req.body.features && product.features = req.body.features;
        req.body.images && product.images = req.body.images;
        req.body.remainingQuantity && product.remainingQuantity = req.body.remainingQuantity;

        product.save(function(err) {
            if (err) {
                console.log('Err: cannot update product.', err);
                return res.send(500).end();
            }

            res.json(product);
        });
    });
});


router.post('/', ensureModerator, function(req, res) {
    if (!req.body.categoryName) return res.json({err: 'Category name was not provided.'});
    if (!req.body.name) return res.json({err: 'Name was not provided.'});
    if (!req.body.displayName) return res.json({err: 'Display name was not provided.'});
    if (!req.body.description) return res.json({err: 'Description was not provided.'});
    if (!req.body.body) return res.json({err: 'Body was not provided.'});
    if (!req.body.price) return res.json({err: 'Price was not provided.'});
    if (!req.body.quantity) return res.json({err: 'Quantity was not provided.'});
    //if (!req.body.images) return res.json({err: 'Images were not provided.'});
    //if (!req.body.images.length) return res.json({err: 'Images array was empty.'});

    Product.addProduct({
        name: req.body.name,
        displayName: req.body.displayName,
        description: req.body.description,
        body: req.body.body,
        price: req.body.price,
        images: req.body.images,
        creator: req.user.username,
        creatorDisplayName: req.user.dispayName,
        remainingQuantity: req.body.quantity,
    }, req.body.categoryName, function(err, product) {
        if (err) {
            console.log('Err: cannot get products list.', err);
            return res.send(500).end();
        }

        res.json(product.toObject());
    });
});

router.get('/image/:imageName', function(req, res) {
    var imageDir = '../preserved/uploads/product/' + req.params.imageName + '.jpg';
    fs.readFile(imageDir, function(err, image) {
        if (err && err.code == 'ENOENT') {
            var img = require('fs').readFileSync('./no_image.png');
            res.writeHead(200, {'Content-Type': 'image/png' });
            return res.end(img, 'binary');
        } else
            res.end(image, 'binary');
    });

});

router.post('/uploadImage/:productId', function(req, res) {
    var file = req.files.data;
    if (!file || !fs.existsSync(file.path))
        return res.status(400).send({ error: 'Upload failed.' });

    if (file.size === 0) {
        fs.unlink(file.path);
        return res.status(412).send({ error: 'Upload failed.' });
    }

    if (file.size > 1024 * 1024) {
        fs.unlink(file.path);
        return res.status(413).send({ error: 'You can not upload an image file larger than 1 megabytes.' });
    }

    var sourceDir = '../preserved/uploads/product/' + file.name;
    var newFileName = req.params.productId + '_' + new Date().getTime();
    var imageDir = '../preserved/uploads/product/' + newFileName + '.jpg';

    fs.rename(sourceDir, imageDir, function(err) {
        if (err) return res.status(500).send({ error: 'Upload image failed.' });

        Product.findOne({_id: req.params.productId}, function(err, product) {
            if (err) return res.status(500).send({ error: 'Upload image failed.' });
            if (!product.images.length)
                product.images = [];

            product.images.push(newFileName);
            product.save(function() {
                console.log(newFileName)
                res.status(200).send({photoPath: newFileName});
            });
        });
    });
});


router.get('/uploadImage/:productId', function(req, res) {

});

module.exports = router;
