/**
 * AngularJS directives for social sharing buttons - Facebook Like, Google+, Twitter and Pinterest
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.2.0
 */
angular.module('main')
  .directive('fbShare', ['$window', function ($window) {
		  return {
			  restrict: 'E',
			  link: function (scope, element, attrs) {
				  if (!$window.FB) {
            // Load Facebook SDK if not already loaded
					  jQuery.getScript('http://connect.facebook.net/en_US/sdk.js', function () {
						  $window.FB.init({
							    appId: '1116428245070195',
                  status: true,
                  cookie: true,
                  xfbml: true,
                  version: 'v2.4'
						  });
						  renderButton();
					  });
				  } else {
					  renderButton();
				  }

				  var watchAdded = false;
				  function renderButton() {
					  if (!!attrs.fbLike && !scope.fbLike && !watchAdded) {
						  // wait for data if it hasn't loaded yet
						  watchAdded = true;
						  var unbindWatch = scope.$watch('fbLike', function (newValue, oldValue) {
							  if (newValue) {
								  renderButton();
								  // only need to run once
								  unbindWatch();
							  }
						  });
						  return;
					  } else {
						  element.html('<div class="fb-share-button" data-href="' + $window.location.href + '" data-layout="button"></div>');
						  $window.FB.XFBML.parse(element.parent()[0]);
					  }
				  }
			  }
		  }
	  }
  ])
  .directive('tweet', [ '$window', '$location', function ($window, $location) {
		  return {
			  restrict: 'E',
			  scope: {
				  text: '@',
				  href: '@'
			  },
			  link: function (scope, element, attrs) {
				  if (!$window.twttr) {
					  // Load Twitter SDK if not already loaded
					  jQuery.getScript('//platform.twitter.com/widgets.js', function () {
						  renderTweetButton();
					  });
				  } else {
					  renderTweetButton();
				  }

				  var watchAdded = false;
				  function renderTweetButton() {
					  // if (!watchAdded) {
					  if (!true) {
						  // wait for data if it hasn't loaded yet
						  watchAdded = true;
						  var unbindWatch = scope.$watch('tweet', function (newValue, oldValue) {
							  if (newValue) {
								  renderTweetButton();
								  // only need to run once
								  unbindWatch();
							  }
						  });
						  return;
					  } else {
						  element.html('<a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-text="' + scope.text + '" data-url="' + (scope.href || $location.absUrl()) + '">Tweet</a>');
						  $window.twttr.widgets.load(element.parent()[0]);
					  }
				  }
			  }
		  };
	  }
  ])
  .directive('sendMail', [ '$window', '$location', function ($window, $location) {
		  return {
			  restrict: 'E',
			  template: '<a href="mailto:?to=&subject=check%20this%20sout!&body={{url}}">Mail</a>',
			  scope: {
				  'url': "=?"
			  }
		  }
	  }
  ])
