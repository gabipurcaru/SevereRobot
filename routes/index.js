
/*
 * GET home page.
 */

var Message = require('../messages').Message;

exports.index = function(req, res) {
    var messages = [];
    Message.find({}, [], {sort: {date: -1}}, function(err, docs) {
        messages = docs;
        res.render('index', {
            title: 'Task Tracker',
            messages: messages,
        });
    });
};

exports.ajax = function(req, res) {
    if(req.body.action == 'add_message') {
        message = new Message();
        message.content = req.body.content;
        message.date = new Date();
        message.save(function(err) {
            if(err) {
                res.send('Error occured.');
            } else {
                res.send('OK');
            }
        });
    } else if(req.body.action == 'add_task') {
        res.send('Not Implemented');
    }
}
