var hash = require('./services/hash');

var argv = require('optimist').argv;
hash(argv.password, function(err, hash) {
    if (err) return console.log('Error', err);
    console.log(hash);
});
