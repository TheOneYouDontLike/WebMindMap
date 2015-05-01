'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    assert = require('assertthat'),
    PocketDataMapper = require('./pocketDataMapper.js');

var pocketDataMapper = new PocketDataMapper();

function log(sth) {
    console.log(sth);
}

describe('pocketDataMapper', function() {
    var parsedFile = {};

    before(function(done) {
        fs.readFile('temp.test.json', function(error, data) {
            if(error) { log(error); }
            parsedFile = JSON.parse(data);
            done();
        });
    });

    it('should map pure pocket data to form used by application', function() {
        // when
        var articles = pocketDataMapper.mapFromApi(parsedFile).articles;

        // then
        var expected =
        {
            id: 4868,
            url: 'http://www.ergotron.com/tabid/305/language/en-US/default.aspx',
            title: 'Ergonomic Workspace Planner, Workstation Installation Tool',
            favorite: false,
            status: 'unread',
            excerpt: 'Remember! Even if your workspace is set up properly you can still get muscle fatigue from maintaining the same posture for too long—adjust the position of your monitor, keyboard and chair as your posture changes.  Notes: Be sure to include shoe height to figure proper measurement.',
            tags: ['development', 'dev']
        };

        assert.that(articles[0]).is.equalTo(expected);
    });

    it('should return all possible tags', function() {
        // when
        var tags = pocketDataMapper.mapFromApi(parsedFile).tags;

        // then
        var expected = ['_no_tags_', 'dev', 'development'];

        assert.that(tags).is.equalTo(expected);
    });
});