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
        console.log('to archive: ' + articleId);
        superagent
            .post('/archiveArticle')
            .send({ articleId: articleId })
            .end(function(error, respose) {
                if(error) { alert(error); return; }

                alert('Archived!');
                console.log(response);
            });
    },

    render: function() {
        var articlesToRender = _.map(this.state.pocketData, function(tagWithArticles) {
            var mappedArticles = _.map(tagWithArticles.articles, function(article) {
                var title = article.given_title ? article.given_title : article.given_url;
                var archive_link = '/archive/' + article.item_id;

                return (
                    <li className="collection-item" key={ article.item_id }>
                        <a href={ article.given_url }>{ title }</a>
                        <hr />
                        <button className="btn" type="button" onClick={ this._archiveArticle.bind(null, article.item_id) }>Archive</button>
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

        var content = {};

        if(articlesToRender.length > 0) {
            content = articlesToRender;
        } else {
            content = loadingIndicator;
        }

        return (
            <div className="HomePage">
                <h1>Web Mind Map</h1>
                <p>Connect with your pocket app</p>
                <button type="button" onClick={ this._connectWithPocket }>Connect</button>
                <div className="horizontal-wrapper">
                    { content }
                </div>
            </div>
        );
    }
});

React.render(<HomePage />, mainContainer);