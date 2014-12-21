var mongoose = require('mongoose'),
    autoinc = require('mongoose-id-autoinc'),
    user = require('./User'),
    uuid = require('node-uuid');


var confirmationTokenSchema = new mongoose.Schema({
    username: {type: String, required: true},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
});

confirmationTokenSchema.methods.createToken = function(done) {
    var confirmationToken = this;
    var token = uuid.v4();
    confirmationToken.set('token', token);
    confirmationToken.save( function (err) {
        if (err) return done(err);
        return done(null, token);
    });
};

var ConfirmationToken = mongoose.model('ConfirmationToken', confirmationTokenSchema);
exports.ConfirmationToken = ConfirmationToken;

exports.confirmUserEmail = function(token, done) {
    ConfirmationToken.findOne({token: token}, function (err, doc){
        if (err || !doc) return done(err);
        user.findOne({username: doc.username}, function (err, user) {
            if (err) return done(err);
            user['verified'] = true;
            user.save(function(err) {
                done(err);
            });
        });
    });
}
