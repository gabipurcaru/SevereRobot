/**
 * Site-wide utilities.
 */

var markdown = require('markdown').markdown;
var jade = require('jade');
var fs = require('fs');
var settings = require('./settings');
var Task = require('./tasks').Task;
var async = require('async');

var get_task = function(id, callback) {
    console.log('get task');
    setTimeout(function() {
        callback(">-"+id+"-<");
    }, 250);
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
                    console.log(text);
                    return regex.test(text);
                }, function(callback) {
                    var match = regex.exec(text);
                    var tag = match[0];
                    var id = match[1];
                    get_task(id, function(task) {
                        text = text.replace(tag, task);
                        callback();
                    });
                }, function(err) {
                    console.log('ok');
                    callback(text);
                }
            );
        }
    ]);
}
