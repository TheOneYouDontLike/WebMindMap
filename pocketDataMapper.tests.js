'use strict';
var _ = require('lodash'),
    fs = require('fs'),
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
            log(parsedFile);
            log('trololo');
            done();
        });
    });

    it('should map', function(done) {
        var articles = pocketDataMapper.groupByTags(parsedFile);
        console.log(articles);
    });
});