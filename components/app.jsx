'use strict';

var React = require('react'),
    superagent = require('superagent'),
    queryString = require('query-string');

var mainContainer = document.getElementById('main-container');

var HomePage = React.createClass({
    connectWithPocket: function() {
        superagent
            .get('/getRequestToken')
            .end(function(error, response) {
                var redirectUri = 'http://localhost:1111?authorizationFinished=true';
                var obtainedRequestToken = response.text;
                window.sessionStorage.REQUEST_TOKEN = obtainedRequestToken;

                var pocketAuthorizationUrl = 'https://getpocket.com/auth/authorize?request_token=' + obtainedRequestToken + '&redirect_uri=' + redirectUri;

                window.location = pocketAuthorizationUrl;
            });
    },

    componentDidMount: function() {
        var parsedQueryString= queryString.parse(location.search);

        if (parsedQueryString.authorizationFinished) {

            if (!window.localStorage.ACCESS_TOKEN) {
                superagent
                    .get('/getAccessToken/' + window.sessionStorage.REQUEST_TOKEN)
                    .end(function(error, response) {
                        window.localStorage.ACCESS_TOKEN = response.text;
                        console.log('access token: ' + window.localStorage.ACCESS_TOKEN);
                    });
            }
        }

        if (window.localStorage.ACCESS_TOKEN) {
            superagent
                .get('/getArticles/' + window.localStorage.ACCESS_TOKEN)
                .end(function(error, response) {
                    console.log(response.body);
                });
        }
    },

    render: function() {
        return (
            <div className="HomePage">
                <h1>Web Mind Map</h1>
                <p>Connect with your pocket app</p>
                <button type="button" onClick={this.connectWithPocket}>Connect</button>
            </div>
        );
    }
});

React.render(<HomePage />, mainContainer);
