var mongoose = require('mongoose'),
    materializedPlugin = require('mongoose-materialized'),
    path = require('path'),
    async = require('async'),
    argv = require('optimist').argv;

function titleValidator (v) {
  return v.length < 50;
};

function descriptionValidator (v) {
  return v.length < 100;
};

function bodyValidator (v) {
  return v.length < 5000;
};

var featureSchema = mongoose.Schema({
    type: {type: String, enum: ['enum', 'number', 'bool']},
    value: mongoose.Schema.Types.Mixed
}, {_id: false});

var productSchema = mongoose.Schema({
    title: {type: String, validate: [titleValidator, 'Title is too long.'], required: true},
    description: {type: String, validate: [descriptionValidator, 'Description is too long.'], required: true},
    body: {type: String, validate: [bodyValidator, 'Body is too long.'], required: true},
    price: {type: Number, min: 0, required: true},
    features: [featureSchema],
    images: [String],
    creator: {type: String, required: true},
    remainingQuantity: {type: Number, default: 0, min: 0},
    createdAt: {type: Date, default: Date.now}
});

productSchema.plugin(materializedPlugin);

var Product = mongoose.model('Product', productSchema);

module.exports = Product;






/**
 * Collection initialization routines.
 */

function addTestData() {
  var schemaPath = path.resolve(global.config.schema);
  var schema = require(schemaPath);

  var createProduct = function(name) {
    var product = new Product({
        title: name,
        description: '-',
        body: '-',
        price: '0',
        images: ['/img/dummy.png'],
        creator: 'admin'
    });

    return product;
  };

  var tasks = [];

  var generateTask = function(name, opt_parentName) {
    return function(callback) {
      var product = createProduct(name);

      if (opt_parentName) {
        Product.findOne({title: opt_parentName}, function(err, parent) {
          if (err) {
            console.log('Err: Parent ' + opt_parentName + ' could not be found.', err);
            return callback(err);
          }

          parent.appendChild(product, function(err) {
            if (err) console.log('Err: cannot add child ' + product.title, err);
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
    tasks.push(generateTask(schema.name, opt_parentName));
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
