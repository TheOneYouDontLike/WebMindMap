'use strict';

var _ = require('lodash');

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
                        case 'unread':
                            tagWithArticles.unread.push(article);
                            break;
                        case 'archived':
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
                title: article.given_title,
                favorite: article.favorite === '1' ? true : false,
                status: _extractStatus(article.status),
                excerpt: article.excerpt,
                tags: _extractTags(article.tags)
            };

            return mapped;
        });
    }

    function _extractStatus(status) {
        switch (status) {
            case '0':
                return 'unread';
            case '1':
                return 'archived';
            case '2':
                return 'deleted';
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
