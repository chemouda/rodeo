'use strict';

const eslint = require('eslint/lib/cli'),
  globby = require('globby'),
  gulp = require('gulp'),
  gUtil = require('gutil'),
  karma = require('karma'),
  KarmaServer = karma.Server,
  path = require('path'),
  jsPatterns = [
    'karma.conf.js',
    'gulpfile.js',
    'Gruntfile.js',
    'scripts/**/*.js',
    'src/**/*.js'
  ];

gulp.task('eslint', function () {
  return globby(jsPatterns).then(function (paths) {
    console.log('eslint', paths);
    // additional CLI options can be added here
    let code = eslint.execute(paths.join(' '));

    if (code) {
      // eslint output already written, wrap up with a short message
      throw new gUtil.PluginError('lint', new Error('ESLint error'));
    }
  });
});

gulp.task('karma', function () {
  return new Promise(function (resolve, reject) {
    const server = new KarmaServer({
      configFile: path.join(__dirname, 'karma.conf.js'),
      singleRun: true
    }, function (exitCode) {
      console.log('karma exit code', exitCode);
      reject();
    });

    server.start();
  });
});

gulp.task('lint', ['eslint']);
gulp.task('test', ['lint', 'karma']);
gulp.task('build', []);
gulp.task('run', []);
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['karma']);
});
gulp.task('default', ['test', 'build', 'run']);
