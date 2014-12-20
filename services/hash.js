
var crypto = require('crypto');

/**
 * Bytesize.
 */
var len = 128;

/**
 * Iterations. ~300ms
 */
var iterations = 12000;

var salt = '4fWeaD95XC';

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password
 * @param {Function} callback
 */
module.exports = function(password, callback) {
    crypto.pbkdf2(password, salt, iterations, len, function(err, hash) {
      callback(err, hash.toString('base64'));
    });
};
