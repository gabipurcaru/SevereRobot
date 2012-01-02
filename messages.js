var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/tracker');

var MessageSchema = new Schema({
    author: { "type": String, "default": "John Doe" },
    date: { "type": Date, "default": new Date() },
    content: { "type": String, "default": "o hai <br/> o hai </br> ooo haiaiiasdias </br></br> hai" },
});
var Message = mongoose.model('Message', MessageSchema);

exports.Message = Message;
exports.MessageSchema = MessageSchema;
