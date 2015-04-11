'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            app: {
                src: ['./components/app.jsx'],
                dest: './public/app.bundle.js',
                options: {
                    transform: ['reactify'],
                    extensions: ['.jsx']
                }
            }
        },
        watch: {
            browserify: {
                files: ['components/*.jsx'],
                tasks: ['browserify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
};