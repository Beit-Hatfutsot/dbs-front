'use strict';

describe("My Story Service", function() {

    var mjs, user, mjs_url, user_url, $httpBackend, $sessionStorage;

    beforeEach(function() {
        module('bhsclient-templates');
        module('main');
    });

    beforeEach(inject(function(_mjs_, _user_, _$httpBackend_, _$sessionStorage_,
                               apiClient) {
        mjs = _mjs_;
        user = _user_;
        $httpBackend = _$httpBackend_;
        mjs_url = apiClient.urls.mjs;
        user_url = apiClient.urls.user;
        $sessionStorage = _$sessionStorage_;
		mjs._latest = {name: 'tester',
                       email: 'tester@example.com',
                       story_items:
							[{id:'someid',
							  in_branch: [false, false, false, true]}],
                       story_branches: ['father']
            }
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("update the items in the story", function() {
        it ("should add an item to the story", function() {
            $httpBackend.expectPOST(mjs_url)
                .respond(200, {story_items: [{id:'another_id'}],
                               story_branches: ['father']});
            mjs.add('another id').then(function () {
                var data = mjs.latest;
                expect(data.story_items[0].id).toMatch('another_id');
            });
            $httpBackend.flush();
        });
        it ("should add an item to a branch and update the counters", function() {
            $httpBackend.expectPOST(mjs_url+'/'+1)
                .respond(200, {story_items: [{id:'someid',
                                              in_branch: [true, false, false, false]}],
                               story_branches: ['father']});
            mjs.add_to_branch('some_id', 0);
            $httpBackend.flush();
            expect(mjs.items_counters[0]).toEqual(1);
        });
        it ("should remove an item from a branch and update the counters", function() {
            $httpBackend.expectDELETE(mjs_url+'/4/someid')
                .respond(200, {story_items:
                                [{id:'someid',
                                  in_branch: [false, false, false, false]}],
                               story_branches: ['father']});
            mjs.remove_from_branch('someid', 3)
            $httpBackend.flush();
			expect(mjs.latest.story_items[0].in_branch[3]).toBeFalsy();
        });
        it ("should delete an item from the story", function() {
            $httpBackend.expectDELETE(mjs_url+'/someid')
                .respond(200, {story_items: [],
                               story_branches: ['father']});
            mjs.remove('someid');
            $httpBackend.flush();
			expect(mjs.latest.story_items.length).toEqual(0);
        });
    });
    describe("update the branches names", function() {
        it ("change the name of a branch", function() {
            $httpBackend.expectPOST(mjs_url+'/0/name')
                .respond(200, {story_items:
                                [{id:'someid',
                                  in_branch: [false, false, false, false]}],
                               story_branches: ['mother']});
            mjs.rename_branch(0, 'mother');
            $httpBackend.flush();
			expect(mjs.latest.story_branches[0]).toMatch('mother');
        });
    });
});
