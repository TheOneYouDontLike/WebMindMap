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
            .map(function(article) {
                return _(article.tags)
                    .map(function(singleTag) {
                        return singleTag.tag;
                    }).value();
            })
            .compact() //removes undefined
            .flattenDeep()
            .uniq()
            .sortBy(function(tag) {
                return tag;
            })
            .value();

        this.setState({ allTags: allTags });

        var groupedMovies = [];

        _.forEach(allTags, function(tag) {

            var allArticlesGroupedByTag =
            _(this.state.pocketData)
            .filter(function(article) {
                var tagsArray = _(article.tags)
                    .map(function(singleTag) {
                        return singleTag.tag;
                    }).value();

                return _.contains(tagsArray, tag);
            })
            .value();

            var tagWithArticles = {
                tagName: tag,
                articles: allArticlesGroupedByTag
            };

            groupedMovies.push(tagWithArticles);
        }.bind(this));



        console.log('grouped by tag');
        console.log(groupedMovies);

        console.log(this.state.pocketData);
        console.log(allTags);
    },

    render: function() {

        var articlesToRender = _.map(this.state.pocketData, function(article) {
            return (
                <div className="row" key={ article.item_id }>
                    <div className="col s2"><span>{ article.item_id }</span></div>
                    <div className="col s4"><span>{ article.given_title }</span></div>
                    <div className="col s4"><span>{ article.given_url }</span></div>
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
