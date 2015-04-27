'use strict';

var React = require('react'),
    superagent = require('superagent'),
    _ = require('lodash');

var mainContainer = document.getElementById('main-container');

var HomePage = React.createClass({
    _connectWithPocket: function() {
        if (window.localStorage.ACCESS_TOKEN) {
            alert('Already connected!');

            return;
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
            pocketData: {}
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
                    this.setState({ pocketData: response.body });
                }.bind(this));
        }
    },

    _archiveArticle: function(articleId) {
        var archiveRequestBody = {
            accessToken: window.localStorage.ACCESS_TOKEN,
            articleId: articleId
        };

        superagent
            .post('/archiveArticle')
            .send(archiveRequestBody)
            .end(function(error, response) {
                if(error) { alert(error); return; }

                alert(response.text);
                window.location.reload(); //TODO: for now
            });
    },

    _deleteArticle: function(articleId) {
        var deleteRequestBody = {
            accessToken: window.localStorage.ACCESS_TOKEN,
            articleId: articleId
        };

        superagent
            .post('/deleteArticle')
            .send(deleteRequestBody)
            .end(function(error, response) {
                if(error) { alert(error); return; }

                alert(response.text);
                window.location.reload(); //TODO: for now
            });
    },

    _favoriteArticle: function(articleId) {
        var favoriteRequestBody = {
            accessToken: window.localStorage.ACCESS_TOKEN,
            articleId: articleId
        };

        superagent
            .post('/favoriteArticle')
            .send(favoriteRequestBody)
            .end(function(error, response) {
                if(error) { alert(error); return; }

                alert(response.text);
                window.location.reload(); //TODO: for now
            });
    },

    render: function() {
        var articlesToRender = _.map(this.state.pocketData.normalArticles, function(tagWithArticles) {
            var mappedArticles = _.map(tagWithArticles.articles, function(article) {
                var title = article.given_title ? article.given_title : article.given_url;

                var favoriteIcon = {};

                if(article.favorite === '1') {
                    favoriteIcon = <i className="mdi-action-favorite red-text"></i>;
                } else {
                    favoriteIcon = <i className="mdi-action-favorite-outline"></i>;
                }

                var aTagStyle = {
                    'whiteSpace': 'normal',
                    'textTransform': 'none'
                };

                return (
                    <li className="collection-item" key={ article.item_id }>
                        <a href={ article.given_url } style={ aTagStyle }>{ title }</a>
                        <hr />
                        <button className="btn-flat" type="button" onClick={ this._archiveArticle.bind(null, article.item_id) }>
                            <i className="mdi-action-done"></i>
                        </button>
                        <button className="btn-flat" type="button" onClick={ this._deleteArticle.bind(null, article.item_id) }>
                            <i className="mdi-action-delete"></i>
                        </button>
                        <button className="btn-flat" type="button" onClick={ this._favoriteArticle.bind(null, article.item_id) }>
                            { favoriteIcon }
                        </button>
                    </li>
                );
            }.bind(this));

            return (
                <div className="card-wrapper" key={ tagWithArticles.tagName }>
                    <div className="card">
                        <div className="card-content">
                            <h2 className="card-title black-text">{ tagWithArticles.tagName }</h2>
                            <ul className="collection" >
                                { mappedArticles }
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }.bind(this));

        var loadingIndicator = <div className="progress"><div className="indeterminate"></div></div>;
        var connectButton = !window.localStorage.ACCESS_TOKEN ? <div><p>Connect with your pocket app</p><button type="button" onClick={ this._connectWithPocket }>Connect</button></div> : null;

        var content = {};
        if(articlesToRender.length > 0) {
            content = articlesToRender;
        } else {
            content = loadingIndicator;
        }

        return (
            <div className="HomePage">
                <div className="container">
                    <h1>Web Mind Map</h1>
                    { connectButton }
                </div>
                <div className="col">
                    <ul className="tabs">
                        <li className="tab col"><a href="#all">All</a></li>
                        <li className="tab col"><a href="#archived">Archived</a></li>
                    </ul>
                </div>
                <div className="horizontal-wrapper">
                    <div id="all">
                        { content }
                    </div>
                    <div id="archived">
                        PLACEHOLDER
                    </div>
                </div>
            </div>
        );
    }
});

React.render(<HomePage />, mainContainer);