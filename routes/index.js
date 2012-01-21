
/*
 * GET home page.
 */

var Message = require('../messages').Message;
var Task = require('../tasks').Task;
var text_parse = require('../utils').text_parse;
var async = require('async');

exports.index = function(req, res) {
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

exports.ajax = function(req, res) {
    if(req.body.action == 'add_message') {
        message = new Message();
        message.content = req.body.content;
        message.date = new Date();
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
            task.author = "John Doe";
            task.save();
            res.send(task.id);
        });
    }
}
