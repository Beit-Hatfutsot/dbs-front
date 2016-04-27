// Performs rewrites based on rev and the useminPrepare configuration

module.exports = {
    html: [

        '<%= dist_dir %>/{,*/}*.html',
        '<%= dist_dir %>/templates/**/{,*/}*.html',
    ],
    css: ['<%= dist_dir %>/styles/{,*/}*.css'],
    options: {
        assetsDirs: ['<%= dist_dir %>', '<%= dist_dir %>/images/**/*.*', '<%= dist_dir %>/scripts', '<%= dist_dir%>/fonts/**/*.*'],
        patterns: {}
    }
};
