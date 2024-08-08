'use strict';
	
const gulp = require('gulp'),
	newer = require('gulp-newer'),
	pug = require('gulp-pug'),
	pugbem = require('gulp-pugbem'),
	sass = require('gulp-sass')(require('sass')),
	cssmin = require('gulp-minify-css'),
	mmq = require('gulp-merge-media-queries'),
	svgSprite = require('gulp-svg-sprite'),
	replace = require('gulp-replace'),
	webp = require('gulp-webp'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync');

const path = {
	src: {
		// html: 'src/*.html',
		pug: 'src/*.pug',
		js: [
				'src/js/script.js',
			],
		style: 'src/scss/style.scss',
		img: 'src/img/**/*.*',
		icons: 'src/img/icons/*.svg',
		fonts: 'src/fonts/**/*.*'
	},  
	build: {
		// html: 'build/',
		pug: 'build/',
		js: 'build/js/',
		style: 'build/css/',
		img: 'build/img/',
		icons: 'build/img/icons/',
		fonts: 'build/fonts/'
	},
	watch: {
		// html: 'src/**/*.html',
		pug: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		icons: 'src/img/icons/*.svg',
		fonts: 'src/fonts/**/*.*'
	}
};

const reload = browserSync.reload;
const config = {
	server: {
		baseDir: './build'
	},
	port: 3000,
	open: false,
};

const minSuffix = '.min';
const sassOutputStyle = 'expanded';
const svgConfig = {
	shape: {
		dimension: {
			maxWidth: 500,
			maxHeight: 500
		},
		spacing: {
			padding: 0
		},
		transform: [{
			'preset-default': {
				'plugins': [
					{ removeViewBox: false },
					{ removeUnusedNS: false },
					{ removeUselessStrokeAndFill: true },
					{ cleanupIDs: false },
					{ removeComments: true },
					{ removeEmptyAttrs: true },
					{ removeEmptyText: true },
					{ collapseGroups: true },
					{ removeAttrs: { attrs: '(fill|stroke|style)' } }
				]
			}
		}]
	},
	mode: {
		symbol: {
			dest : '.',
			sprite: 'sprite.svg'
		}
	}
};

// function htmlBuild(){
// 	console.log('htmlBuild');

// 	return gulp.src(path.src.html)
// 		.pipe(rigger())
// 		.pipe(gulp.dest(path.build.html))
// 		.pipe(reload({stream: true}));
// }

function styleBuild(){
	console.log('styleBuild');

	return gulp.src(path.src.style)
		.pipe(sass({
			outputStyle: sassOutputStyle
		}))
		.pipe(mmq())
		.pipe(gulp.dest(path.build.style))
		.pipe(cssmin())
		.pipe(rename({
			suffix: minSuffix
		}))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
};

function jsBuild(){
	console.log('jsBuild');

	return gulp.src(path.src.js)
		.pipe(newer(path.build.js))
		.pipe(concat('script.js'))
		.pipe(gulp.dest(path.build.js))
        .pipe(uglify())
		.pipe(rename({
			suffix: minSuffix
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
}

function imageBiuld(){
	console.log('imageBiuld');

	return gulp.src(path.src.img)
		.pipe(newer(path.build.img))
		// .pipe(imagemin({
		// 	progressive: true,
		// 	svgoPlugins: [{removeViewBox: false}],
		// 	use: [pngquant()],
		// 	interlaced: true
		// }))
		.pipe(gulp.dest(path.build.img))
		.pipe(webp())
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
}

function iconsBuild(){
	console.log('iconsBuild');

	return gulp.src(path.src.icons)
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite(svgConfig))
		.pipe(gulp.dest(path.build.icons));
}

function fontsBuild(){
	console.log('fontsBuild');

	return gulp.src(path.src.fonts)
		.pipe(newer(path.build.fonts))
		.pipe(gulp.dest(path.build.fonts))
}

function pugBuild(){
	return gulp.src(path.src.pug)
		.pipe(pug({
      		pretty: true,
			plugins: [pugbem]
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(reload({stream: true}));
}

gulp.task('build', gulp.series(
	// htmlBuild,
	pugBuild,
	styleBuild,
	jsBuild,
	imageBiuld,
	iconsBuild,
	fontsBuild
));

function gulpWatch(){
	console.log('watch');
	// gulp.watch(path.watch.html, htmlBuild);
	gulp.watch(path.watch.pug, pugBuild);
	gulp.watch(path.watch.style, styleBuild);
	gulp.watch(path.watch.js, jsBuild);
	gulp.watch(path.watch.img, imageBiuld);
	gulp.watch(path.watch.icons, iconsBuild);
	gulp.watch(path.watch.fonts, fontsBuild);
}

function gulpServer(){
	browserSync(config);
	console.log('webserver');
}

exports.default = gulp.series('build', gulp.parallel(gulpWatch, gulpServer));