var UploadController = function($state, auth, apiClient) {
    var self = this;

    this.auth = auth;

    this.flow_init = {
        target:             apiClient.urls.upload, 
        testChunks:         false, 
        singleFile:         true,
        supportDirectory:   false
    };

    this.tab_status = {};

    // configure tab_status properties
    [
        'picture', 
        'video', 
        'music', 
        'family_tree'
    ].
    forEach(function(state) {
        var state_name = 'upload.' + state;
        Object.defineProperty(self.tab_status, state, {
            get: function() {
                return $state.includes(state_name);
            },
            set: function(newVal) {
                if (newVal) {
                    $state.go(state_name);
                }
            }
        });
    });
};

UploadController.prototype = {
    submit_file: function(event, $flow, files) {
        
    },

	upload: function() {
        var self = this;

        this.flow.opts.headers.Authorization = 'Bearer ' + self.auth.get_token();
        this.flow.opts.query.title          = this.meta_data.title;
        this.flow.opts.query.description    = this.meta_data.description;
        this.flow.opts.query.location       = this.meta_data.location;
        this.flow.opts.query.date           = this.meta_data.date;
        this.flow.opts.query.creator_name   = this.meta_data.creator_name;
        this.flow.opts.query.people_present = this.meta_data.people_present;
        this.flow.upload();
	}
};

angular.module('main').controller('UploadController', ['$state', 'auth', 'apiClient', UploadController]);