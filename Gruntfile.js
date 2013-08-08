/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= _.isObject(pkg.author) ?  pkg.author.name : pkg.author %>;' +
        ' Licensed <%= _.isArray(pkg.licenses) ? _.pluck(pkg.licenses, "type").join(", ") : pkg.license %>' + 
        '<%= "\\n" %>' + 
        ' */' +
        '<%= "\\n\\n" %>'
    },
    jshint: {
      options: {
        curly: true,
        //es3: true,
        forin: true,
        latedef: true,
        //maxlen: 80,
        indent: 2
      },
      files: ['Gruntfile.js', 'js/*.js']
    },
    clean: {
      folder: 'dist/'
    },
    concat: {
      options: {
        separator: '\r\n\r\n',
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'dist/<%= pkg.name %>.src.js'
      },
      dist_css: {
        src: ['css/*.css'], 
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: 'jshint'
    }
  });
  
  // Load plugin tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  

  // Default build task
  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify']);
};
