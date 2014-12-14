var mongoose = require('mongoose'),
    materializedPlugin = require('mongoose-materialized'),
    path = require('path'),
    async = require('async'),
    argv = require('optimist').argv,
    autoinc = require('mongoose-id-autoinc');


function nameValidator (v) {
  return v && v.length < 30;
};

function displayNameValidator (v) {
  return v && v.length < 60;
};

function descriptionValidator (v) {
  return v && v.length < 100;
};

function bodyValidator (v) {
  return v && v.length < 5000;
};

var featureSchema = mongoose.Schema({
    type: {type: String, enum: ['enum', 'number', 'bool']},
    value: mongoose.Schema.Types.Mixed
}, {_id: false});

var productSchema = mongoose.Schema({
    name: {type: String, validate: [nameValidator, 'Name is too long.'], required: true, unique: true},
    displayName: {type: String, validate: [displayNameValidator, 'Display name is too long.'], required: true},
    description: {type: String, validate: [descriptionValidator, 'Description is too long.'], required: true},
    body: {type: String, validate: [bodyValidator, 'Body is too long.'], required: true},
    price: {type: Number, min: 0, required: true},
    features: [featureSchema],
    images: [String],
    type: {type: String, enum: ['product', 'category']},
    creator: {type: String, required: true},
    remainingQuantity: {type: Number, default: 0, min: 0},
    createdAt: {type: Date, default: Date.now}
});

productSchema.plugin(materializedPlugin);

productSchema.statics.addProduct = function(product, categoryName, callback) {
  var Product = mongoose.model('Product');
  product.type = 'product';
  var product = new Product(product);
  this.findOne({name: categoryName}, function(err, category) {
    if (err) return callback(err);
    category.appendChild(product, callback);
  })
};

productSchema.statics.getProductsByCategoryName = function(categoryName, callback) {
  this.findOne({name: categoryName}, function(err, category) {
    if (err) return callback(err);
    if (!category) return callback('Category nor found.');
    category.getChildren({
      condition: {type: 'product'},
      fields: {
        _id: 0,
        parentId: 0,
        path: 0,
        __v: 0,
        _w: 0,
        createdAt: 0
      }
    }, callback);
  })
};

var Product = mongoose.model('Product', productSchema);

module.exports = Product;






/**
 * Collection initialization routines.
 */

function addTestData() {
  var schemaPath = path.resolve(global.config.schema);
  var schema = require(schemaPath);

  var createProduct = function(name, displayName) {
    var product = new Product({
        name: name,
        displayName: displayName,
        description: '-',
        body: '-',
        price: '0',
        images: ['/img/dummy.png'],
        creator: 'admin',
        type: 'category'
    });

    return product;
  };

  var tasks = [];

  var generateTask = function(name, displayName, opt_parentName) {
    return function(callback) {
      var product = createProduct(name, displayName);

      if (opt_parentName) {
        Product.findOne({name: opt_parentName}, function(err, parent) {
          if (err) {
            console.log('Err: Parent ' + opt_parentName + ' could not be found.', err);
            return callback(err);
          }

          parent.appendChild(product, function(err) {
            if (err) console.log('Err: cannot add child ' + product.name, err);
            callback(err);
          });
        });

        return;
      }

      product.save(function(err) {
        if (err) console.log('Err: Cannot add node', err);
        callback(err);
      });
    };
  };

  var populateTasks = function(schema, opt_parentName) {
    tasks.push(generateTask(schema.name, schema.displayName, opt_parentName));
    console.log('Adding tasks ' + schema.name, 'parent ' + opt_parentName);

    schema.children.forEach(function(child) {
      populateTasks(child, schema.name);
    });
  };

  populateTasks(schema);

  async.series(tasks, function(err) {
    if (err) console.log('Err: Cannot create categories', err);
  });
};

if (argv.initCollection) {
  Product.remove({}, function(err) {
    if (err) return console.log(err);

    addTestData();
  });
}
