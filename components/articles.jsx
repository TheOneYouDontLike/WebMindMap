'use strict';

var React = require('react'),
    _ = require('lodash');

var Articles = React.createClass({
    getDefaultProps: function() {
        return {
            archived: false
        };
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
        var articlesToRender = _.map(this.props.articles, function(tagWithArticles) {
            var mappedArticles = _.map(tagWithArticles.articles, function(article) {
                var title = article.given_title ? article.given_title : article.given_url;

                var favoriteIcon = {};

                if(article.favorite === '1') {
                    favoriteIcon = <i className="mdi-action-favorite red-text"k></i>;
                } else {
                    favoriteIcon = <i className="mdi-action-favorite-outline"></i>;
                }

                var aTagStyle = {
                    'whiteSpace': 'normal',
                    'textTransform': 'none'
                };

                var archiveButton = {};
                if(!this.props.archived) {
                    archiveButton = <button className="btn-flat" type="button" onClick={ this._archiveArticle.bind(null, article.item_id) }>
                                        <i className="mdi-action-done"></i>
                                    </button>;
                }

                return (
                    <li className="collection-item" key={ article.item_id }>
                        <a href={ article.given_url } style={ aTagStyle }>{ title }</a>
                        <hr />
                        { archiveButton }
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

        return (
            <div>
                { articlesToRender }
            </div>
        );
    }
});

module.exports = Articles;