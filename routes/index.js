
/*
 * GET home page.
 */

var Message = require('../messages').Message;
var Task = require('../tasks').Task;
var text_parse = require('../utils').text_parse;
var settings = require('../settings');
var async = require('async');
var openid = require('openid');

exports.index = function(req, res) {
    if(!req.session.user) {
        res.redirect('/login/');
        return;
    }
    async.waterfall([
        function(callback) {
            Message.find({}, [], {sort: {date: -1}}, callback)
        },
        function(messages, callback) {
            async.mapSeries(messages, function(message, callback) {
                text_parse(message.content, function(result) {
                    message.content = result;
                    callback(null, message);
                });
            }, function(err, messages) {
                callback(null, messages);
            });
        }, function(messages) {
            res.render('index', {
                title: 'Task Tracker',
                messages: messages,
            });
        }
    ]);
};

var extensions = [
    new openid.UserInterface(),
    new openid.AttributeExchange({
        "http://axschema.org/contact/email": "required",
        "http://axschema.org/namePerson/first": "required",
        "http://axschema.org/namePerson/last": "required",
    }),
];
var relyingParty = new openid.RelyingParty(settings.LOGIN_FULL_URL, null, false, false, extensions);
exports.login = function(req, res) {
    relyingParty.verifyAssertion(req, function(error, result) {
        if(error || !result.authenticated) {
            relyingParty.authenticate('https://www.google.com/accounts/o8/id', false, function(error, authUrl) {
                if(error) {
                    res.end('Error: ' + error);
                } else if(!authUrl) {
                    res.end('Authentication failed.');
                } else {
                    res.redirect(authUrl, 302);
                }
            });
        } else {
            if(settings.USER_EMAILS.indexOf(result.email) !== -1) {
                req.session.user = {
                    'email': result.email,
                    'name': result.firstname + ' ' + result.lastname,
                };
                res.redirect('/');
            } else {
                res.end('You are not authorized.')
            }
        }
    });
}

exports.ajax = function(req, res) {
    if(req.body.action == 'add_message') {
        message = new Message();
        message.content = req.body.content;
        message.date = new Date();
        message.author = req.session.user.name;
        message.save(function(err) {
            if(err) {
                res.send('Error occured.');
            } else {
                res.send('OK');
            }
        });
    } else if(req.body.action == 'add_task') {
        var content = req.body.content;
        var deadline = new Date(); //req.body.deadline;
        var assigned_to = req.body.assigned_to;
        Task.count({}, function(err, count) {
            var task = new Task();
            task.id = count+1;
            task.content = content;
            task.deadline = deadline;
            task.assigned_to = assigned_to;
            task.author = req.session.user.name;
            task.save();
            res.send(task.id);
        });
    } else if(req.body.action == "task_autosuggest_list") {
        Task.find({}, ['id'], {sort: {id: -1}}, function(err, docs) {
            var items = docs.map(function(item) {
                return {
                    value: "::" + item.id + "::",
                    desc: "#" + item.id + " - dummy text",
                };
            });
            res.end(JSON.stringify(items));
        });
    }
}
