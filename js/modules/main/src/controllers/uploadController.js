var UploadController = function($state, auth, apiClient) {
    var self = this;

    this.auth = auth;
	this.meta_data = {
        title:          'test',
        description:    'test',
        location:       'test',
        date:           'test',
        creator_name:   'test',
        people_present: 'test'
	};
    this.meta_data_placeholders = {
        title:          '',
        description:    '',
        location:       '',
        date:           '',
        creator_name:   '',
        people_present: ''
    };
    this.flow_init = {
        target:             apiClient.urls.upload, 
        testChunks:         false, 
        singleFile:         true,
        supportDirectory:   false
    };
    this.tab_status = {};
    [
        'picture', 
        'video', 
        'music', 
        'family_tree'
    ].forEach(function(state) {
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
    /*
    this.tab_status = {
        get picture() {
            return $state.includes('upload.picture');
        },
        set picture(newVal) {
            if (newVal) {
                $state.go('upload.picture');
            }
        },
        get video() {
            return $state.includes('upload.video');
        },
        set video(newVal) {
            if (newVal) {
                $state.go('upload.video');
            }
        },
        get music() {
            return $state.includes('upload.music');
        },
        set music(newVal) {
            if (newVal) {
                $state.go('upload.music');
            }
        },
        get family_tree() {
            return $state.includes('upload.family_tree');
        },
        set family_tree(newVal) {
            if (newVal) {
                $state.go('upload.family_tree');
            }
        }
    };*/
};

UploadController.prototype = {
	upload: function(event, $flow, files) {
        $flow.opts.headers.Authorization = 'Bearer ' + this.auth.get_token();
        $flow.opts.query.title = this.meta_data.title;
        $flow.opts.query.description = this.meta_data.description;
        $flow.opts.query.location = this.meta_data.location;
        $flow.opts.query.date = this.meta_data.date;
        $flow.opts.query.creator_name = this.meta_data.creator_name;
        $flow.opts.query.people_present = this.meta_data.people_present;
        var promise = $flow.upload();
        var a = 2;
	},

    onSuccess: function() {
        this.success = true;
    },

    onError: function() {
        this.failed = true;
    }
};

angular.module('main').controller('UploadController', ['$state', 'auth', 'apiClient', UploadController]);