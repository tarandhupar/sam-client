/**
 * @author: @AngularClass
 */

//override phantomjs with chrome argument
let browsersList =  ['PhantomJS'];
let clientArgs = [];
if(process.argv.indexOf("--chrome")!=-1){
  browsersList =  ['Chrome'];
}
process.argv.forEach(function(val,index,arr){
  if(val.indexOf("--focus=")!=-1){    
    clientArgs.push("--focusFlag")
  }
});

module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js');

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [ ],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      { pattern: './config/spec-bundle.js', watched: false },
      { pattern: './src/assets/**/*.jpg', watched: false, included: false, served: true },
      { pattern: './src/assets/**/*.png', watched: false, included: false, served: true },
    ],

    proxies: {
      '/src/assets': '/base/src/assets'
    },

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'lcov' },
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' }
      ]
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: [ 'mocha', 'sonarqubeUnit', 'coverage' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    browserNoActivityTimeout: 200000,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: browsersList,

    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputFile: 'coverage/ut_report.xml',
      useBrowserName: false
    },

    customLaunchers: {
      ChromeTravisCi: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    client: {
        captureConsole: true,
        args: clientArgs
    },
    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true
  };

  if (process.env.TRAVIS){
    configuration.browsers = ['ChromeTravisCi'];
  }

  config.set(configuration);
};
