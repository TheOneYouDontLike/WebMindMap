'use strict';

var superagent = require('superagent');

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
        var requestBody = JSON.stringify({
            'consumer_key': pocketApiConstants.consumerKey,
            'redirect_uri': "http://localhost:1234"
        });

        superagent
            .post(pocketApiConstants.urls.requestToken)
            .set(pocketApiConstants.headers)
            .send(requestBody)
            .end(function(error, response) {
                if (error) { callback(error, null); }

                var requestToken = response.body.code;
                console.log('requestToken:' + requestToken);

                callback(null, requestToken);
            });
    }

    function getAccessToken(requestToken, callback) {
        var requestBody = JSON.stringify({
            "consumer_key": pocketApiConstants.consumerKey,
            "code": requestToken
        });

        superagent
            .post(pocketApiConstants.urls.accessToken)
            .set(pocketApiConstants.headers)
            .send(requestBody)
            .end(function(error, response) {
                if (error) { callback(error, null); }

                var accessToken = response.body.access_token;
                console.log('access token: ' + accessToken);

                callback(null, accessToken);
            });
    }

    function getAll(accessToken, callback) {
        var requestBody = JSON.stringify({
            "consumer_key": pocketApiConstants.consumerKey,
            "access_token": accessToken,
            "detailType": "complete"
        });

        superagent
            .post(pocketApiConstants.urls.get)
            .set(pocketApiConstants.headers)
            .send(requestBody)
            .end(function(error, response) {
                if (error) { callback(error, null); }

                callback(null, response.body);
            });
    }

    return module;
};

module.exports = pocketApi;