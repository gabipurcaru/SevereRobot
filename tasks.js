var mongoose = require('mongoose');
var DB = require('./settings').DB;
var utils = require('./utils');
var Comment = require('./comments').Comment;
var Schema = mongoose.Schema;

mongoose.connect(DB);

var TaskSchema = new Schema({
    id: { "type": Number },
    author: { "type": String },
    assigned_to: { "type": String },
    date: { "type": Date, "default": Date.now },
    deadline: { "type": Date, "default": Date.now },
    title: { "type": String },
    content: { "type": String },
    comments: [{type: Schema.ObjectId, ref: 'Comment'}],
});
var Task = mongoose.model('Task', TaskSchema);

exports.TaskSchema = TaskSchema;
exports.Task = Task;
