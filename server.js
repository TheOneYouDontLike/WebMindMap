'use strict';

var express = require('express'),
    request = require('request');

var app = express(),
    port = 1234,
    requestToken = '',
    consumerKey = "39832-01713ea2fce3d5c62db85677";

app.get('/', function(req, res) {

    var options = {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-Accept": "application/json"
        },
        url: "https://getpocket.com/v3/oauth/request",
        body: 'consumer_key=' + consumerKey + '&redirect_uri=http://localhost/'
    };

    // get REQUEST TOKEN
    request.post(options, function(error, response, body) {
        requestToken = JSON.parse(body).code;
        console.log('request token: ' + requestToken);

        var redirectUrl = 'https://getpocket.com/auth/authorize?request_token=' + requestToken + '&redirect_uri=http://localhost:1234/working';
        res.redirect(redirectUrl);
    });
});

app.get('/working', function(req, res) {
    // get ACCESS TOKEN
    var accessTokenRequest = {
        headers: {
            "content-type": "application/json",
            "X-Accept": "application/json"
        },
        url: 'https://getpocket.com/v3/oauth/authorize',
        body: JSON.stringify(
            {
                "consumer_key": consumerKey,
                "code": requestToken
            })
    };

    request.post(accessTokenRequest, function(error, response, body) {
        var accessToken = JSON.parse(body).access_token;
        console.log(accessToken);

        // get ALL LINKS
        var getDevelopmentLinks = {
            headers: {
                "content-type": "application/json",
                "X-Accept": "application/json"
            },
            url: 'https://getpocket.com/v3/get',
            body: JSON.stringify(
                {
                    "consumer_key": consumerKey,
                    "access_token": accessToken,
                    "tag": "development"
                })
        };

        request.post(getDevelopmentLinks, function(error, response, body) {
            res.send(body);
        });
    });
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
