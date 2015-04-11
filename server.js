'use strict';

var express = require('express'),
    PocketApi = require('./pocketApi.js'),
    pocketApiConsumerKey = require('./consumerKey.js');

var pocketApi = new PocketApi(pocketApiConsumerKey);

var app = express(),
    port = 1111,
    requestToken = '',
    redirectUri = 'http://localhost:1111/authenticated';

app.get('/authenticate', function(req, res) {
    pocketApi.getRequestToken(function(error, obtainedRequestToken) {
        requestToken = obtainedRequestToken;
        var redirectUrl = 'https://getpocket.com/auth/authorize?request_token=' + obtainedRequestToken + '&redirect_uri=' + redirectUri;
        res.redirect(redirectUrl);
    });
});

app.get('/authenticated', function(req, res) {
    pocketApi.getAccessToken(requestToken, function(error, accessToken) {
        pocketApi.getAll(accessToken, function(error, data) {
            res.send(data);
        });
    });
});

// VIEWS
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
