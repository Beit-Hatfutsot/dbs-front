var concatenatedProjectJsFile = '<%= public_dir %>' + 'js/<%= pkg.name %>.js';
module.exports = {
    options: {
        add:true,

    },
    public: {
        files:[{
            expand:true,
            src:[concatenatedProjectJsFile],
            // dest:'<%= pkg.name %>.js'
            

        }]
    },
}
