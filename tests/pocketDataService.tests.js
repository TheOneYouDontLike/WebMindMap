'use strict';
var assert = require('assertthat'),
    _pocketDataService = require('../helpers/pocketDataService.js');

function log(sth) {
    console.log(sth);
}

describe('pocketDataService', function() {
    it('should move unread article to archived collection of given tag', function() {
        // given
        var unreadArticle = {
            id: 4868,
            status: 'unread',
            // ...
            tags: ['development']
        };

        var pocketData = [{
            tag: 'development',
            unread: [unreadArticle],
            archived: []
        }];

        // when
        _pocketDataService.updatePocketDataAfterArchiving(pocketData, unreadArticle.id, unreadArticle.tags);

        // then
        assert.that(pocketData[0].unread.length).is.equalTo(0);
        assert.that(pocketData[0].archived.length).is.equalTo(1);
        assert.that(pocketData[0].archived[0].status).is.equalTo('archived');
    });

    it('should move archived article to unread collection of given tag', function() {
        // given
        var archivedArticle = {
            id: 4868,
            status: 'archived',
            // ...
            tags: ['development']
        };

        var pocketData = [{
            tag: 'development',
            unread: [],
            archived: [archivedArticle]
        }];

        // when
        _pocketDataService.updatePocketDataAfterArchiving(pocketData, archivedArticle.id, archivedArticle.tags);

        // then
        assert.that(pocketData[0].unread.length).is.equalTo(1);
        assert.that(pocketData[0].archived.length).is.equalTo(0);
        assert.that(pocketData[0].unread[0].status).is.equalTo('unread');
    });

    it('should move unread article to archived collection of given tags', function() {
        // given
        var unreadArticle = {
            id: 4868,
            status: 'unread',
            // ...
            tags: ['development', 'dev']
        };

        var pocketData = [
        {
            tag: 'development',
            unread: [unreadArticle],
            archived: []
        },
        {
            tag: 'dev',
            unread: [unreadArticle],
            archived: []
        }];

        // when
        _pocketDataService.updatePocketDataAfterArchiving(pocketData, unreadArticle.id, unreadArticle.tags);

        // then
        assert.that(pocketData[0].unread.length).is.equalTo(0);
        assert.that(pocketData[1].unread.length).is.equalTo(0);
        assert.that(pocketData[0].archived.length).is.equalTo(1);
        assert.that(pocketData[1].archived.length).is.equalTo(1);
        assert.that(pocketData[0].archived[0].status).is.equalTo('archived');
        assert.that(pocketData[1].archived[0].status).is.equalTo('archived');
    });
});

