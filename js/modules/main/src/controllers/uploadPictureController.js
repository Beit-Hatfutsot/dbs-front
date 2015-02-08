var UploadPictureController = function($scope, notification, auth) {
    var self = this;

    this.$scope = $scope;
    this.notification = notification;
    this.auth = auth;

	this.meta_data = {
        title_en:          '',
        description_en:    '',
        location_en:       '',
        date_en:           '',
        creator_name_en:   '',
        people_present_en: '',
        title_he:          '',
        description_he:    '',
        location_he:       '',
        date_he:           '',
        creator_name_he:   '',
        people_present_he: ''
	};
    this.meta_data_placeholders = {
        title:          '',
        description:    '',
        location:       '',
        date:           '',
        creator_name:   '',
        people_present: ''
    };
};

UploadPictureController.prototype = {
	submit: function() {
        console.log(this.$scope)
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

angular.module('main').controller('UploadPictureController', ['$scope', 'notification', 'auth', UploadPictureController]);