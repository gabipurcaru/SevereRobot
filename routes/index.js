
/*
 * GET home page.
 */

var Message = require('../messages').Message;
var Comment = require('../comments').Comment;
var Task = require('../tasks').Task;
var TaskStatus = require('../tasks').TaskStatus;
var get_task_status_name = require('../tasks').get_task_status_name;
var text_parse = require('../messages').text_parse;
var settings = require('../settings');
var async = require('async');
var openid = require('openid');
var utils = require('../utils');

exports.index = function(req, res) {
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
    async.waterfall([
        function(callback) {
            Message.find({}, [], {sort: {date: -1}}, callback);
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
                date_format: utils.date_format,
                TaskStatus: TaskStatus,
                get_task_status_name: get_task_status_name,
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
        var message = new Message();
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
        var title = req.body.title;
        Task.count({}, function(err, count) {
            var task = new Task();
            task.id = count+1;
            task.content = content;
            task.deadline = deadline;
            task.assigned_to = assigned_to;
            task.author = req.session.user.name;
            task.title = title;
            task.save();
            res.send(task.id);
        });
    } else if(req.body.action == "task_autosuggest_list") {
        Task.find({}, ['id', 'title'], {sort: {id: -1}}, function(err, docs) {
            var items = docs.map(function(item) {
                return {
                    value: "::" + item.id + "::",
                    desc: "#" + item.id + " - " + item.title,
                };
            });
            res.end(JSON.stringify(items));
        });
    } else if(req.body.action == "add_comment") {
        var comment = new Comment();
        comment.author = req.session.user.name;
        comment.content = req.body.comment;
        comment.save(function(err, doc) {
            if(!err && doc) {
                Task.update({id: parseInt(req.body['task-id'])}, {$push: {comments: doc}}, function() {
                    res.end("OK");
                });
            }
        });
    } else if(req.body.action == "change_status") {
        Task.update({id: parseInt(req.body['task-id'])}, {status: req.body.status}, function() {
            res.end('OK');
        });
    }
}
