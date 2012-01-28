/**
 * General settings
 */

exports.PORT = process.env.PORT || 3000;
exports.DB = process.env.MONGOLAB_URI || 'mongodb://localhost/tracker2';
exports.VIEWS = __dirname + '/views';
exports.PUBLIC = __dirname + '/public';
exports.LOGIN_FULL_URL = 'http://gabipurcaru.dyndns.org:5000/login/';

console.error(process.env);
