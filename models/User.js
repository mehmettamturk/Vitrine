var mongoose = require('mongoose'),
    autoinc = require('mongoose-id-autoinc'),
    hash = require('./../services/hash');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

function displayNameValidator(v) {
  return v && v.length < 60;
};

function usernameValidator(v) {
  return v && v.length < 40;
};

var userSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true, validate: [usernameValidator, 'Username is too long.']},
    displayName: {type: String, validate: [displayNameValidator, 'Display name is too long.']},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true, validate: [validateEmail, 'Email is not in a proper form.']},
    verified: {type: Boolean, default: false},
    permissions: [String]
});

userSchema.methods.verifyPassword = function(password, callback) {
    var that = this;
    hash(password, function(err, hash) {
        if (err) callback(err);
        callback(null, that.password == hash);
    });
};

var User = mongoose.model('User', userSchema);
module.exports = User;
