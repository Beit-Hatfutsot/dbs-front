'use strict';

describe('StartController', function() {
	var scope, wizard, $timeout;

	beforeEach(function() {
		module('templates');
		module('main');
	});

	beforeEach(inject(function($rootScope, $controller, $q, _$timeout_) {
		$timeout = _$timeout_;
		wizard = {
			in_progress: false,
			query: {
				name: '',
				place: ''
			},
			search: function() {
				var self = this;
				var deferred = $q.defer();

				this.in_progress = true;
				$timeout(function() {
					self.in_progress = false;

					self.result = {
						name: self.query.name || {},
						place: self.query.place || {}
					};

					deferred.resolve();
				});

				return deferred.promise;
			}
		}
		scope = $rootScope.$new(); 
		$controller('StartController as startCtrl', {$scope: scope, wizard: wizard});
	}));

	it('should set and get a language', function() {
		scope.startCtrl.lang = 'en';
		expect(scope.startCtrl.lang).toBe('en');

		scope.startCtrl.lang = 'he';
		expect(scope.startCtrl.lang).toBe('he');
	});

	it('should know if a wizard search is in progress', function() {
		wizard.search();
		expect(scope.startCtrl.in_progress).toBe(true);
		$timeout.flush();
		expect(scope.startCtrl.in_progress).toBe(false);
	});

	it('should choose a name result over place result from wizard results', function() {
		wizard.query = {
			name: {
				_id: 'name-id',
				UnitType: 6
			},
			place: {
				_id: 'place-id',
				UnitType: 5
			}
		}
		wizard.search();
		$timeout.flush();
		var chosen_result = scope.startCtrl.choose_result()
		expect(chosen_result).toBe('familyNames.name-id');
	});

	it('should choose a place result when name is empty', function() {
		wizard.query = {
			name: '',
			place: {
				_id: 'place-id',
				UnitType: 5
			}
		}
		wizard.search();
		$timeout.flush();
		var chosen_result = scope.startCtrl.choose_result()
		expect(chosen_result).toBe('places.place-id');
	});

	it('should choose a name result when place is empty', function() {
		wizard.query = {
			name: {
				_id: 'name-id',
				UnitType: 6
			},
			place: ''
		}
		wizard.search();
		$timeout.flush();
		var chosen_result = scope.startCtrl.choose_result()
		expect(chosen_result).toBe('familyNames.name-id');
	});
});
