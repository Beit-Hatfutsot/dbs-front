var last_state = 'closed';

var anim = ['header', function(header) {

    return {
        beforeAddClass: function(element, className, done) {
            if (className === 'ng-hide') {
                element.removeAttr('style');
                last_state = header.sub_header_state;
                done();
            } 
            else {
                done();
            }
        },
        removeClass: function(element, className, done) {
            if (className === 'ng-hide') {
            
                // show content without delay
                if (last_state == 'closed') {
                    element.css('opacity', 1);
                }
                done();
            }
            else {
                done();
            }
        }
    };
}];

angular.module('main').animation('.header-wizard', anim);
angular.module('main').animation('.breadcrumbs', anim);
