/**
 * General settings
 */

exports.PORT = process.env.PORT || 3000;
exports.DB = process.env.MONGOLAB_URI || 'mongodb://localhost/Tracker10';
exports.VIEWS = __dirname + '/views';
exports.PUBLIC = __dirname + '/public';

if(process.env.ROOT_URL) {
    exports.LOGIN_FULL_URL = process.env.ROOT_URL + '/login/';
} else {
    exports.LOGIN_FULL_URL = 'http://gabipurcaru.dyndns.org:5000/login/';
}
exports.USER_EMAILS = [
    'gabi@purcaru.com',
    'deemarklit@gmail.com',
];
exports.SKIP_LOGIN = false; //process.env.SKIP_LOGIN || true;
