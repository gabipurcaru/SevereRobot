/**
 * Site-wide utilities.
 */

var markdown = require('markdown').markdown;
var jade = require('jade');
var fs = require('fs');
var settings = require('./settings');
var Task = require('./tasks').Task;
var async = require('async');

var get_task = function(id, template, callback) {
    Task.findOne({ 'id': parseInt(id) }, function(err, task) {
        callback(jade.compile(template)({
            'task': task,
        }));
    })
}

exports.text_parse = function(text, callback) {
    text = markdown.toHTML(text);
    var template;
    async.series([
        function(callback) {
            fs.readFile(settings.VIEWS + '/task.jade', function(err, data) {
                template = data;
                callback(err);
            });
        }, function() {
            var functions = [];
            var regex = /::([0-9]+)::/;
            async.whilst(function() {
                    return regex.test(text);
                }, function(callback) {
                    var match = regex.exec(text);
                    var tag = match[0];
                    var id = match[1];
                    get_task(id, template, function(task) {
                        text = text.replace(tag, task);
                        callback();
                    });
                }, function(err) {
                    callback(text);
                }
            );
        }
    ]);
}
