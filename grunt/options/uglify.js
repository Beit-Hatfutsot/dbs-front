module.exports = {
    generated: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            compress: {"warnings":false},
            mangle: true
        },
    }
}
//
//     js: {
//         src: [
//             '<%= public_dir %>' + 'js/<%= pkg.name %>.js',
//             '<%= public_dir %>' + 'js/lib/notify.js'
//         ],
//         dest: '',
//         expand: true,
//         ext: '.min.js'
//     },
// }
// module.exports = {
// dist: {
//     options:{
//         compress:true,
//         mangle:true
//     },
//     files: {
//         //'<%= yeoman.dist %>/scripts/vendor.js': [
//         //    '<%= yeoman.dist %>/scripts/vendor.js'
//         //],
//         '<%= dist_dir %>scripts/scripts.js': [
//
//             '<%= dist_dir %>scripts/scripts.js',
//
//         ],
//         '<%= dist_dir %>scripts/vendor.js': [
//
//             '<%= dist_dir %>scripts/vendor.js',
//
//         ]
//     }
// }
// }