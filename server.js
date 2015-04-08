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

    var requestToken = '';
    request.post(options, function(error, response, body) {
        requestToken = JSON.parse(body).code;
        console.log(requestToken);

        var redirectUrl = 'https://getpocket.com/auth/authorize?request_token=' + requestToken + '&redirect_uri=http://localhost:1234/working';
        res.redirect(redirectUrl);
    });

    //res.send('working');

});

app.get('/working', function(req, res) {
    res.send('authorized');
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
