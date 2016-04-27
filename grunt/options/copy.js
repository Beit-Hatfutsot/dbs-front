module.exports = {
    public: {
        files: [
            {expand: true, src: ['bower_components/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['js/lib/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['templates/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['templates/**/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['images/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['fonts/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['index.html'], dest: '<%= public_dir %>', filter: 'isFile'},
            {expand: true, src: ['under_construction/images/**'], dest: '<%= public_dir %>'},
            {expand: true, src: ['under_construction/*.html'], dest: '<%= public_dir %>', filter: 'isFile'}
        ]
    },

    dist: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '<%= public_dir %>',
                dest: '<%= dist_dir %>',
                src: [
                    '*.{ico,png,txt}',

                    '*.html',

                    'templates/**/*.html',
                    'images/**',
                    'fonts/**',
                    'under_construction/images/**',
                    'under_construction/*.html'
                ]

            }
        ]
    }

};
