var mongoose = require('mongoose');
var DB = require('./settings').DB;
var markdown = require('markdown').markdown;
var utils = require('./utils');
var Schema = mongoose.Schema;
mongoose.connect(DB);

var CommentSchema = new Schema({
    author: { "type": String },
    date: { "type": Date, "default": Date.now },
    content: { "type": String },
});
var Comment = mongoose.model('Comment', CommentSchema);

exports.CommentSchema = CommentSchema;
exports.Comment = Comment;
