'use strict';

var _ = require('lodash');

var PocketDataMapper = function() {
    var module = {};

    module.groupByTags = groupByTags;

    return module;

    function groupByTags(pocketData) {
        var listOfArticles = _.toArray(pocketData.list);

        var allTags =
            _(listOfArticles)
            .map(function(article) {
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

        var groupedArticles = [];
            _.forEach(allTags, function(tag) {

                var articlesGroupedByTag =
                    _(listOfArticles)
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
        var tags =
            _(article.tags)
            .map(function(singleTag) {
                return singleTag.tag;
            }).value();

        return tags;
    }
};

module.exports = PocketDataMapper;