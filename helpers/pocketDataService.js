'use strict';

var _ = require('lodash'),
    ARTICLE_STATUS = require('../helpers/articleStatusTypes.js');

var dataMutator = {
    updatePocketDataAfterArchiving: function(pocketData, articleId, articleTags) {
        _.forEach(articleTags, function(tag){
            _.forEach(pocketData, function(tagWithArticles) {
                if (tagWithArticles.tag === tag) {
                    var unreadArticle = _.find(tagWithArticles.unread, function(article) {
                        return article.id === articleId;
                    });

                    if (unreadArticle) {
                        tagWithArticles.unread = _.reject(tagWithArticles.unread, function(article) {
                            return article.id === articleId;
                        });

                        unreadArticle.status = ARTICLE_STATUS.ARCHIVED;
                        tagWithArticles.archived.push(unreadArticle);

                        return;
                    }

                    var archivedArticle = _.find(tagWithArticles.archived, function(article) {
                        return article.id === articleId;
                    });

                    if (archivedArticle) {
                        tagWithArticles.archived = _.reject(tagWithArticles.archived, function(article) {
                            return article.id === articleId;
                        });

                        archivedArticle.status = ARTICLE_STATUS.UNREAD;
                        tagWithArticles.unread.push(archivedArticle);
                    }
                }
            });
        });
    }
};


module.exports = dataMutator;