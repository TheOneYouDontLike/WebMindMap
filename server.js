'use strict';

var express = require('express'),
    request = require('request');

var app = express(),
    port = 1234,
    requestToken = '';

var pocketApi = {
    headers: {
        'content-type': 'application/json',
        'X-Accept': 'application/json'
    },
    urls: {
        requestToken: 'https://getpocket.com/v3/oauth/request',
        accessToken: 'https://getpocket.com/v3/oauth/authorize',
        get: 'https://getpocket.com/v3/get'
    },
    consumerKey: '39832-01713ea2fce3d5c62db85677'
};

app.get('/', function(req, res) {
    var options = {
        headers: pocketApi.headers,
        url: pocketApi.urls.requestToken,
        body: JSON.stringify({
            'consumer_key': pocketApi.consumerKey,
            'redirect_uri': "http://localhost:1234"
        })
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
        headers: pocketApi.headers,
        url: pocketApi.urls.accessToken,
        body: JSON.stringify({
            "consumer_key": pocketApi.consumerKey,
            "code": requestToken
        })
    };

    request.post(accessTokenRequest, function(error, response, body) {
        var accessToken = JSON.parse(body).access_token;
        console.log('access token: ' + accessToken);

        // get ALL LINKS
        var getDevelopmentLinks = {
            headers: pocketApi.headers,
            url: pocketApi.urls.get,
            body: JSON.stringify({
                "consumer_key": pocketApi.consumerKey,
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
