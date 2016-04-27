module.exports = {
    options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },

    js: {
        src: [
            '<%= public_dir %>' + 'js/<%= pkg.name %>.js',
            '<%= public_dir %>' + 'js/lib/notify.js'
        ],
        dest: '',
        expand: true,
        ext: '.min.js'
    },
}
