
/**
 * Module dependencies.
 */

var express = require('express');
var routes  = require('./routes');
var settings = require('./settings');
var middleware = require('./middleware');

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
    app.set('views', settings.VIEWS);
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "#FFF#F#FSAA||}\"'" }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(settings.PUBLIC));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', middleware.set_user, routes.index);
app.get('/tasks/', middleware.set_user, routes.tasks);
app.post('/ajax/', routes.ajax);
app.get('/login/', routes.login);

app.listen(settings.PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
