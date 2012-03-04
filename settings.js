/**
 * General settings
 */

exports.PORT = process.env.PORT || 3000;
exports.DB = process.env.MONGOLAB_URI || 'mongodb://localhost/Tracker11';
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
if('SKIP_LOGIN' in process.env || !('MONGOLAB_URI' in process.env)) {
    // skip login if on local server or explicitly set
    exports.SKIP_LOGIN = true; 
} else {
    exports.SKIP_LOGIN = false;
}
