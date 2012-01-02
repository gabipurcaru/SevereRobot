var mongoose = require('mongoose');
var markdown = require('markdown');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/tracker');

var markdown_parse = function(text) {
    return markdown.markdown.toHTML(text);
}

var MessageSchema = new Schema({
    author: { "type": String, "default": "John Doe" },
    date: { "type": Date, "default": new Date() },
    content: { "type": String, "default": "o hai <br/> o hai </br> ooo haiaiiasdias </br></br> hai", "get": markdown_parse },
});
var Message = mongoose.model('Message', MessageSchema);

exports.Message = Message;
exports.MessageSchema = MessageSchema;
