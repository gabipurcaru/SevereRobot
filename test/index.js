var vows =  require('vows');
var assert = require('assert');
var request = require('request');
var base_url = 'http://localhost:5000'

function get_url(url, callback) {
    request({
        method: 'GET',
        url: base_url + url,
        json: {}
    }, function(req, res, body, err) {
        if(!err) {
            callback(null, res);
        }
    });
}

vows.describe('index').addBatch({
    'when the / page is loaded': {
        topic: function() {
            get_url('/', this.callback);
        },
        'the response should': {
            'have status 200 OK': function(res) {
                assert.equal(res.statusCode, 200);
            },
            'not be empty': function(res) {
                assert.ok(res.body);
            },
        }
    }
}).export(module);
