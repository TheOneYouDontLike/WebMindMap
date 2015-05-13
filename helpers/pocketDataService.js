'use strict';

var _ = require('lodash'),
    ARTICLE_STATUS = require('../helpers/articleStatusTypes.js');

var pocketDataService = {
    updatePocketDataAfterArchiving: function(pocketData, articleId, articleTags) {
        _.forEach(articleTags, function(tag){
            _.forEach(pocketData, function(tagWithArticles) {
                if (tagWithArticles.tag === tag) {
                    var unreadArticle = _findArticleIn(tagWithArticles.unread, articleId);

                    if (unreadArticle) {
                        _removeArticleFrom(tagWithArticles.unread, articleId);

                        unreadArticle.status = ARTICLE_STATUS.ARCHIVED;
                        tagWithArticles.archived.push(unreadArticle);

                        return;
                    }

                    var archivedArticle = _findArticleIn(tagWithArticles.archived, articleId);

                    if (archivedArticle) {
                        _removeArticleFrom(tagWithArticles.archived, articleId);

                        archivedArticle.status = ARTICLE_STATUS.UNREAD;
                        tagWithArticles.unread.push(archivedArticle);
                    }
                }
            });
        });
    },

    updatePocketDataAfterDeleting: function(pocketData, articleId, articleTags) {
        _.forEach(articleTags, function(tag){
            _.forEach(pocketData, function(tagWithArticles) {
                if (tagWithArticles.tag === tag) {
                    _.remove(tagWithArticles.unread, function(article) {
                        return article.id === articleId;
                    });

                    _.remove(tagWithArticles.archived, function(article) {
                        return article.id === articleId;
                    });
                }
            });
        });
    },

    updatePocketDataAfterMarkingAsFavorite: function(pocketData, articleId) {
        _.forEach(pocketData, function(tagWithArticles) {
            var articlesToUpdate = [];

            var unreadArticlesToUpdate = _.filter(tagWithArticles.unread, function(article) {
                return article.id === articleId;
            });

            var archivedArticlesToUpdate = _.filter(tagWithArticles.archived, function(article) {
                return article.id === articleId;
            });

            articlesToUpdate = articlesToUpdate.concat(unreadArticlesToUpdate, archivedArticlesToUpdate);

            _.forEach(articlesToUpdate, function(article) {
                article.favorite = !article.favorite;
            });
        });
    }
};

function _findArticleIn(articlesCollection, articleId) {
    return _.find(articlesCollection, function(article) {
        return article.id === articleId;
    });
}

function _removeArticleFrom(articlesCollection, articleId) {
    _.remove(articlesCollection, function(article) {
        return article.id === articleId;
    });
}

module.exports = pocketDataService;