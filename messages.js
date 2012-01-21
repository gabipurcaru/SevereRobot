var mongoose = require('mongoose');
var DB = require('./settings').DB;
var text_parse = require('./utils').text_parse;
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
