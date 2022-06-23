var gulp = require("gulp"); var cleanCSS = require("gulp-clean-css");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var prefix = require("gulp-autoprefixer");
var cache = require("gulp-cached");

// Minifies JS
gulp.task("js", function() {
	return gulp.src(["assets/js/lib/jquery-3.4.1.js",
		"assets/js/lib/semantic.js",
		"assets/js/lib/angular.js",
		"assets/js/lib/angular-animate.js",
		"assets/js/lib/moment.js",
		"assets/js/lib/calendar.js",
		"assets/js/lib/daterangepicker.js",
		"assets/js/lib/angular-toastr.tpls.js",
		"assets/js/lib/dirPagination.js",
		"assets/js/lib/angular-ui-router.js",
		"assets/js/lib/lodash.js",
		"assets/js/lib/FileSaver.js",
		"assets/js/lib/parsley.js",
		"assets/js/lib/selectize.js",
		"assets/js/lib/angular-selectize.js",
		"assets/js/min/xlsx.core.min.js",
		// "assets/js/min/xlsx.full.min.js",
	]).pipe(concat("site.js"))
		.pipe(uglify())
		.pipe(gulp.dest("assets/prod/js"));
});

// Minifies View JS
gulp.task("js-views", function() {
	return gulp.src("assets/js/views/*.js")
		.pipe(cache("linting"))
		.pipe(uglify())
		.pipe(gulp.dest("assets/prod/js/views"));
});


// CSS Version
gulp.task("styles-css", function() {
	return gulp.src(["assets/styles/semantic.css",
		"assets/styles/lib/angular-toastr.css",
		"assets/styles/lib/calendar.css",
		"assets/styles/lib/daterangepicker.css",
		"assets/styles/lib/parsley.css",
		"assets/styles/lib/selectize.default.css",
		"assets/styles/app.css"])
		.pipe(concat("site.css"))
		.pipe(cleanCSS())
		.pipe(prefix("last 2 versions"))
		.pipe(gulp.dest("assets/prod/styles"));
});


gulp.task("default", function() {
	gulp.watch("assets/js/views/*.js", gulp.series("js-views"));
});

gulp.task("watch", function() {
	gulp.watch("assets/js/views/*.js", gulp.series("js-views"));
	gulp.watch("assets/styles/app.css", gulp.series("styles-css"));
});
