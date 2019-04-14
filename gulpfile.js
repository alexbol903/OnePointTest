'use strict';

const { src, task, dest, parallel, series, watch } = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	image = require('gulp-image'),
	// File paths APP
	rootWatch = './src/*.html',
	scssWatch = './src/scss/**/*.scss',
	scssMain = './src/scss/style.scss',
	jsWatch = './src/js/**/*.js',
	imgWatch = './src/img/**/*',
	// File paths DIST
  rootPath = './dist/',
  cssPath = './dist/css/',
  jsPath = './dist/js/',
  imgPath = './dist/img/';

// Root
function rootFile(done) {
	src(rootWatch)
		.pipe(
			plumber(function(err) {
				console.log('Styles Task Error');
				console.log(err);
				this.emit('end');
			})
		)
		.pipe(dest(rootPath))
		.pipe(browserSync.stream());
	done();
}

// Styles SCSS
function scss(done) {
	src(scssMain)
		.pipe(
			plumber(function(err) {
				console.log('Styles Task Error');
				console.log(err);
				this.emit('end');
			})
		)
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				outputStyle: 'compressed'
			})
		)
		.pipe(
			autoprefixer({
				browsers: 'last 2 version'
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(cssPath))
		.pipe(browserSync.stream());
	done();
}

// JS
function js(done) {
	src(jsWatch)
		.pipe(
			plumber(function(err) {
				console.log('Styles Task Error');
				console.log(err);
				this.emit('end');
			})
		)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env']
			})
		)
		.pipe(uglify())
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write())
		.pipe(dest(jsPath))
		.pipe(browserSync.stream());
	done();
}

// Images
function img(done) {
	src(imgWatch)
		.pipe(
			image({
				jpegRecompress: true,
				optipng: true
			})
		)
		.pipe(dest(imgPath))
		.pipe(browserSync.stream());
	done();
}

// Browser Sync
function browser_sync(done) {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
	done();
}

function reload(done) {
	browserSync.reload();
	done();
}

function watch_files() {
	watch(rootWatch, series(rootFile, reload));
  watch(scssWatch, series(scss, reload));
	watch(jsWatch, series(js, reload));
	watch(imgWatch, series(img, reload));
	console.log('Starting Watch Task');
}

task('rootFile', rootFile);
task('scss', scss);
task('js', js);
task('img', img);
task('default', parallel(rootFile, scss, js, img));
task('watch', parallel(watch_files, browser_sync));
