'use strict';

var _ = require('lodash');

var NO_TAGS_ARRAY = ['_no_tags'];

var PocketDataMapper = function() {
    var module = {};

    module.groupByTags = groupByTags;

    return module;

    function groupByTags(pocketData) {
        var listOfArticles = _.toArray(pocketData.list);

        var DEFAULT_STATUS = 0;
        var ARCHIVED_STATUS = 1;

        var normalArticles = _.filter(listOfArticles, function(article) {
            return article.status === DEFAULT_STATUS;
        });

        var archivedArticles = _.filter(listOfArticles, function(article) {
            return article.status === ARCHIVED_STATUS;
        });

        console.log('after filtering');

        var normalTags = _getTags(normalArticles);
        var archivedTags = _getTags(archivedArticles);

        var normalArticlesGroupedByTags = _groupByTags(normalTags, normalArticles);
        var archivedArticlesGroupedByTags = _groupByTags(archivedTags, archivedArticles);

        console.log('after grouping');

        var articlesDividedByState = {
            normalArticles: normalArticlesGroupedByTags,
            archivedArticles: archivedArticlesGroupedByTags
        };

        return articlesDividedByState;
    }

    function _getTags(listOfArticles) {
        var allTags =
            _(listOfArticles)
            .map(function(article) {
                if(!article.tags) {
                    return NO_TAGS_ARRAY;
                }

                var tagsArray = _extractTagsFromArticle(article);

                return tagsArray;
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

    function _groupByTags(tags, articles) {
        var groupedArticles = [];
        _.forEach(tags, function(tag) {

            var articlesGroupedByTag =
                _(articles)
                .filter(function(article) {
                    var tagsArray = _extractTagsFromArticle(article);

                    return _.contains(tagsArray, tag);
                })
                .value();

            var tagWithArticles = {
                tagName: tag,
                articles: articlesGroupedByTag
            };

            groupedArticles.push(tagWithArticles);
        });

        return groupedArticles;
    }

    function _extractTagsFromArticle(article) {
        if(!article.tags) {
            return NO_TAGS_ARRAY;
        }

        var tags =
            _(article.tags)
            .map(function(singleTag) {
                return singleTag.tag;
            }).value();

        return tags;
    }
};

module.exports = PocketDataMapper;