'use strict';

var express              = require('express'),
    bodyParser           = require('body-parser'),
    PocketApi            = require('./pocketApi.js'),
    PocketDataMapper     = require('./pocketDataMapper.js'),
    pocketApiConsumerKey = require('./consumerKey.js');

var pocketApi = new PocketApi(pocketApiConsumerKey, { });
var pocketDataMapper = new PocketDataMapper();

var app = express(),
    port = 1111;

// config
app.use(bodyParser.json());

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
        var articlesGroupedByTags = pocketDataMapper.groupByTags(data);

        res.send(articlesGroupedByTags);
    });
});

app.post('/archiveArticle', function(req, res) {
    console.log(req.body.articleId);
    res.send('confirmed');
});

// VIEWS
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
