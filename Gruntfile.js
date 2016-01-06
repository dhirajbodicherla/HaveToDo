var port = 9999,
  Url = 'http://localhost:' + port;
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      browserify: {
        files: ['scripts/*.jsx', 'scripts/*.js', 'tpl/*.html'],
        tasks: ['browserify:dev', 'concat:dev', 'copy:dev', 'bell'],
        options: {
          livereload: true
        }
      }
    },

    php: {
      dist: {
        options: {
            port: port
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
      },
      prod: {
        files: {
          '.tmp/app.build.js': [
            'scripts/*.jsx', 
            'scripts/util.js', 
            'scripts/Constants.js']
        },
        options: {
          debug: false,
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
        dest: 'app.js',
      },
      prod: {
        src: ['bower_components/jquery/dist/jquery.js',
             'bower_components/Materialize/dist/js/materialize.js',
             '.tmp/app.build.js'],
        dest: '.tmp/app.js',
      }
    },

    copy: {
      dev: {
        files: [{ src: 'tpl/dev.index.html', dest: 'index.html' },
                { src: 'tpl/options.html', dest: 'options.html' },
                { src: 'tpl/options.html', dest: 'extension/options.html' },
                { src: 'stylesheets/styles.css', dest: 'extension/styles.css' },
                { src: 'stylesheets/options.css', dest: 'extension/options.css'},
                { src: 'bower_components/Materialize/dist/css/materialize.min.css', dest: 'extension/materialize.min.css'},
                { src: 'bower_components/Materialize/dist/js/materialize.min.js', dest: 'extension/materialize.min.js'},
                { src: 'bower_components/jquery/dist/jquery.min.js', dest: 'extension/jquery.min.js'},
                { src: 'options.js', dest: 'extension/options.js'}]
      },
      prod: {
        files: [{ src: 'app.min.js', dest: 'extension/app.min.js' },
                { src: 'tpl/prod.index.html', dest: 'extension/index.html' },
                { src: 'stylesheets/styles.css', dest: 'extension/styles.css' },
                { src: 'stylesheets/options.css', dest: 'extension/options.css' },
                { src: 'tpl/options.html', dest: 'extension/options.html' },
                { src: 'bower_components/Materialize/dist/css/materialize.min.css', dest: 'extension/materialize.min.css'},
                { src: 'bower_components/Materialize/dist/js/materialize.min.js', dest: 'extension/materialize.min.js'},
                { src: 'bower_components/jquery/dist/jquery.min.js', dest: 'extension/jquery.min.js'},
                { src: 'options.js', dest: 'extension/options.js'}]
      }
    },

    clean: {
      dev: [".tmp", "*.zip"]
    },

    uglify: {
      prod: {
        src: '.tmp/app.js',
        dest: 'app.min.js'
      }
    },

    compress: {
      main: {
        options: {
          archive: 'havetodo.zip'
        },
        files: [
          {src: ['extension/**'], dest: '/'}
        ]
      }
    },

    open : {
      dev : {
        path: Url,
        app: 'Google Chrome'
      }
    },

    bumpup: {
      files: ['package.json', 'bower.json', 'extension/manifest.json']
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bell');

  grunt.registerTask('start', ['php', 'open', 'watch']);
  grunt.registerTask('default', ['browserify:dev', 'concat:dev', 'copy:dev']);
  grunt.registerTask('ext', ['browserify:prod', 'concat:prod', 'uglify:prod', 'copy:prod', 'clean:dev']);
  grunt.registerTask('release', function (type) {
      grunt.task.run('browserify:prod');
      grunt.task.run('concat:prod');
      grunt.task.run('uglify:prod');
      grunt.task.run('copy:prod');
      grunt.task.run('clean:dev');
      if(type)
        grunt.task.run('bumpup:' + type);

      grunt.task.run('compress');
  });
};