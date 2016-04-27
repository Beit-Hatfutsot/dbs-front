module.exports = {
    options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
    },
    dist: {
        // the files to concatenate
        src: [
            'js/modules/main/src/**/*.js',
            'js/modules/config/*.js',
            'js/modules/lang/src/**/*.js',
            'js/modules/api_client/src/**/*.js',
            'js/modules/auth/src/**/*.js',
            'js/modules/cache/src/**/*.js',
            'js/modules/plumb/src/**/*.js',
            'js/modules/rc_submit/src/**/*.js',
            'js/modules/gedcom_parser/src/**/*.js'
        ],
        // the location of the resulting JS file
        dest: '<%= public_dir %>' + 'js/<%= pkg.name %>.js'
    }
};
