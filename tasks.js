var mongoose = require('mongoose');
var DB = require('./settings').DB;
var text_parse = require('./utils').text_parse;
var Schema = mongoose.Schema;

mongoose.connect(DB);

var TaskSchema = new Schema({
    id: { "type": Number },
    author: { "type": String, "default": "John Doe" },
    assigned_to: { "type": String },
    date: { "type": Date, "default": Date.now },
    deadline: { "type": Date, "default": Date.now },
    content: { "type": String },
});
var Task = mongoose.model('Task', TaskSchema);

exports.TaskSchema = TaskSchema;
exports.Task = Task;
