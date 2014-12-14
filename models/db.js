var mongoose = require('mongoose');
var autoinc = require('mongoose-id-autoinc');
autoinc.init(mongoose);

mongoose.connect('mongodb://localhost/vitrine');
mongoose.set('debug', true);

// On error
mongoose.connection.on('error', function(err) {
    console.log('Mongo Connection - Error:', err);
});

// On success
mongoose.connection.once('open', function() {
    console.log('Mongo Connection OK');
});
