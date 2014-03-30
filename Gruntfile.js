
module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      bin: {
        src: 'bin/*.js'
      },
      lib: {
        src: 'lib/**/*.js'
      },
      tests: [
        'tests/extra/*.js', 'tests/src/*.js'
      ],
      gruntfile: {
        src: 'Gruntfile.js'
      },
      examples: {
        src: ['examples/tests', 'examples/custom-commands']
      }
    },
    jsonlint: {
      src: ['tests/*.json']
    }
  });

  // load custom external tasks (future)
  grunt.loadTasks('tasks/');

  //
  grunt.loadNpmTasks('grunt-jsonlint');

  // load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jsonlint']);
};
