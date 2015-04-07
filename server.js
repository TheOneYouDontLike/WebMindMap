'use strict';

var express = require('express'),
    request = require('request');

var app = express(),
    port = 1234;

app.get('/', function(req, res) {

    var consumerKey = "39832-01713ea2fce3d5c62db85677";

    var options = {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-Accept": "application/json"
        },
        url: "https://getpocket.com/v3/oauth/request",
        body: 'consumer_key=' + consumerKey + '&redirect_uri=http://localhost/'
    };

    request.post(options, function(error, response, body) {
        console.log(response);
    });

    res.send('working');
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
