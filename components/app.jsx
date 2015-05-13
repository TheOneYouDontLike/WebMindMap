'use strict';

var React = require('react'),
    superagent = require('superagent'),
    _ = require('lodash'),
    Articles = require('./articles.jsx'),
    _pocketDataService = require('../helpers/pocketDataService.js');

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
            pocketData: [],
            showOnlyFavorited: false
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

    _favoritesChecked: function() {
        this.setState({ showOnlyFavorited: !this.state.showOnlyFavorited });
    },

    _handleArticleDelete: function(articleId, articleTags) {
        var pocketData = this.state.pocketData;

        _pocketDataService.updatePocketDataAfterDeleting(pocketData, articleId, articleTags);

        this.setState({pocketData: pocketData});
    },

    _handleArticleArchiving: function(articleId, articleTags) {
        var pocketData = this.state.pocketData;

        _pocketDataService.updatePocketDataAfterArchiving(pocketData, articleId, articleTags);

        this.setState({pocketData: pocketData});
    },

    _handleMarkingArticleAsFavorite: function(articleId) {
        var pocketData = this.state.pocketData;

        _pocketDataService.updatePocketDataAfterMarkingAsFavorite(pocketData, articleId);

        this.setState({pocketData: pocketData});
    },

    render: function() {
        var loadingIndicator = <div className="progress"><div className="indeterminate"></div></div>;
        var connectButton = !window.localStorage.ACCESS_TOKEN ? <button type="button" className="btn connect-button" onClick={ this._connectWithPocket }>Connect with your pocket account</button> : null;

        var unreadArticles = <Articles
                                articles={ this.state.pocketData }
                                filter={ 'unread' }
                                showOnlyFavorited={ this.state.showOnlyFavorited }
                                handleArticleDelete={ this._handleArticleDelete }
                                handleArticleArchiving={ this._handleArticleArchiving }
                                handleMarkingArticleAsFavorite={ this._handleMarkingArticleAsFavorite } />;

        var archivedArticles = <Articles
                                    articles={ this.state.pocketData }
                                    filter={ 'archived' }
                                    showOnlyFavorited={ this.state.showOnlyFavorited }
                                    handleArticleDelete={ this._handleArticleDelete }
                                    handleArticleArchiving={ this._handleArticleArchiving }
                                    handleMarkingArticleAsFavorite={ this._handleMarkingArticleAsFavorite } />;

        var content = {};
        if(this.state.pocketData.length > 0) {
            content.unreadArticles = unreadArticles;
            content.archivedArticles = archivedArticles;
        } else {
            content.unreadArticles = loadingIndicator;
            content.archivedArticles = loadingIndicator;
        }

        return (
            <div className="HomePage">
                <div className="container">
                    <p className="app-name"><b>Pocket Mind Map</b></p>
                    { connectButton }
                    <div className="switch">
                        <label>
                            Favorites Off
                            <input type="checkbox" name="favorites" onChange={ this._favoritesChecked } />
                            <span className="lever"></span>
                            Favorites On
                        </label>
                    </div>
                </div>
                <div className="col">
                    <ul className="tabs">
                        <li className="tab col"><a href="#all">All</a></li>
                        <li className="tab col"><a href="#archived">Archived</a></li>
                    </ul>
                </div>
                <div className="horizontal-wrapper">
                    <div id="all">
                        { content.unreadArticles }
                    </div>
                    <div id="archived">
                        { content.archivedArticles }
                    </div>
                </div>
            </div>
        );
    }
});

React.render(<HomePage />, mainContainer);