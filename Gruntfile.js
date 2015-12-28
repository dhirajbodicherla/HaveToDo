module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      browserify: {
        files: ['scripts/*.jsx', 'scripts/util.js', 'scripts/Constants.js'],
        tasks: ['browserify:dev', 'concat', 'uglify'],
        options: {
          livereload: true
        }
      }
    },

    browserify: {
      dev: {
        files: {
          '.tmp/app.build.js': [
            'scripts/*.jsx', 
            'scripts/util.js', 
            'scripts/Constants.js']
        },
        options: {
          debug: true,
          transform: [["babelify", {presets: ["es2015", "react"]}]]
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dev: {
        src: ['bower_components/jquery/dist/jquery.js',
             'bower_components/Materialize/dist/js/materialize.js',
             '.tmp/app.build.js'],
        dest: '.tmp/app.js',
      }
    },

    copy: {
      devext: {
        files: [{
          src: 'app.min.js',
          dest: 'extension/app.min.js'
        },{
          src: 'index.html',
          dest: 'extension/index.html'
        },{
          src: 'styles.css',
          dest: 'extension/styles.css'
        }]
      }
    },

    clean: {
      dev: [".tmp"]
    },

    uglify: {
      build: {
        src: '.tmp/app.js',
        dest: 'app.min.js'
      }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['browserify:dev', 'concat', 'uglify', 'clean:dev']);
  grunt.registerTask('ext', ['browserify:dev', 'concat', 'uglify', 'copy:devext', 'clean:dev']);

};