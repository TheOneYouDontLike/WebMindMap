'use strict';

var React = require('react'),
    superagent = require('superagent'),
    _ = require('lodash');

var mainContainer = document.getElementById('main-container');

var HomePage = React.createClass({
    _connectWithPocket: function() {
        if (window.localStorage.ACCESS_TOKEN) {
            alert('Already connected!');
        }

        superagent
            .get('/getRequestToken')
            .end(function(error, response) {
                var redirectUri = 'http://localhost:1111?authorizationFinished=true';
                var obtainedRequestToken = response.text;
                window.sessionStorage.REQUEST_TOKEN = obtainedRequestToken;

                var pocketAuthorizationUrl = 'https://getpocket.com/auth/authorize?request_token=' + obtainedRequestToken + '&redirect_uri=' + redirectUri;

                window.location = pocketAuthorizationUrl;

                return;
            });
    },

    getInitialState: function() {
        return {
            pocketData: {},
            allTags: []
        };
    },

    componentDidMount: function() {
        if (!window.localStorage.ACCESS_TOKEN) {
            superagent
                .get('/getAccessToken/' + window.sessionStorage.REQUEST_TOKEN)
                .end(function(error, response) {
                    window.localStorage.ACCESS_TOKEN = response.text;
                    console.log('access token: ' + window.localStorage.ACCESS_TOKEN);
                });
        }

        if (window.localStorage.ACCESS_TOKEN) {
            console.log('Authorized !');

            superagent
                .get('/getArticles/' + window.localStorage.ACCESS_TOKEN)
                .end(function(error, response) {
                    var sortedList = _.toArray(response.body.list);
                    this.setState({ pocketData: sortedList });

                    this._getAllTags();

                }.bind(this));
        }
    },

    _getAllTags: function() {
        var allTags =
            _(this.state.pocketData)
            .compact() //removes undefined
            .map(function(article) {
                return _(article.tags).map(function(oneTag) {
                    return oneTag.tag;
                }).value();
            })
            .flattenDeep()
            .uniq()
            .sortBy(function(tag) {
                return tag;
            })
            .value();

        this.setState({ allTags: allTags });

        console.log(allTags);
    },

    render: function() {

        var articlesToRender = _.map(this.state.pocketData, function(article) {
            return (
                <div className="row" key={ article.item_id }>
                    <div className="col s2"><span className="flow-text">{ article.item_id }</span></div>
                    <div className="col s4"><span className="flow-text">{ article.given_title }</span></div>
                    <div className="col s4"><span className="flow-text">{ article.given_url }</span></div>
                </div>
            );
        });

        return (
            <div className="HomePage">
                <h1>Web Mind Map</h1>
                <p>Connect with your pocket app</p>
                <button type="button" onClick={this._connectWithPocket}>Connect</button>
                { articlesToRender }
            </div>
        );
    }
});

React.render(<HomePage />, mainContainer);
