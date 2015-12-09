var NewsLetterPopoverCtrl = function($http) {
    var self = this;
    self.email = '';
    self.tried = false;
    self. registered = false;

    self.get_languages_array = function () {
        var ret = []
        for(var i in self.checkboxes) {
            var checkbox = self.checkboxes[i];
            if(checkbox.is_checked)
                ret.push(checkbox.value);
            };
        return ret;
    };

    self.no_languages = function() {
        for(var i in self.checkboxes) {
            var checkbox = self.checkboxes[i];
            if(checkbox.is_checked)
                return false;
            }
        return true;
    };

    self.checkboxes = [
        {label: 'English', is_checked: false, name: 'en', value:'registration-form-en'},
        {label: 'Español', is_checked: false, name: 'sp', value:'registration-form-sp'},
        {label: 'עברית', is_checked: false, name: 'he', value:'registration-form-he'}
    ]; 

    self.submit = function() {
        if(!this.no_languages())  {
            $http ({
                method: "post",
                url: "http://www.bh.org.il/wp-content/themes/bh/functions/widgets/active-trail-newsletter/newsletter-api.php",
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: {mm_userid: 59325, mm_newemail: this.email, mm_key: this.get_languages_array()}
            }).finally(function (data, status) {
                    if (data==0) {
                        self.registered = true;
                    }
                })
        }
        else 
            self.tried = true;

    };

    self.popover = {
        is_open: false,

        open: function open() {
            self.popover.is_open = true;
        }, 

        close: function close() {
            self.popover.is_open = false;
        }
    };
}

angular.module('main').controller('NewsLetterPopoverCtrl', ['$http', NewsLetterPopoverCtrl]);
