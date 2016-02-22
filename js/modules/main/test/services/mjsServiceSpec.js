'use strict';

describe("My Story Service", function() {

	var mjs, user, mjs_url, user_url, $httpBackend, $sessionStorage;

	beforeEach(function() {
		module('templates');
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
	}));

	beforeEach(function() {
		// expect the service to get the user with a basic story
		$httpBackend.expectGET(user_url)
			.respond(200, {name: 'tester',
						   email: 'tester@example.com',
						   story_items:
								[{id:'someid',
								  in_branch: [false, false, false, true]}],
						   story_branches: ['father'] 
			});
	})
	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe("get the story", function() {

		var story;

		it ("should return the user's story", function() {
			mjs.get().then(function (data) {
				expect(data.story_items.length).toEqual(1);
				expect(data.story_branches[0]).toMatch('father');
				expect(mjs._latest).toBe(data);
			});
			$httpBackend.flush();
			// next call should get the data from memory
			expect(mjs._latest).not.toBeNull();
			mjs.get().then (function(data) {
				expect(data.story_items.length).toEqual(1);
				expect(data.story_branches[0]).toMatch('father');
			});
		});
	});
	describe("update the items in the story", function() {
		it ("should add an item to the story", function() {
			$httpBackend.expectPOST(mjs_url)
				.respond(200, {story_items: [{id:'another_id'}],
						 	   story_branches: ['father']});
			mjs.add('another id').then(function () {
				var data = mjs._latest;
				expect(data.story_items[0].id).toMatch('another_id');
				mjs.get().then(function(data) {
					expect(data.story_items[0].id).toMatch('another_id');
				});
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
			mjs.get().then(function (story) {
				expect(story.story_items[0].in_branch[3]).toBeFalsy();
			});
		});
		it ("should delete an item from the story", function() {
			$httpBackend.expectDELETE(mjs_url+'/someid')
				.respond(200, {story_items: [],
							   story_branches: ['father']});
			mjs.remove('someid');
		    $httpBackend.flush();
			mjs.get().then(function (story) {
				expect(story.story_items.length).toEqual(0);
			});
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
			mjs.get().then(function (story) {
				expect(story.story_branches[0]).toMatch('mother');
			});
		});
	});
});
