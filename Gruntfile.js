module.exports = function (grunt) {
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
                sourceMap: false,
            },
            dist: {
                files: {
                    'public/js/GameEngine.js': 'src/js/game/GameEngine.js',
                    'public/js/ImageGenerator.js': 'src/js/game/ImageGenerator.js',
                    'public/js/Images.js': 'src/js/game/Images.js',
                    'public/js/InverseMatrix.js': 'src/js/game/InverseMatrix.js',
                    'public/js/Level.js': 'src/js/game/Level.js',
                    'public/js/View.js': 'src/js/game/View.js',
                    'public/js/Game.js': 'src/js/game/Game.js',
                    'public/js/main.js': 'src/js/main.js',
                    'public/js/utils/animations.js': 'src/js/utils/animations.js',
                    'public/js/utils/scrolllock.js': 'src/js/utils/scrolllock.js',

                    'public/js/vendor/bootstrap.min.js': 'src/js/vendor/bootstrap.min.js',
                    'public/js/vendor/jquery-3.3.1.slim.min.js': 'src/js/vendor/jquery-3.3.1.slim.min.js',
                    'public/js/vendor/jquery.min.js': 'src/js/vendor/jquery.min.js',
                    'public/js/vendor/popper.min.js': 'src/js/vendor/popper.min.js',
                },
            },
        },
        sass: {
            options: {
                sourceMap: false,
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
                    src: ['css/*.css', '!*.min.css'],
                    dest: 'public/',
                    ext: '.min.css',
                }, ],
            },
        },
        copy: {
            Game: {
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
            cssmin: {
                files: ['src/css/style.css'],
                tasks: ['cssmin'],
            },
            js: { //all LPs share the same footer.js!
                files: ['src/js/*.js', 'src/js/**/*.js'],
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
    grunt.registerTask('default', ['babel', 'sass', 'htmlmin', 'cssmin', 'copy', 'watch']);
    grunt.registerTask('build', ['babel', 'sass', 'htmlmin', 'cssmin', 'copy']);
};