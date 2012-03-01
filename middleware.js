var settings = require('./settings');

exports.set_user = function(req, res, next) {
    if(!settings.SKIP_LOGIN) {
        if(!req.session.user) {
            res.redirect('/login/');
            return;
        }
    } else {
        req.session.user = {
            email: "some@body.com",
            name: "John Doe",
        }
    }
    next();
}
