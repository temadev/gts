'use strict';


module.exports = function less(grunt) {
  // Load task
  grunt.loadNpmTasks('grunt-contrib-less');

  // Options
  return {
    build: {
      options: {
        cleancss: true,
        compress: true,
        syncImport: true
      },
      files: {
        '.build/css/app.css': 'public/css/app.less',
        '.build/css/bootstrap.css': 'public/css/bootstrap.less',
        '.build/css/fa.css': 'public/css/fa.less'
      }
    }
  };
};
