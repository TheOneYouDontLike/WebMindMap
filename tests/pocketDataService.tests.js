'use strict';
var assert = require('assertthat'),
    _pocketDataService = require('../helpers/pocketDataService.js');

function log(sth) {
    console.log(sth);
}

describe('pocketDataService', function() {
    it('should move tag to archived section of given tag after archiving', function() {
        // given
        var unreadArticle = {
            id: 4868,
            status: 'unread',
            // ...
            tags: ['development', 'dev']
        };

        var pocketData = [{
            tag: 'development',
            unread: [unreadArticle],
            archived: []
        }];

        // when
        log(pocketData);
        _pocketDataService.updatePocketDataAfterArchiving(pocketData, unreadArticle.id, unreadArticle.tags);
        log(pocketData);

        // then
        assert.that(pocketData[0].unread.length).is.equalTo(0);
        assert.that(pocketData[0].archived.length).is.equalTo(1);
    });
});

