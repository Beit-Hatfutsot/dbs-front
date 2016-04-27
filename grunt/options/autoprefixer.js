//TODO a little old, should be changed to post css
module.exports = {
    options: {
        browsers: ['last 2 version', '> 2%']
    },
    dist: {
        files: [
            {
                expand: true,
                cwd: '.tmp/styles/',
                src: '{,*/}*.css',
                dest: '.tmp/styles/'
            }
        ]
    }
};