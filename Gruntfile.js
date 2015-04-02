module.exports = function(grunt) {

    var public_dir = 'public/';

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
                    'js/modules/cache/src/**/*.js',
                    'js/modules/plumb/src/**/*.js',
                    'js/modules/rc_submit/src/**/*.js',
                    'js/modules/gedcom_parser/src/**/*.js'  
                ],
                // the location of the resulting JS file
                dest: public_dir + 'js/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            
            js: {
                src: [public_dir + 'js/<%= pkg.name %>.js'],
                dest: '',
                expand: true, 
                ext: '.min.js'
            },
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                },
                /*
                files: {
                    'css/bhsclient.css' : 'scss/bhsclient.scss'
                }
                */
                files: [{
                    src: ['scss/bhsclient.scss'],
                    dest: public_dir + 'css/',
                    expand: true,
                    flatten: true, 
                    ext: '.css'
                }]
            }
        },

        clean: { 
            public: [public_dir],
            bower: ['bower_components/']
        },

        copy: {
            main: {
                files: [
                    {expand: true, src: ['bower_components/**'], dest: public_dir},
                    {expand: true, src: ['js/lib/**'], dest: public_dir},
                    {expand: true, src: ['templates/**'], dest: public_dir},
                    {expand: true, src: ['templates/**/**'], dest: public_dir},
                    {expand: true, src: ['images/**'], dest: public_dir},
                    {expand: true, src: ['index.html'], dest: public_dir, filter: 'isFile'},
                ]
            }
        },

        watch: {
            main: {
                files: ['js/modules/**/src/**/*.js', 'scss/**', 'templates/**', 'index.html'],
                tasks: ['build']
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
    grunt.registerTask('build', ['clean:public', 'sass', 'concat', 'uglify', 'copy']);
};
