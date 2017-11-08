/**
 * @author: @AngularClass
 */
let focusPath = "../src/app"
process.argv.forEach(function(val,index,arr){
  if(val.indexOf("--focus=")!=-1){    
    focusPath = "../"+val.split("=")[1];
  }
});

const helpers = require('./helpers');
const path = require('path');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

/**
 * Webpack Constants
 */
const ENV = 'test';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
var conf = {

  /**
   * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
   *
   * Do not change, leave as is or it wont work.
   * See: https://github.com/webpack/karma-webpack#source-maps
   */
  devtool: 'inline-source-map',

  /**
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {

    /**
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['', '.ts', '.js'],

    /**
     * Make sure root is src
     */
    root: helpers.root('src'),
    // aliases
    alias: {
      "sam-ui-kit": helpers.root('src/sam-ui-elements/src/ui-kit'),
    },

    // remove other default values
    modulesDirectories: ['node_modules','app'],
  },

  /**
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {

    /**
     * An array of applied pre and post loaders.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
     */
    preLoaders: [

      /**
       * Tslint loader support for *.ts files
       *
       * See: https://github.com/wbuchwalter/tslint-loader
       */
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [helpers.root('node_modules'),helpers.root('src/sam-ui-elements')]
      },

      /**
       * Source map loader support for *.js files
       * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
       *
       * See: https://github.com/webpack/source-map-loader
       */
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
        // these packages have problems with their sourcemaps
        helpers.root('node_modules/rxjs'),
        helpers.root('node_modules/@angular')
      ]}

    ],

    /**
     * An array of automatically applied loaders.
     *
     * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
     * This means they are not resolved relative to the configuration file.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-loaders
     */
    loaders: [
      /**
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       */
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader','angular2-template-loader'],
        /*query: {
          compilerOptions: {

            // Remove TypeScript helpers to be injected
            // below by DefinePlugin
            removeComments: true

          }
        },*/
        exclude: [/\.e2e\.ts$/]
      },

      /**
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      { test: /\.json$/, loader: 'json-loader', exclude: [helpers.root('src/index.html')] },

      /**
       * Raw loader support for *.css files
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      { test: /\.css$/, loaders: ['to-string-loader', 'css-loader'], exclude: [helpers.root('src/index.html')] },

      /**
       * Raw loader support for *.html
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      { test: /\.html$/, loader: 'raw-loader', exclude: [helpers.root('src/index.html')] },

      /**
       * Compile css
       */
      { test: /\.scss$/, loaders: ['raw-loader', 'sass'], exclude: /node_modules/ },

    ],

    /**
     * An array of applied pre and post loaders.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
     */
    postLoaders: [

      /**
       * Instruments JS files with Istanbul for subsequent code coverage reporting.
       * Instrument only testing sources.
       *
       * See: https://github.com/deepsweet/istanbul-instrumenter-loader
       */
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }

    ]
  },

  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    new ContextReplacementPlugin(
      /..[\/\\]src[\/\\]app/,
      path.resolve(__dirname,focusPath)
    ),
    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
    // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'HMR': false,
      'API_UMBRELLA_URL': JSON.stringify("dummy"), // we do not test with a real backend, but the url and key must be defined
      'API_UMBRELLA_KEY': JSON.stringify("dummy"),
      'SHOW_OPTIONAL': JSON.stringify(process.env.SHOW_OPTIONAL === 'true'),
      'SHOW_HIDE_RESTRICTED_PAGES': JSON.stringify(process.env.SHOW_HIDE_RESTRICTED_PAGES === 'true'),
      'REPORT_MICRO_STRATEGY_ENV': JSON.stringify("dummy"),
      'REPORT_MICRO_STRATEGY_URL': JSON.stringify("dummy"),
      'ENABLE_REPORTING_AREA': JSON.stringify(process.env.ENABLE_REPORTING_AREA === 'true'),
      'REPORT_MICRO_STRATEGY_SERVER': JSON.stringify("dummy")
    }),


  ],

  /**
   * Static analysis linter for TypeScript advanced options configuration
   * Description: An extensible linter for the TypeScript language.
   *
   * See: https://github.com/wbuchwalter/tslint-loader
   */
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  sassLoader: {
    includePaths: ["src/app/styles"]
  },

  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};

if (helpers.hasProcessFlag('no-lint')) {
  conf.module.preLoaders = conf.module.preLoaders.filter(function(f) {
    return f.loader !== 'tslint-loader';
  });
  delete conf.tslint;
}

module.exports = conf;
