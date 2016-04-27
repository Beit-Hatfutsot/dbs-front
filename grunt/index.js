var path = require('path');

module.exports = function(grunt) {

    var public_dir = 'public/';
    var pkg =  grunt.file.readJSON('package.json')

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var config = require('load-grunt-config')(grunt, {
        init:true,
        configPath: path.join(process.cwd(), 'grunt','options'),
        data:{}
    });
    grunt.config.set('public_dir',public_dir);
    grunt.config.set('pkg',pkg);
    
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean:public', 'sass', 'concat', 'uglify', 'copy']);
};

