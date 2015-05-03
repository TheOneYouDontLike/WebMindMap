'use strict';

var express              = require('express'),
    bodyParser           = require('body-parser'),
    PocketApi            = require('./pocketApi.js'),
    PocketDataMapper     = require('./pocketDataMapper.js'),
    pocketApiConsumerKey = require('./consumerKey.js'),
    ARTICLE_STATUS       = require('./helpers/articleStatusConstants.js');

var dataSource = {
    //dataSource: 'temp.json'
    //saveToFile: true
};

var pocketApi = new PocketApi(pocketApiConsumerKey, dataSource);
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
        var allData = pocketDataMapper.mapFromApi(data);

        res.send(allData);
    });
});

app.post('/archiveArticle', function(req, res) {
    var action = {};
    if (req.body.currentStatus === ARTICLE_STATUS.ARCHIVED) {
        action = {
            action : 'readd',
            item_id : req.body.articleId,
        };
    } else {
        action = {
            action : 'archive',
            item_id : req.body.articleId,
        };
    }

    pocketApi.performAction(action, req.body.accessToken, function(error, data) {
        if (error) { console.log('logging error: '); console.log(error); res.send(error.message); }
        res.send('Done!');
    });
});

app.post('/deleteArticle', function(req, res) {
    var action = {
        action : 'delete',
        item_id : req.body.articleId,
    };

    pocketApi.performAction(action, req.body.accessToken, function(error, data) {
        if (error) { console.log('logging error: '); console.log(error); res.send(error.message); }
        res.send('Deleted!');
    });
});

app.post('/favoriteArticle', function(req, res) {
    var action = {
        action : 'favorite',
        item_id : req.body.articleId,
    };

    pocketApi.performAction(action, req.body.accessToken, function(error, data) {
        if (error) { console.log('logging error: '); console.log(error); res.send(error.message); }
        res.send('Favorited!');
    });
});

// VIEWS
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('server started at port: ' + port);
});
