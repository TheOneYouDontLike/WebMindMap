'use strict';

var express              = require('express'),
    _                    = require('lodash'),
    PocketApi            = require('./pocketApi.js'),
    pocketApiConsumerKey = require('./consumerKey.js');

var pocketApi = new PocketApi(pocketApiConsumerKey);

var app = express(),
    port = 1111;
    //requestToken = '',
    //redirectUri = 'http://localhost:1111/authenticated';

app.get('/getRequestToken', function(req, res) {
    pocketApi.getRequestToken(function(error, obtainedRequestToken) {
        res.send(obtainedRequestToken);
    });
});

app.get('/getAccessToken/:requestToken', function(req, res) {
    console.log(req.params.requestToken);
    pocketApi.getAccessToken(req.params.requestToken, function(error, accessToken) {
        res.send(accessToken);
    });
});

app.get('/getArticles/:accessToken', function(req, res) {
    pocketApi.getAll(req.params.accessToken, function(error, data) {
        var articlesGroupedByTags = _groupByTags(data);

        console.log(articlesGroupedByTags);
        res.send(articlesGroupedByTags);
    });
});

function _groupByTags(pocketData) {
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

// VIEWS
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
