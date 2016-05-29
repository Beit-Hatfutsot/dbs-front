var path = require('path');

module.exports = function (grunt) {

    var public_dir = 'public/';
    var dist_dir = 'dist/';
    var pkg = grunt.file.readJSON('package.json');

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var config = require('load-grunt-config')(grunt, {
        init: true,
        configPath: path.join(process.cwd(), 'grunt', 'options'),
        data: {}
    });
    grunt.config.set('public_dir', public_dir);
    grunt.config.set('dist_dir', dist_dir);
    grunt.config.set('pkg', pkg);

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build-public', [
        'clean:public',
        'copy:public',
        'concat:public',
        'replace:config',
        'sass:public'
    ]);
    var _baseUrlEnvMapping = {
        dev: "devapi.dbs.bh.org.il‎",
        local: "localhost:5000",
        live: "api.dbs.bh.org.il"
    };
    grunt.registerTask('build', function (env) {

        var mappedBaseUrl = _baseUrlEnvMapping[env];
        if (mappedBaseUrl) {

            grunt.config.set('config', {baseUrl: mappedBaseUrl});

        }
        else {
            grunt.config.set('config', {baseUrl: "localhost:5000"});

        }
        var buildTasks = [
            'clean:public',
            'clean:dist',
            'sass:public',
            'copy:public',
            'copy:dist',
            'concat:public',
            'replace:config',
            'ngAnnotate',
            'useminPrepare',
            'concat:generated',
            'cssmin',
            'uglify',
            'postcss',
            'rev',
            'usemin'];
        grunt.task.run(buildTasks)
    })
};

