module.exports = {

    options: {
        map: true,
        processors: [
            require('autoprefixer')({
                browsers: ['last 2 versions', '> 2%']
            })
        ]
    },
    dist: {
        files: [
            {
                cwd: '<%= dist_dir %>styles',
                src:'{,*/}*.css',
                expand: true
            }
        ]
    }


};