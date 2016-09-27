/**
 * @author: @AngularClass
 */

// Look in ./config folder for webpack.dev.js
switch (process.env.NODE_ENV) {
  case 'local':
    module.exports = require('./config/webpack.local');
    break;
  case 'reidev':
    module.exports = require('./config/webpack.reidev');
    break;
  case 'reiuat':
    module.exports = require('./config/webpack.reiuat');
    break;
  case 'comp':
    module.exports = require('./config/webpack.comp');
    break;
  case 'minc':
    module.exports = require('./config/webpack.minc');
    break;
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod');
    break;
  case 'test':
  case 'testing':
    module.exports = require('./config/webpack.test');
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.dev');
}
