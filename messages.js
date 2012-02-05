var mongoose = require('mongoose');
var DB = require('./settings').DB;
var utils = require('./utils');
var Task = require('./tasks').Task;
var markdown = require('markdown').markdown;
var fs = require('fs');
var jade = require('jade');
var async = require('async');
var settings = require('./settings');
var Schema = mongoose.Schema;

mongoose.connect(DB);

var MessageSchema = new Schema({
    author: { "type": String, "default": "John Doe" },
    date: { "type": Date, "default": Date.now },
    content: { "type": String },
});
var Message = mongoose.model('Message', MessageSchema);

exports.Message = Message;
exports.MessageSchema = MessageSchema;

var get_task = function(id, template, callback) {
    Task.findOne({ 'id': parseInt(id) }).populate('comments', null, null, {sort: {date: 1}}).run(function(err, task) {
        if(!err && task) {
            callback(jade.compile(template)({
                'task': task,
                'date_format': utils.date_format,
            }));
        } else {
            callback("");
        }
    });
};

exports.text_parse = function(text, callback) {
    text = markdown.toHTML(text);
    text = text.replace(/^<p>/, '');
    text = text.replace(/<\/p>$/, '');
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
