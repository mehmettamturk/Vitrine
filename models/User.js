var mongoose = require('mongoose'),
    autoinc = require('mongoose-id-autoinc');

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
userSchema.plugin(autoinc.plugin, { model: 'User', field: '_id', start: 0, step: 1 });
module.exports = User;
