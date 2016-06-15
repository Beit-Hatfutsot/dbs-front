module.exports = {
    config: {
        src: ['<%= public_dir %>' + 'js/<%= pkg.name %>.js'],
        overwrite: true,
        replacements: [{
            from: 'BaseUrlPlaceHolder',                   // string replacement
            to: '<%= config.baseUrl %>'
        }
        ]
    }
};