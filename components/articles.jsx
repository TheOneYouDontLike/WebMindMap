'use strict';

var React          = require('react'),
    _              = require('lodash'),
    superagent     = require('superagent'),
    ARTICLE_STATUS = require('../helpers/articleStatusTypes.js');

var Articles = React.createClass({
    getDefaultProps: function() {
        return {
            archived: false
        };
    },

    _archiveArticle: function(articleId, currentStatus) {
        var archiveRequestBody = {
            accessToken: window.localStorage.ACCESS_TOKEN,
            articleId: articleId,
            currentStatus: currentStatus
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

            var articlesToMap = this.props.filter === 'unread' ? tagWithArticles.unread : tagWithArticles.archived;

            if (articlesToMap.length === 0) {
                return;
            }

            var mappedArticles = _(articlesToMap)
                .filter(function(article) {
                    if (this.props.showOnlyFavorited && !article.favorite) {
                        return false;
                    }
                    return true;
                }, this)
                .map(function(article) {
                    var favoriteIcon = {};

                    if(article.favorite === true) {
                        favoriteIcon = <i className="mdi-action-favorite red-text"></i>;
                    } else {
                        favoriteIcon = <i className="mdi-action-favorite-outline"></i>;
                    }

                    var aTagStyle = {
                        'whiteSpace': 'normal',
                        'textTransform': 'none'
                    };

                    var archiveButtonIcon = 'mdi-action-done';
                    if (article.status === ARTICLE_STATUS.ARCHIVED) {
                        archiveButtonIcon = 'mdi-navigation-refresh';
                    }

                    return (
                        <li className="collection-item" key={ article.id }>
                            <a href={ article.url } style={ aTagStyle } target="_blank">{ article.title }</a>
                            <hr />
                            <button className="btn-flat" type="button" onClick={ this._archiveArticle.bind(null, article.id, article.status) }>
                                <i className={ archiveButtonIcon }></i>
                            </button>
                            <button className="btn-flat" type="button" onClick={ this._deleteArticle.bind(null, article.id) }>
                                <i className="mdi-action-delete"></i>
                            </button>
                            <button className="btn-flat" type="button" onClick={ this._favoriteArticle.bind(null, article.id) }>
                                { favoriteIcon }
                            </button>
                        </li>
                    );
                }.bind(this)).value();

            if (mappedArticles.length === 0) {
                return;
            }

            return (
                <div className="card-wrapper" key={ tagWithArticles.tag }>
                    <div className="card">
                        <div className="card-content">
                            <h2 className="card-title black-text">{ tagWithArticles.tag }</h2>
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