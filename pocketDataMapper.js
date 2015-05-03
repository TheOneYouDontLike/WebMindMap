'use strict';

var _              = require('lodash'),
    ARTICLE_STATUS = require('./helpers/articleStatusConstants.js');

var NO_TAGS_ARRAY = ['_no_tags_'];

var PocketDataMapper = function() {
    var module = {};

    module.mapFromApi = mapFromApi;

    return module;

    function mapFromApi(pocketData) {
        var articles = pocketData.list;

        var mappedArticles = _mapArticles(articles);
        var mappedTags = _mapTags(pocketData.list);

        var groupedByTags = [];
        _.forEach(mappedTags, function(tag) {
            var tagWithArticles = {
                tag: tag,
                unread: [],
                archived: []
            };

            _.forEach(mappedArticles, function(article) {
                if(_.contains(article.tags, tag)) {
                    switch(article.status) {
                        case ARTICLE_STATUS.UNREAD:
                            tagWithArticles.unread.push(article);
                            break;
                        case ARTICLE_STATUS.ARCHIVED:
                            tagWithArticles.archived.push(article);
                            break;
                        default: break;
                    }
                }
            });

            if (tagWithArticles.unread.length === 0 && tagWithArticles.archived.length === 0) {
                return;
            }

            groupedByTags.push(tagWithArticles);
        });

        return groupedByTags;
    }

    function _mapArticles(articles) {
        return _.map(articles, function(article) {
            var mapped = {
                id: parseInt(article.item_id),
                url: article.resolved_url,
                title: _extractTitle(article),
                favorite: article.favorite === '1' ? true : false,
                status: _extractStatus(article.status),
                excerpt: article.excerpt,
                tags: _extractTags(article.tags)
            };

            return mapped;
        });
    }

    function _extractTitle (article) {
        if (article.given_title) {
            return article.given_title;
        } else if (article.resolved_title) {
            return article.resolved_title;
        } else if (article.given_url) {
            return article.given_url;
        }

        return article.resolved.url;
    }

    function _extractStatus(status) {
        switch (status) {
            case '0':
                return ARTICLE_STATUS.UNREAD;
            case '1':
                return ARTICLE_STATUS.ARCHIVED;
            case '2':
                return ARTICLE_STATUS.DELETED;
        }
    }

    function _extractTags(tags) {
        if (!tags) {
            return NO_TAGS_ARRAY;
        }

        return _.map(tags, function(tagObject) {
            return tagObject.tag;
        });
    }

    function _mapTags(listOfArticles) {
        var allTags =
            _(listOfArticles)
            .map(function(article) {
                return _extractTags(article.tags);
            })
            .compact() //removes undefined
            .flattenDeep()
            .uniq()
            .sortBy(function(tag) {
                return tag;
            })
            .value();

        return allTags;
    }

};

module.exports = PocketDataMapper;
