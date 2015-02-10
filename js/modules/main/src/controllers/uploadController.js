var UploadController = function($state, auth, apiClient, langManager) {
    var self = this;

    this.auth = auth;
    this.langManager = langManager;

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

    this.tab_headings = {
        picture: {
            en: 'Picture',
            he: 'תמונה'
        },
        video: {
            en: 'Video',
            he: 'וידאו'
        },
        music: {
            en: 'Music',
            he: 'מוסיקה'
        },
        family_tree: {
            en: 'Family Tree',
            he: 'עץ משפחה'
        },
    };

    this.submit_value = {
        en: 'Submit',
        he: 'שלח'
    };
};

UploadController.prototype = {
    submit_file: function(event, $flow, files) {
        
    },

	upload: function() {
        this.flow.opts.headers.Authorization = 'Bearer ' + this.auth.get_token();
        this.flow.opts.query.title_en           = this.meta_data.title.en;
        this.flow.opts.query.description_en     = this.meta_data.description.en;
        this.flow.opts.query.location_en        = this.meta_data.location.en;
        this.flow.opts.query.date_en            = this.meta_data.date.en;
        this.flow.opts.query.creator_name_en    = this.meta_data.creator_name.en;
        this.flow.opts.query.people_present_en  = this.meta_data.people_present.en;
        this.flow.opts.query.title_he           = this.meta_data.title.he;
        this.flow.opts.query.description_he     = this.meta_data.description.he;
        this.flow.opts.query.location_he        = this.meta_data.location.he;
        this.flow.opts.query.date_he            = this.meta_data.date.he;
        this.flow.opts.query.creator_name_he    = this.meta_data.creator_name.he;
        this.flow.opts.query.people_present_he  = this.meta_data.people_present.he;
        this.flow.upload();
	},

    get_tab_heading: function(type) {
        return this.tab_headings[type][this.langManager.lang]
    }
};

angular.module('main').controller('UploadController', ['$state', 'auth', 'apiClient', 'langManager',UploadController]);