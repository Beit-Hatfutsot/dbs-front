var UploadImageController = function($scope, notification, auth, langManager, mjs) {
    var self = this;

    this.$scope = $scope;
    this.notification = notification;
    this.auth = auth;
    this.mjs = mjs;

    this.meta_data_order = ['title', 'description', 'location', 'date', 'creator_name', 'people_present'];

	this.meta_data = {
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
	};
    this.meta_data_placeholders = {
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
    };

    this.validation_errors = {
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
    };

    Object.defineProperty(this, 'lang', {
        get: function() {
            return langManager.lang;
        }
    });

    Object.defineProperty(this, 'submit_value', {
        get: function() {
            return $scope.uploadCtrl.submit_value;
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
};

UploadImageController.prototype = {
	submit: function() {
        if (this.flow.files.length > 0) {
            this.$scope.uploadCtrl.upload.apply(this);
        }
        //document.getElementsByClassName('upload-droparea')[0].scrollIntoView(false);
        jQuery('html, body').animate({
            scrollTop: jQuery('.upload-droparea').offset().top - 110
        }, 1000);    
	},

    onSuccess: function() {
        this.mjs.refresh();
        this.notification.put({
            en: 'Upload succeeded.',
            he: 'העלאת הקובץ הסתיימה בהצלחה.'
        });
        this.clear_form();
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
        for (var field in this.meta_data) {
            for (var lang in this.meta_data[field]) {
                this.meta_data[field][lang] = '';
            }
            this.$scope.rc.upload_form.attempted = false;
            this.$scope.upload_form.$setPristine();
            
            this.reset();
        }

        this.failed = false;
        this.notification.clear();
    },

    reset: function() {
        this.$scope.uploadCtrl.reset_flow.apply(this);
    },

    remove_file: function() {
        this.$scope.uploadCtrl.remove_file.apply(this);
    },

    get_progress: function() {
        if (this.flow && this.flow.files[0]) {
            return this.flow.files[0].progress();
        }
    }
};

angular.module('main').controller('UploadImageController', ['$scope', 'notification', 'auth', 'langManager', 'mjs', UploadImageController]);