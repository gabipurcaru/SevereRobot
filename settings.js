/**
 * General settings
 */

exports.PORT = process.env.PORT || 3000;
exports.DB = process.env.MONGOLAB_URI || 'mongodb://localhost/tracker7';
exports.VIEWS = __dirname + '/views';
exports.PUBLIC = __dirname + '/public';
exports.LOGIN_FULL_URL = /*process.env.ROOT_URL + '/login/'  ||*/ 'http://gabipurcaru.dyndns.org:5000/login/';
exports.USER_EMAILS = [
    'gabi@purcaru.com',
    'deemarklit@gmail.com',
];
exports.SKIP_LOGIN = process.env.SKIP_LOGIN || true;
