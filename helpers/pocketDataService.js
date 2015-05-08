'use strict';

var _ = require('lodash'),
    ARTICLE_STATUS = require('../helpers/articleStatusTypes.js');

var dataMutator = {
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

module.exports = dataMutator;