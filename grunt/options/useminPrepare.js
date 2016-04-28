// Reads HTML for usemin blocks to enable smart builds that automatically
// concat, minify and revision files. Creates configurations in memory so
// additional tasks can operate on them

module.exports = {

    options: {
        dest: '<%= dist_dir %>',
        flow:{
            steps:{
                'js':['concat','uglify'],
                'css':['concat','cssmin']
            },
            post:{}
        }
    },

    test:{
        src:['<%= public_dir %>/index.html']
    },


    html: ['<%= public_dir %>/index.html',
        '<%= public_dir %>/templates/{,*/}*.html',


    ]

};