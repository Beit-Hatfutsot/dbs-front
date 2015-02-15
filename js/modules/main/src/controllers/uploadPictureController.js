var UploadPictureController = function($scope, notification, auth, langManager) {
    var self = this;

    this.$scope = $scope;
    this.notification = notification;
    this.auth = auth;

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
            return this.flow.files[0].isUploading();
        }
    });

    $scope.$watch(function(){return self.in_progress;}, function(newVal) {
        if (newVal) {
            notification.put({
                en: 'Upload in progress...',
                he: 'העלאה מתבצעת...'
            });
        }
    });
};

UploadPictureController.prototype = {
	submit: function() {
        console.log(this.flow)
        if (this.flow.files.length > 0) {
            this.$scope.uploadCtrl.upload.apply(this);
        }
	},

    onSuccess: function() {
        this.notification.put({
            en: 'Upload succeeded.',
            he: 'העלאת הקובץ הסתיימה בהצלחה.'
        });
        this.clear_form();
        this.success = true;
    },

    onError: function() {
        this.notification.put({
            en: 'Upload failed.',
            he: 'העלאת הקובץ נכשלה.'
        });
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
    },

    reset: function() {
        $scope.uploadCtrl.reset_flow.apply(this);
    },

    remove_file: function() {
        $scope.uploadCtrl.remove_file.apply(this);
    }
};

angular.module('main').controller('UploadPictureController', ['$scope', 'notification', 'auth', 'langManager', UploadPictureController]);