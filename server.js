'use strict';

var express = require('express'),
    pocketApi = require('./pocketApi.js');

var app = express(),
    port = 1234,
    requestToken = '';

app.get('/', function(req, res) {
    pocketApi.getRequestToken(function(error, obtainedRequestToken) {
        requestToken = obtainedRequestToken;
        var redirectUrl = 'https://getpocket.com/auth/authorize?request_token=' + obtainedRequestToken + '&redirect_uri=http://localhost:1234/working';
        res.redirect(redirectUrl);
    });
});

app.get('/working', function(req, res) {
    pocketApi.getAccessToken(requestToken, function(error, accessToken) {
        pocketApi.getAll(accessToken, function(error, data) {
            res.send(data);
        });
    });

});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
