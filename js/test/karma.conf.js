// Karma configuration
// Generated on Tue Mar 25 2014 11:53:48 GMT+0200 (IST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../../',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

              'bower_components/jquery/dist/jquery.js',

              'bower_components/angular/angular.js',

              'bower_components/angular-animate/angular-animate.js',

              'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

              'bower_components/marked/lib/marked.js',

              'bower_components/angular-mocks/angular-mocks.js',

              'bower_components/angular-resource/angular-resource.js',

              'bower_components/angular-sanitize/angular-sanitize.js',

              'bower_components/angular-ui-router/release/angular-ui-router.js',

              'bower_components/flow.js/dist/flow.js',

              'bower_components/ngstorage/ngStorage.js',

              'bower_components/angular-gravatar/build/angular-gravatar.js',

              'bower_components/angular-marked/angular-marked.js',

              'bower_components/ng-flow/dist/ng-flow.js',

              'bower_components/angular-mocks/angular-mocks.js',

              'js/modules/rc_submit/src/_init/_init.js',

              'js/modules/rc_submit/src/directives/rcSubmitDirective.js',

              'js/modules/main/src/_init/_init.js',

              'js/modules/plumb/src/_init/_init.js',

              'js/modules/plumb/src/services/services.js',

              'js/modules/plumb/src/directives/directives.js',

              'js/modules/plumb/src/controllers/controllers.js',

              'js/modules/main/src/services/wizardService.js',

              'js/modules/main/src/services/tokenVerifierService.js',

              'js/modules/main/src/services/suggestService.js',

              'js/modules/main/src/services/recentlyViewedService.js',

              'js/modules/main/src/services/notificationService.js',

              'js/modules/main/src/services/musicalChairsFactory.js',

              'js/modules/main/src/services/mjsService.js',

              'js/modules/main/src/services/itemTypeMapService.js',

              'js/modules/main/src/services/itemService.js',

              'js/modules/main/src/services/headerService.js',

              'js/modules/main/src/services/ftreesService.js',

              'js/modules/main/src/services/ftreeLayoutService.js',

              'js/modules/main/src/directives/uploadFormDirective.js',

              'js/modules/main/src/directives/uploadFieldsetDirective.js',

              'js/modules/main/src/directives/uploadAreaDirective.js',

              'js/modules/main/src/directives/treesPreviewDirective.js',

              'js/modules/main/src/directives/trackColorDirective.js',

              'js/modules/main/src/directives/subtreeDirective.js',

              'js/modules/main/src/directives/socialNetDirectives.js',

              'js/modules/main/src/directives/scrollTopDirective.js',

              'js/modules/main/src/directives/putValueDirective.js',

              'js/modules/main/src/directives/putIfDirective.js',

              'js/modules/main/src/directives/preventRightclickDirective.js',

              'js/modules/main/src/directives/personPreviewDirective.js',

              'js/modules/main/src/directives/noResultDirective.js',

              'js/modules/main/src/directives/mjsWidgetDirective.js',

              'js/modules/main/src/directives/mjsItemDirective.js',

              'js/modules/main/src/directives/laterNameDirective.js',

              'js/modules/main/src/directives/itemTypeDirective.js',

              'js/modules/main/src/directives/itemScrollDirective.js',

              'js/modules/main/src/directives/itemPreviewDirective.js',

              'js/modules/main/src/directives/iconDirective.js',

              'js/modules/main/src/directives/fudgedYearDirective.js',

              'js/modules/main/src/directives/fitThumbDirective.js',

              'js/modules/main/src/directives/filtersFieldDirective.js',

              'js/modules/main/src/directives/draggableDirective.js',

              'js/modules/main/src/directives/defaultFocusDirective.js',

              'js/modules/main/src/directives/alterUsernameDirective.js',

              'js/modules/main/src/directives/alterMjsBranchDirective.js',

              'js/modules/main/src/directives/addMjsBranchDirective.js',

              'js/modules/main/src/controllers/wizardFormCtrl.js',

              'js/modules/main/src/controllers/verifyEmailController.js',

              'js/modules/main/src/controllers/uploadModalController.js',

              'js/modules/main/src/controllers/uploadFormController.js',

              'js/modules/main/src/controllers/uploadController.js',

              'js/modules/main/src/controllers/treesPreviewController.js',

              'js/modules/main/src/controllers/subHeaderController.js',

              'js/modules/main/src/controllers/startController.js',

              'js/modules/main/src/controllers/recentlyViewedController.js',

              'js/modules/main/src/controllers/personViewController.js',

              'js/modules/main/src/controllers/personsWelcomeController.js',

              'js/modules/main/src/controllers/personsController.js',

              'js/modules/main/src/controllers/NewletterPopoverCtrl.js',

              'js/modules/main/src/controllers/mjsWidgetController.js',

              'js/modules/main/src/controllers/mjsController.js',

              'js/modules/main/src/controllers/itemPreviewCtrl.js',

              'js/modules/main/src/controllers/itemCtrl.js',

              'js/modules/main/src/controllers/headerCtrl.js',

              'js/modules/main/src/controllers/GeneralSearchController.js',

              'js/modules/main/src/controllers/galleryModalCtrl.js',

              'js/modules/main/src/animations/subHeaderAnimation.js',

              'js/modules/main/src/_init/polyfill.js',

              'js/modules/lang/src/_init/_init.js',

              'js/modules/lang/src/services/langManagerService.js',

              'js/modules/lang/src/directives/directives.js',

              'js/modules/gedcom_parser/src/_init/_init.js',

              'js/modules/gedcom_parser/src/services/gedcomParserService.js',

              'js/modules/cache/src/_init/_init.js',

              'js/modules/cache/src/services/cacheService.js',

              'js/modules/auth/src/_init/_init.js',

              'js/modules/auth/src/services/userService.js',

              'js/modules/auth/src/services/authService.js',

              'js/modules/auth/src/directives/directives.js',

              'js/modules/auth/src/controllers/loginCtrl.js',

              'js/modules/auth/src/controllers/authPrivateController.js',

              'js/modules/auth/src/controllers/authCtrl.js',

              'js/modules/api_client/src/_init/_init.js',

              'js/modules/api_client/src/services/apiClientService.js',

              'js/lib/structures.js',

              'js/lib/notify.js',

              'js/lib/d3.min.js',

              '.tmp/config.js',

              '.tmp/bhsclient-templates.js',

              'js/modules/api_client/test/apiClientServiceSpec.js',

              'js/modules/auth/test/controllersSpec.js',

              'js/modules/auth/test/directivesSpec.js',

              'js/modules/auth/test/servicesSpec.js',

              'js/modules/lang/test/directivesSpec.js',

              'js/modules/lang/test/langManagerServiceSpec.js',

              'js/modules/cache/test/services/cacheServiceSpec.js',

              'js/modules/main/test/controllers/ftreesControllerSpec.js',

              'js/modules/main/test/controllers/mjsControllerSpec.js',

              'js/modules/main/test/controllers/startControllerSpec.js',

              'js/modules/main/test/directives/animateOnDirevtiveSpec.js',

              'js/modules/main/test/services/ftreesServiceSpec.js',

              'js/modules/main/test/services/itemServiceSpec.js',

              'js/modules/main/test/services/mjsServiceSpec.js',

              'js/modules/main/test/services/notificationServiceSpec.js',

              'js/modules/main/test/services/recentlyViewedServiceSpec.js',

              'js/modules/main/test/services/wizardServiceSpec.js'

            ],


    // list of files to exclude
    exclude: [
        'js/modules/**/test/end2end/*.js',
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 10000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
