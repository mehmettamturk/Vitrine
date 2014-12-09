var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    displayName: {type: String},
    password: String,
    permissions: [String]
});

userSchema.methods.verifyPassword = function(password) {
    return this.password == password;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
