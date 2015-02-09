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
            en: 'Title',
            he: 'כותרת'
        },
        description: {
            en: 'Description',
            he: 'תאור'
        },
        location: {
            en: 'Location',
            he: 'מיקום'
        },
        date: {
            en: 'Date',
            he: 'תאריך'
        },
        creator_name: {
            en: 'Photographer\'s name',
            he: 'שם הצלם'
        },
        people_present: {
            en: 'Names of people in this photo',
            he: 'שמות האנשים בתמונה זו'
        }
    };

    Object.defineProperty(this, 'lang_order', {
        get: function() {
            if (langManager.lang === 'he') {
                return ['he', 'en'];
            }
            
            return ['en', 'he'];
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