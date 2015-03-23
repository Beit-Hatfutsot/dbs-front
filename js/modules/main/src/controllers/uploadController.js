var UploadController = function($scope, $state, auth, apiClient, langManager, mjs, notification) {
    var self = this;

    this.$scope = $scope;
    this.auth = auth;
    this.langManager = langManager;
    this.mjs = mjs;
    this.notification = notification;

    this.flow_init = {
        target:             apiClient.urls.upload, 
        testChunks:         false, 
        singleFile:         true,
        supportDirectory:   false
    };

    this.tab_status = {};

    // configure tab_status properties
    [
        'image', 
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
        image: {
            en: 'Image',
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

    this.meta_data = {
        image: {
            order: ['title', 'description', 'location', 'date', 'creator_name', 'people_present'],

            values: {
                title: {
                    en: '',
                    he: ''
                },
                description: {
                    en: '',
                    he: ''
                },  
                location: {
                    en: '',
                    he: ''
                },
                date: {
                    en: '',
                    he: ''
                },
                creator_name: {
                    en: '',
                    he: ''
                },
                people_present: {
                    en: '',
                    he: ''
                }
            },

            placeholders: {
                title:  {
                    en: {
                        true: '*Title',
                        false: 'Title'
                    },
                    he: {
                        true: '*כותרת',
                        false: 'כותרת',
                    }
                },
                description: {
                    en: {
                        true: '*Description',
                        false: 'Description'
                    },
                    he: {
                        true: '*תאור',
                        false: 'תאור'
                    }
                },
                location: {
                    en: {
                        true: '*Location',
                        false: 'Location'
                    },
                    he: {
                        true: '*מיקום',
                        false: 'מיקום'
                    }
                },
                date: {
                    en: {
                        true: '*Date',
                        false: 'Date'
                    },
                    he: {
                        true: '*תאריך',
                        false: 'תאריך'
                    }
                },
                creator_name: {
                    en: {
                        true: '*Photographer\'s name',
                        false: 'Photographer\'s name'
                    },
                    he: {
                        true: '*שם הצלם',
                        false: 'שם הצלם'
                    }
                },
                people_present: {
                    en: {
                        true: '*Names of people in this photo',
                        false: 'Names of people in this photo'
                    },
                    he: {
                        true: '*שמות האנשים בתמונה זו',
                        false: 'שמות האנשים בתמונה זו'
                    }
                }
            },

            validation_errors: {
                title: {
                    en: 'Yo, check it, you gots to have title',
                    he: 'שדה זה הינו שדה חובה'
                },
                description: {
                    en: 'You better check yourself',
                    he: 'שדה זה הינו שדה חובה'
                },  
                location: {
                    en: 'before you wreck yourself',
                    he: 'שדה זה הינו שדה חובה'
                },
                date: {
                    en: 'Please fill in a date, or at least a decade',
                    he: 'שדה זה הינו שדה חובה'
                },
                creator_name: {
                    en: 'Who should we credit for this photo?',
                    he: 'שדה זה הינו שדה חובה'
                },
                people_present: {
                    en: 'Tag your friends yo',
                    he: 'שדה זה הינו שדה חובה'
                }
            }
        },

        ftree: {
            order: ['title'],

            values: {
                title: {
                    en: '',
                    he: ''
                },
            },

            placeholders: {
                title:  {
                    en: {
                        true: '*Title',
                        false: 'Title'
                    },
                    he: {
                        true: '*כותרת',
                        false: 'כותרת',
                    }
                },
            },

            validation_errors: {
                title: {
                    en: 'Yo, check it, you gots to have title',
                    he: 'שדה זה הינו שדה חובה'
                },
            }
        }
    }

    Object.defineProperty(this, 'lang', {
        get: function() {
            return langManager.lang;
        }
    });

    Object.defineProperty(this, 'in_progress', {
        get: function() {
            return this.flow && this.flow.files[0] && this.flow.files[0].isUploading();
        }
    });

    Object.defineProperty(this, 'upload_progress', {
        get: function() {
            return parseInt(this.get_progress() * 100);
        }
    });

    Object.defineProperty(this, 'fail_reason', {
        get: function() {
            return notification;
        }
    });

    Object.defineProperty(this, 'is_image', {
        get: function() {
            try {
                if (this.flow.files[0].file.type.substr(0, 5) === 'image') {
                    return true
                }
                else {
                    return false;
                }
            }
            catch(e) {
                return false;
            }
        }
    });

    $scope.$watch(function() {
        return self.in_progress;
    }, 
    function(newVal) { 
        if (newVal) {
            notification.put({
                en: 'Upload in progress...',
                he: 'העלאה מתבצעת...'
            });
        }
    });

    window.ctrl = this
};

UploadController.prototype = {
    submit_file: function(event, $flow, files) {
        
    },

	upload: function(type) {
        this.reset_flow_data();

        this.flow.opts.headers.Authorization = 'Bearer ' + this.auth.get_token();
        
        for (var field in this.meta_data[type].values) {
            this.flow.opts.query[field + '_en'] = this.meta_data[type].values[field].en;
            this.flow.opts.query[field + '_he'] = this.meta_data[type].values[field].he;
        }

        this.flow.files[0].retry();
	},

    get_tab_heading: function(type) {
        return this.tab_headings[type][this.langManager.lang]
    },

    reset_flow: function() {
        this.flow.opts.headers.Authorization = '';
        this.reset_flow_data();
        this.remove_file();
    },

    reset_flow_data: function() {
        for (var type in this.meta_data) {
            for (var field in this.meta_data[type].values) {
                delete this.flow.opts.query[field + '_en'];
                delete this.flow.opts.query[field + '_he'];
            }
        }
    },

    remove_file: function() {
        this.flow.removeFile( this.flow.files[0] );
    },

    submit: function(type) {
        if (this.flow.files.length > 0) {
            this.upload(type);
        }
        //document.getElementsByClassName('upload-droparea')[0].scrollIntoView(false);
        jQuery('html, body').animate({
            scrollTop: jQuery('.upload-droparea').offset().top - 110
        }, 1000);    
    },

    onSuccess: function() {
        this.mjs.refresh();
        this.clear_form();
        this.notification.put({
            en: 'Upload succeeded.',
            he: 'העלאת הקובץ הסתיימה בהצלחה.'
        });
        this.success = true;
    },

    onError: function($file, $message) {
        if ($message && JSON.parse($message).error.substr(-13) === 'not supported') {
            this.notification.put({
                en: 'This file type is not supported, please try uploading a supported file',
                he: 'שוג הקובץ הזה אינו נתמך, אנא נסו להעלות קובץ מסוג נתמך'
            });
        }
        else {
            this.notification.put({
                en: 'Something went wrong, please try uploading again',
                he: 'משהו השתבש, אנא נסו שוב'
            });
        }

        this.failed = true;
    },

    clear_form: function() {
        for (var type in this.meta_data) {
            for (var field in this.meta_data[type].values) {
                for (var lang in this.meta_data[type].values[field]) {
                    this.meta_data[type].values[field][lang] = '';
                }
            }
        }

        this.uploadFormCtrl.$scope.rc.upload_form.attempted = false;
        this.uploadFormCtrl.$scope.upload_form.$setPristine();
        
        this.reset_flow();

        this.failed = false;
        this.success = false;
        this.notification.clear();
    },

    get_progress: function() {
        if (this.flow && this.flow.files[0]) {
            return this.flow.files[0].progress();
        }
    }
};

angular.module('main').controller('UploadController', ['$scope', '$state', 'auth', 'apiClient', 'langManager', 'mjs', 'notification', UploadController]);