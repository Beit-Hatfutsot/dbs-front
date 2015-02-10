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
            en: 'Upload succeeded',
            he: 'הצלחה!'
        });
        this.success = true;
    },

    onError: function() {
        this.failed = true;
    }
};

angular.module('main').controller('UploadPictureController', ['$scope', 'notification', 'auth', 'langManager', UploadPictureController]);