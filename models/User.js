var mongoose = require('mongoose'),
    autoinc = require('mongoose-id-autoinc'),
    hash = require('./../services/hash');

var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    displayName: {type: String},
    password: String,
    email: String,
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
userSchema.plugin(autoinc.plugin, { model: 'User', field: '_id', start: 0, step: 1 });
module.exports = User;
