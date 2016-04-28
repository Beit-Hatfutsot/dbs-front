var concatenatedProjectJsFile = '<%= public_dir %>' + 'js/<%= pkg.name %>.js';
module.exports = {
    options: {
        add:true,

    },
    dist: {
        files:[{

            concatenatedProjectJsFile:concatenatedProjectJsFile,
            

        }]
    },
}
