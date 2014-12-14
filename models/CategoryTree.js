var Product = require('./Product.js'),
    path = require('path'),
    obj = {};

function updateCategoryTree() {
  var schemaPath = path.resolve(global.config.schema);
  obj.categories = require(schemaPath);
};

setTimeout(function() {
    updateCategoryTree();
}, 1000);


module.exports = obj;
