'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    es = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    bower = require('./bower'),
    isWatching = false;

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

/**
 * Base url in config.js
 */
var _baseUrlEnvMapping = {
	local: "localhost:5000",
	test: "devapi.dbs.bh.org.il",
	live: "api.dbs.bh.org.il"
};

gulp.task('base-url', function() {
  var apiServer = process.env.API_SERVER || 'local';

  return gulp.src('./js/modules/config/config.js')
    .pipe(g.replace('BaseUrlPlaceHolder', _baseUrlEnvMapping[apiServer]))
    .pipe(gulp.dest('./.tmp/'));
});

/**
 * CSS
 */
gulp.task('clean-css', function (done) {
  rimraf('./.tmp/css', done);
});

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './scss/**/*.scss',
    '!./scss/**/_*.scss'
  ])
    .pipe(g.sourcemaps.init())
    .pipe(g.sass().on('error', g.sass.logError))
    .pipe(g.sourcemaps.write('./'))
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(g.cached('built-css'))
    .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', bower.name));
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', bower.name, {ngAnnotate: true}));
});

/**
 * Templates
 */
gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({min: true}).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
  var bowerStream = gulp.src(bowerFiles());
  return es.merge(
    bowerStream.pipe(g.filter('**/*.css')).pipe(dist('css', 'vendors')),
    bowerStream.pipe(g.filter('**/*.js')).pipe(dist('js', 'vendors'))
  );
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates', 'base-url'], index);

function index () {
  var opt = {read: false};
  return gulp.src('./index.html')
    .pipe(g.inject(gulp.src(bowerFiles(), opt), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {ignorePath: ['.tmp']}))
    .pipe(gulp.dest('.'))
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload());
}



/**
 * Static assets
 */

gulp.task('fonts', function () {
  return gulp.src('./fonts/**')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('images', function () {
  return gulp.src('./images/**')
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('assets', ['fonts', 'images']);


/**
 * Dist
 */
gulp.task('dist', ['base-url', 'vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./index.html')
    .pipe(g.inject(gulp.src('./dist/{js,css}/vendors.min.{js,css}'), {ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->', addRootSlash:false}))
    .pipe(g.inject(gulp.src('./dist/{js,css}/' + bower.name + '.min.{js,css}'), {ignorePath: 'dist', addRootSlash:false}))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'));
});


/**
 * Static file server
 */
gulp.task('connect', function() {

  g.connect.server({
    port: 3000,
    root: ['./.tmp', './', './bower_components'],
    middleware: function() {
      return [
        // place required middleware here
      ];
    }
  });
});

gulp.task('serve:dist', function() {

  g.connect.server({
    port: 3000,
    root: ['./dist'],
    middleware: function() {
      return [
        // place required middleware here
      ];
    }
  });
});

/**
 * Watch
 */
gulp.task('serve', ['watch']);
gulp.task('watch', ['connect', 'default'], function () {
  isWatching = true;
  // Initiate livereload server:
  g.livereload.listen();
  gulp.watch('./js/**/*.js').on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
  gulp.watch('./index.html', ['index']);
  gulp.watch(['./templates/**/*.html'], ['templates']);
  gulp.watch(['./scss/**/*.scss']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
      gulp.start('styles');
    }
  });
});

/**
 * Default task
 */
gulp.task('default', ['build-all']);


/**
 * Test
 */
gulp.task('test', ['templates', 'base-url'], function () {
  return testFiles()
    .pipe(g.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates', 'base-url'], function () {
  return gulp.src('./karma.conf.js')
    .pipe(g.inject(testFiles(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function (filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));
});

/**
 * Test files
 */
function testFiles() {
  return new queue({objectMode: true})
    .queue(gulp.src(bowerFiles()).pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles())
    .queue(gulp.src(['./js/**/*Spec.js', './.tmp/js/**/*Spec.js']))
    .done();
}

/**
 * All CSS files as a stream
 */
function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles () {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './.tmp/config.js',
    './js/**/*.js',
    '!./js/**/*Spec.js',
    '!./js/modules/config/**',
    '!./js/test/**',
    '!./js/modules/main/test/**'
  ];
  return gulp.src(files)
    .pipe(g.naturalSort())
    .pipe(g.angularFilesort());
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles (opt) {
  return gulp.src(['./templates/**/*.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates () {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name + '-templates',
      /*prefix: '/' + bower.name + '/',*/
      prefix: 'templates/'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)();
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    // .pipe(gulp.dest, './dist/' + ext + '/')
    // .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    // .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    // .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist/' + ext)
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist/' + ext + '/')();
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload () {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)();
}
