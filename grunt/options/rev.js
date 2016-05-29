// Renames files for browser caching purposes
module.exports = {
    dist: {
        files: {
            src: [
                '<%= dist_dir %>/scripts/{,*/}*.js',

                '<%= dist_dir %>/styles/{,*/}*.css'

            ]
        }
    }
};