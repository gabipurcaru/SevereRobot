var mongoose = require('mongoose');
var DB = require('./settings').DB;
var utils = require('./utils');
var Comment = require('./comments').Comment;
var Schema = mongoose.Schema;

mongoose.connect(DB);

TaskStatus = {
    Active: 1,
    Finished: 2,
    Closed: 3,
    Wontfix: 4,
    Duplicate: 5,
}

var TaskSchema = new Schema({
    id: { "type": Number },
    author: { "type": String },
    assigned_to: { "type": String },
    date: { "type": Date, "default": Date.now },
    deadline: { "type": Date, "default": Date.now },
    title: { "type": String },
    "status": { "type": Number, "default": TaskStatus.Active },
    content: { "type": String },
    comments: [{type: Schema.ObjectId, ref: 'Comment'}],
});
var Task = mongoose.model('Task', TaskSchema);

exports.TaskSchema = TaskSchema;
exports.Task = Task;
exports.get_task_status_name = function(id) {
    for(item in TaskStatus) {
        if(TaskStatus[item] == id) {
            return item;
        }
    }
    throw Error("Invalid status ID");
}
