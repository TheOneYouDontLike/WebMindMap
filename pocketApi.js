'use strict';

var request = require('request');

var pocketApi = function(pocketApiConsumerKey) {
    var module = {},
        pocketApiConstants = {
            headers: {
                'content-type': 'application/json',
                'X-Accept': 'application/json'
            },
            urls: {
                requestToken: 'https://getpocket.com/v3/oauth/request',
                accessToken: 'https://getpocket.com/v3/oauth/authorize',
                get: 'https://getpocket.com/v3/get'
            },
            consumerKey: pocketApiConsumerKey
        };

    module.getRequestToken = getRequestToken;
    module.getAccessToken = getAccessToken;
    module.getAll = getAll;

    function getRequestToken(callback) {
        var options = {
            headers: pocketApiConstants.headers,
            url: pocketApiConstants.urls.requestToken,
            body: JSON.stringify({
                'consumer_key': pocketApiConstants.consumerKey,
                'redirect_uri': "http://localhost:1234"
            })
        };

        request.post(options, function(error, response, body) {
            if (error) { callback(error, null); }

            var requestToken = JSON.parse(body).code;
            console.log('request token: ' + requestToken);

            callback(null, requestToken);
        });
    }

    function getAccessToken(requestToken, callback) {
        var accessTokenRequest = {
            headers: pocketApiConstants.headers,
            url: pocketApiConstants.urls.accessToken,
            body: JSON.stringify({
                "consumer_key": pocketApiConstants.consumerKey,
                "code": requestToken
            })
        };

        request.post(accessTokenRequest, function(error, response, body) {
            if (error) { callback(error, null); }

            var accessToken = JSON.parse(body).access_token;
            console.log('access token: ' + accessToken);

            callback(null, accessToken);
        });
    }

    function getAll(accessToken, callback) {
        var getDevelopmentLinks = {
            headers: pocketApiConstants.headers,
            url: pocketApiConstants.urls.get,
            body: JSON.stringify({
                "consumer_key": pocketApiConstants.consumerKey,
                "access_token": accessToken,
                "tag": "development"
            })
        };

        request.post(getDevelopmentLinks, function(error, response, body) {
            if (error) { callback(error, null); }

            callback(null, body);
        });
    }

    return module;
};

module.exports = pocketApi;