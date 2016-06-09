var UploadController = function($scope, $state, auth, apiClient, langManager, mjs, notification, $modal) {
    var self = this;

    this.$scope = $scope;
    this.auth = auth;
    this.langManager = langManager;
    this.mjs = mjs;
    this.notification = notification;
    this.$modal = $modal;
    this.placement = langManager.lang === 'en' ? 'left':'right';
    this.flow_init = {
        target:             apiClient.urls.upload, 
        testChunks:         false, 
        singleFile:         true,
        supportDirectory:   false
    };

    this.tab_status = {};
    this.is_bilingual = false;
    this.copyright = false;
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
                        false: 'Title',
                        placeholder: 'In a few words, describe this image.'
                    },
                    he: {
                        true: '*כותרת',
                        false: 'כותרת',
                        placeholder: 'כתבו בכמה מילים מה רואים בתמונה.'
                    }
                },
                description: {
                    en: {
                        true: '*Description',
                        false: 'Description',
                        placeholder: 'Describe this image. Who is in this photo and what are they doing / what is the occasion? (Example: "Passover Seder at the Cohen family home.") Is there an interesting story that goes along with this image? This is the place to tell it!'
                    },
                    he: {
                        true: '*תיאור',
                        false: 'תיאור',
                        placeholder: 'הוסיפו תיאור כללי של התמונה - מה היו הנסיבות שבהן צולמה (לדוגמה - "סדר פסח בבית המשפחת כהן בעיירה פשמישל"), האם יש סיפור מעניין על מה שקורה בה וכו\'.'
                    }
                },
                location: {
                    en: {
                        true: '*Location',
                        false: 'Location',
                        placeholder: 'Where was this photo taken? (City, town, village, etc.) If unknown, write the country or region.'
                    },
                    he: {
                        true: '*מיקום',
                        false: 'מיקום',
                        placeholder: 'ציינו את שם המקום שבו צולמה התמונה. אם לא ידוע, ציינו חבל ארץ או מדינה. טיפ: הסתכלו מה רשום על גב התמונה.'
                    }
                },
                date: {
                    en: {
                        true: '*Date',
                        false: 'Date',
                        placeholder: 'On what date was this photo taken? If unknown, write the year, range of years, or decade.'
                    },
                    he: {
                        true: '*תאריך',
                        false: 'תאריך',
                        placeholder: 'ציינו תאריך מדויק שבו צולמה התמונה. אם לא ידוע, ציינו שנה או טווח שנים. טיפ: הסתכלו מה רשום על גב התמונה.'
                    }
                },
                creator_name: {
                    en: {
                        true: '*Photographer\'s name',
                        false: 'Photographer\'s name',
                        placeholder: 'If you are unsure of who took the picture, please write "unknown."'
                    },
                    he: {
                        true: '*שם הצלם',
                        false: 'שם הצלם',
                        placeholder: 'אם אינכם יודעים מי צילם את התמונה, או באיזה סטודיו צולמה, כתבו "לא יודע" או ציינו כמה זמן היא ברשותכם.'
                    }
                },
                people_present: {
                    en: {
                        true: '*Names of people in this photo',
                        false: 'Names of people in this photo',
                        placeholder: 'Name the people, objects, structures, etc. Please only indicate those whose identity is known to you.'
                    },
                    he: {
                        true: '*מי בתמונה? שמות ושמות משפחה של המצולמים',
                        false: 'מי בתמונה? שמות ושמות משפחה של המצולמים',
                        placeholder: 'שמות בני משפחה או אנשים אחרים, תיאור המבנים או מחפצים וכו\'. אם אינכם בטוחים בכל הפרטים, התמקדו באלה שכן.'
                    }
                }
            },

            validation_errors: {
                title: {
                    en: 'This field is mandatory',
                    he: 'שדה זה הינו שדה חובה'
                },
                description: {
                    en: 'This field is mandatory',
                    he: 'שדה זה הינו שדה חובה'
                },  
                location: {
                    en: 'This field is mandatory',
                    he: 'שדה זה הינו שדה חובה'
                },
                date: {
                    en: 'Please fill in a date, or at least a decade',
                    he: 'אנא הזינו תאריך מדויק או לפחות שנה'
                },
                creator_name: {
                    en: 'Who should we credit for this photo?',
                    he: 'מי בעל הזכויות על התמונה?'
                },
                people_present: {
                    en: 'This field is mandatory',
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
            notification.put(9);
        }
    });

    window.ctrl = this;
};

UploadController.prototype = {
    submit_file: function(event, $flow, files) {
        
    },

	upload: function(type) {
        this.reset_flow_data();

        this.flow.opts.headers["authentication-token"] = this.auth.get_token();        
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
        //this.mjs.refresh();
        this.clear_form();
        this.$modal.open({
            templateUrl: 'templates/main/upload/successful-upload.html',
            controller: 'UploadModalController',
            size: 'ftree'
        });
        /*this.notification.put({
            en: 'Upload succeeded.',
            he: 'העלאת הקובץ הסתיימה בהצלחה.'
        });*/
        this.success = true;
    },

    onError: function($file, $message) {
        if ($message && JSON.parse($message).error.substr(-13) === 'not supported') {
            this.notification.put(18);
        }
        else {
            this.notification.put(19);
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

angular.module('main').controller('UploadController', ['$scope', '$state', 'auth', 'apiClient', 'langManager', 'mjs', 'notification', '$modal', UploadController]);
