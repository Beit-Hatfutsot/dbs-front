module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                    'js/modules/main/src/**/*.js',
                    'js/modules/lang/src/**/*.js',
                    'js/modules/api_client/src/**/*.js',
                    'js/modules/auth/src/**/*.js',
                    'js/modules/header/src/**/*.js',
                    'js/modules/wizard/src/**/*.js',
                    'js/modules/search/src/**/*.js',
                    'js/modules/wizard-result/src/**/*.js',
                    'js/modules/cache/src/**/*.js',
                    'js/modules/item/src/**/*.js',
                ],
                // the location of the resulting JS file
                dest: 'js-build/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            
            js: {
                src: ['js-build/<%= pkg.name %>.js'],
                dest: '',
                expand: true, 
                ext: '.min.js',
            },
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                },

                files: {
                    'css/bhpclient.css' : 'scss/bhpclient.scss'
                }
                /*
                files: [{
                    src: ['scss/*.scss'],
                    dest: './css',
                    expand: true,
                    flatten: false, 
                    ext: '.css',
                }]
                */  
            }
        },

        watch: {
            build: {
                files: ['js/modules/**/src/**/*.js', 'scss/*.scss', 'scss/**/*.scss'],
                tasks: ['concat', 'sass', 'uglify']
            }
        },

        karma: {
            unit: {
                configFile: 'js/test/karma.conf.js'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['concat', 'uglify', 'sass']);

};
