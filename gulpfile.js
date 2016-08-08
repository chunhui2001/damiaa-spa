var gulp      = require('gulp');
var gutil     = require('gulp-util');
var uglify    = require('gulp-uglify');
var bower     = require('bower');
var concat    = require('gulp-concat');
var sass      = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename    = require('gulp-rename');
var replace   = require('gulp-replace');
var sh        = require('shelljs');
var moment    = require('moment');
var uuid      = require('uuid');
var _         = require('underscore');
var crypto    = require('crypto');
var nimble    = require('nimble');



var GLOBAL_CONFIG   = require('./config/config-global');



var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {

  nimble.series([
      function(cback) {
          nimble.parallel([
              function (cback) {
                gulp.src('./scss/ionic.app.scss')
                      .pipe(sass())
                      .on('error', sass.logError)
                      .pipe(gulp.dest('./www/css/'))
                      .pipe(minifyCss({
                        keepSpecialComments: 0
                      }))
                      .pipe(rename({ extname: '.min.css' }))
                      .pipe(gulp.dest('./www/css/'))
                      .on('end', cback);
              },
              function(cback) {     
                gulp.src(
                      [
                        './www/lib/ionic/css/ionic.css', 
                        './www/css/style.css'
                      ])
                      .pipe(concat('ionic.min.css'))
                      .pipe(minifyCss({
                        keepSpecialComments: 0
                      }))
                      .pipe(gulp.dest('./www/lib/ionic/css/'))
                      .on('end', cback);
              },
              function(cback) {     
                gulp.src(
                      [
                        // './www/lib/ionic/js/ionic.bundle.js', 
                        './www/lib/jquery/jquery-1.11.3.min.js', 
                        './www/lib/angular/ngStorage-0.3.6.min.js', 
                        './www/lib/angular/angular-cookies.min.js', 
                        './www/lib/angular/angular-resource.min.js', 
                        './www/lib/angular/angular-messages.min.js', 
                        './www/lib/angular/angular-strap.min.js',
                      ])
                      .pipe(concat('angular-all.min.js'))
                      .pipe(uglify())
                      .pipe(gulp.dest('./www/lib/angular/'))
                      .on('end', cback);
              }
              ,
              function(cback) {     
                gulp.src(
                      [
                        // './www/js/util.js', 
                        // './www/js/app.js', 
                        // './www/js/controllers.js', 
                        // './www/js/filters.js', 
                        // './www/js/services/auth.js', 
                        // './www/js/services/BrowserService.js',
                        // './www/js/services/UserService.js',
                        // './www/js/services/WChatService.js',
                        // './www/js/services/AddrService.js',
                        // './www/js/services/RegionService.js',
                        // './www/js/services/OrderService.js',
                        // './www/js/services/GoodsService.js',
                        // './www/js/services/PartnerService.js',
                        // './www/js/services/QrcodeService.js',
                        // './www/js/services.js',
                      ])
                      .pipe(concat('damiaaapp-all.min.js'))
                      .pipe(uglify())
                      .pipe(gulp.dest('./www/js/'))
                      .on('end', cback);
              }
          ], cback);
      },
      function(cback) {              
          return done;              
      },
  ]);  
  
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('replace', function () {

  var currentAppId      = 'wxbfbeee15bbe621e6';
  var currentAppKey     = 'bce17ac69d41807ccfcdeb639a39e008';

  var currentNonceStr   = uuid.v4().replace(/\D/g, '').substring(1,11);
  var currentTimeStamp  = moment().unix();
  var isDebug           = false;
  var currentSignature  = null;
  var jsapi_ticket      = 'kgt8ON7yVITDhtdwci0qeVZjKbFfUtFJsvbWSS2X0obJ7yGHd6GGL32-b-rKGlxLb-UVuXEQXiAg6OfmEGBHFQ';

  var paramsObj   = {
      debug: isDebug,    
      appId: currentAppId,            // 必填，公众号的唯一标识
      timestamp: currentTimeStamp,    // 必填，生成签名的时间戳
      nonceStr: currentNonceStr,      // 必填，生成签名的随机串
      signature: currentSignature,    // 必填，签名，见附录1
      jsApiList: []                   // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  };

  var paramsArr   = [];
  var paramsStr   = null;

 // paramsArr.push('debug=' + isDebug);
 // paramsArr.push('appid=' + currentAppId);
  paramsArr.push('timestamp=' + currentTimeStamp);
  paramsArr.push('noncestr=' + currentNonceStr);
  paramsArr.push('jsapi_ticket=' + jsapi_ticket);
  paramsArr.push('url=' + 'http://www.damiaa.com/');


  paramsStr = _.sortBy(paramsArr, function(a) { return a; }).join('&');
  
  currentSignature = crypto.createHash('sha1').update(new Buffer(paramsStr)).digest("hex");

  gulp.src('./www/build/index.html')
      .pipe(replace(/<%=#STATIC_SERVER_HOSTNAME%>/g, GLOBAL_CONFIG.STATIC_SERVER_HOSTNAME))
      .pipe(replace(/<%=#currentNonceStr%>/g, currentNonceStr))
      .pipe(replace(/<%=#currentTimeStamp%>/g, currentTimeStamp))
      .pipe(replace(/<%=#isDebug%>/g, isDebug))
      .pipe(replace(/<%=#currentSignature%>/g, currentSignature))
      .pipe(replace(/<%=#currentAppId%>/g, currentAppId))
      .pipe(replace(/<%=#jsapi_ticket%>/g, jsapi_ticket))
     // .pipe(replace(/<!--[\d\D]{1,}?-->/g, ''))
     // .pipe(replace(/\/\/\s{1,}[\d\D]{1,}?$/g, ''))
      .pipe(gulp.dest('./www/'));
});


gulp.task('compress', function () {

  console.log(1);
});


gulp.task('default', ['sass', 'replace']);

