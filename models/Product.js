var mongoose = require('mongoose');

function titleValidator (v) {
  return v.length > 50;
};

function descriptionValidator (v) {
  return v.length > 100;
};

function bodyValidator (v) {
  return v.length > 5000;
};

var productSchema = mongoose.Schema({
    title: {type: String, validate: [titleValidator, 'Title is too long.'], required: true},
    description: {type: String, validate: [descriptionValidator, 'Description is too long.'], required: true},
    body: {type: String, validate: [bodyValidator, 'Body is too long.'], required: true},
    price: {type: Number, min: 0, required: true},
    images: [String],
    creator: {type: String, required: true},
    remainingQuantity: {type: Number, default: 0, min: 0},
    createdAt: {type: Date, default: Date.now}
});


var Product = mongoose.model('Product', productSchema);

module.exports = Product;
