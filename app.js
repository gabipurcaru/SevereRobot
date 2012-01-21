
/**
 * Module dependencies.
 */

var express = require('express');
var routes  = require('./routes');
var settings = require('./settings');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', settings.VIEWS);
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(settings.PUBLIC))
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.post('/ajax/', routes.ajax);

app.listen(settings.PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
