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

        //dependencies
        'bower_components/angular/angular.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/ng-flow/dist/ng-flow-standalone.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/marked/marked.min.js',
		'bower_components/angular-marked/angular-marked.min.js',
		'bower_components/ngstorage/ngStorage.min.js',

        // app modules & tests
        {pattern: 'js/modules/**/**/*.js/', included: true},
        {pattern: 'js/modules/**/test/*.js', included: true},
        {pattern: 'js/modules/**/test/**/*.js', included: true},

        'templates/**/*.html',
        'templates/main/**/*.html'
    ],


    // list of files to exclude
    exclude: [
        
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    preprocessors: {
        'templates/**/*.html': ['ng-html2js'],
        'templates/main/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
        // If your build process changes the path to your templates,
        // use stripPrefix and prependPrefix to adjust it.
        //stripPrefix: "source/path/to/templates/.*/",
        //prependPrefix: "web/path/to/templates/",

        // the name of the Angular module to create
        moduleName: 'templates'
    },

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
    singleRun: false
  });
};
