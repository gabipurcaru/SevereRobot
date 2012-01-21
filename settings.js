/**
 * General settings
 */

exports.PORT = process.env.PORT || 3000;
exports.DB = process.env.MONGOLAB_URI || 'mongodb://localhost/tracker2';
exports.VIEWS = __dirname + '/views';
exports.PUBLIC = __dirname + '/public';
