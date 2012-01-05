var mongoose = require('mongoose');
var markdown_parse = require('./utils').markdown_parse;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    author: { "type": String, "default": "John Doe" },
    assigned_to: { "type": String },
    date: { "type": Date.now },
    deadline: { "type": Date.now },
    content: { "type": String, "get": markdown_parse },
});
var Task = mongoose.model('Task', TaskSchema);

exports.TaskSchema = TaskSchema;
exports.Task = Task;
