module.exports = function(grunt) {
    /*
      Do grunt-related things in here
      npm install --save-dev load-grunt-tasks
      npm install grunt-contrib-watch --save-dev
      order to use grunt you need to use grunt, grunt watch or grunt build
    */
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: {
                    'public/js/game_engine.js': 'src/js/game_engine.js',
                    'public/js/image_generator.js': 'src/js/image_generator.js',
                    'public/js/images.js': 'src/js/images.js',
                    'public/js/inverse_matrix.js': 'src/js/inverse_matrix.js',
                    'public/js/level.js': 'src/js/level.js',
                    'public/js/main.js': 'src/js/main.js',
                },
            },
        },
        sass: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: {
                    'src/css/style.css': 'src/scss/main.scss',
                },
            },
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                },
                files: { // Dictionary of files
                    // 'destination': 'source'
                    'public/index.html': 'src/index.html',
                },
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['css/style.css', '!*.min.css'],
                    dest: 'public/',
                    ext: '.min.css',
                }, ],
            },
        },
        uglify: {
            target: {
                files: {
                    'public/js/game_engine.js': 'src/js/game_engine.js',
                    'public/js/image_generator.js': 'src/js/image_generator.js',
                    'public/js/images.js': 'src/js/images.js',
                    'public/js/inverse_matrix.js': 'src/js/inverse_matrix.js',
                    'public/js/level.js': 'src/js/level.js',
                    'public/js/main.js': 'src/js/main.js',
                },
            },
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: 'img/**',
                dest: 'public/',
            },
        },

        watch: {
            css: {
                files: ['src/scss/*.scss', 'src/scss/**/*.scss'],
                tasks: ['sass'],
            },
            js: { //all LPs share the same footer.js!
                files: ['src/js/*.js'],
                tasks: ['babel'],
            },
            html: {
                files: ['src/*.html'],
                tasks: ['htmlmin'],
            },
            copy: {
                files: ['src/img/**'],
                tasks: ['copy'],
            },
        },
    });
    grunt.registerTask('default', ['babel', 'sass', 'htmlmin', 'cssmin', 'uglify', 'copy', 'watch']);
    grunt.registerTask('build', ['babel', 'sass', 'htmlmin', 'cssmin', 'uglify', 'copy']);
};