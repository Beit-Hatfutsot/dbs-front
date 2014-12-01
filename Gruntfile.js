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
                    'js/modules/cache/src/**/*.js'
                    
                ],
                // the location of the resulting JS file
                dest: 'js/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            
            js: {
                src: ['js/<%= pkg.name %>.js'],
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
                    'css/bhsclient.css' : 'scss/bhsclient.scss'
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

        clean: ["public/"],

        copy: {
            main: {
                files: [
                    {expand: true, src: ['bower_components/**'], dest: 'public/'},
                    {expand: true, src: ['css/*'], dest: 'public/', filter: 'isFile'},
                    {expand: true, src: ['js/*'], dest: 'public/', filter: 'isFile'},
                    {expand: true, src: ['templates/**'], dest: 'public/'},
                    {expand: true, src: ['images/**'], dest: 'public/'},
                    {expand: true, src: ['index.html'], dest: 'public/', filter: 'isFile'},
                ],
            },
        },

        watch: {
            main: {
                files: ['js/modules/**/src/**/*.js', 'scss/**', 'templates/**', 'index.html'],
                tasks: ['deploy']
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['concat', 'uglify', 'sass']);
    grunt.registerTask('deploy', ['build', 'clean', 'copy']);
};
