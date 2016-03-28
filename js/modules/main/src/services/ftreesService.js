angular.module('main').
	factory('ftrees', ['$http', '$q', 'apiClient', function($http, $q, apiClient) {
		var in_progress = false;
		var contributor_images = {
			'babylonjewry.org.il': 'images\/babylon.jpg'
		};

		var ftrees = {

			get_contributor_path: function(individual) {
				if (individual) {
					// check for editor remarks
					var editor_remarks = individual.editor_remarks || individual.EditorRemarks;
                    // Check for the contributor path metadata in the format of
                    // <source:contributor_id>
                    var contibutor_source_regex = new RegExp("<source:.+>");
                    var contributor_md_match = contibutor_source_regex.exec(editor_remarks);
                    if (contributor_md_match) {
                        var contributor_id = contributor_md_match[0].split(':')[1].split('>')[0];
				        if (contributor_id in contributor_images) {
					        return contributor_images[contributor_id];	
				        }
				    }
                }
			},

			search: function(params) {
				//if (!in_progress) { 
					var self = this;

					in_progress = true;
					var deferred = $q.defer();
					
					$http.get(apiClient.urls.ftrees_search, {params: params}).
						success(function(individuals) {
							deferred.resolve(individuals);
						}).
						error(function() {
							deferred.reject();
						}).
						finally(function() {
							in_progress = false;
						});

					return deferred.promise;
				//}
			},
		}

		return ftrees;
	}]);
