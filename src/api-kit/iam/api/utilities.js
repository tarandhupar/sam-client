import _ from 'lodash';
import config from './config';

function $params() {
  let pattern = /([^&=]+)=?([^&]*)/g,
      decodePattern = /\+/g,
      decode,
      parse;

  decode = function(strValue) {
    return decodeURIComponent(
      strValue.replace(decodePattern, ' ')
    );
  };

  parse = function(query) {
    let params = {},
        output,
        key,
        val;

    while (output = pattern.exec(query) ) {
     key = decode(output[1])
     val = decode(output[2]);

      if(key.substring(key.length - 2) === '[]') {
        key = key.substring(0, key.length - 2);
        (params[key] || (params[key] = [])).push(val);
      } else {
        params[key] = val;
      };
    }

    return params;
  };

  return parse(location.search);
}

function $matcher(payload, pattern) {
  let matches = [],
      output;

  while(output = pattern.exec(payload)) {
    if(_.indexOf(matches, output[1]) == -1) {
      matches.push(output[1]);
    }
  }

  return matches;
}

function $sprintf(payload, data) {
  let pattern = new RegExp('\{([a-z0-9\-]+)\}', 'g'),
      replace,
      matches = $matcher(payload, pattern),
      match,
      intMatch;

  if(_.isObject(data)) {
    for(intMatch = 0; intMatch < matches.length; intMatch++) {
      match = matches[intMatch];
      if(data[match] !== undefined) {
        replace = '{'+ match +'}';
        payload = payload.replace(replace, data[match]);
      }
    }
  }

  return payload;
}

function parseUrlQuery() {
  let params = {},
      query = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        params[key] = value.toString().match(/true|false/) ? (/^true$/i).test(value) : value;
      });

  return params;
}

class Utilities {
  constructor(options) {
    let params = $params();

    this.debug = config.debug || false;
    this.environments = config.environments || {};
    this.environment = this.getEnvironment();
    this.baseUri = '';

    if(_.isObject(options)) {
      options.localResource = options.localResource || {};
      options.remoteResource = options.remoteResource || {};

      this.localResource = _.isObject(options.localResource) ? options.localResource : {};
      this.remoteResource = _.isObject(options.remoteResource) ? options.remoteResource : false;
    } else {
      this.localResource = {};
      this.remoteResource = {};
    }

    this.log = this.isLocal() || (!this.isLocal && this.debug) || (params.debug !== undefined && params.debug);

    this.queryparams = parseUrlQuery();
    this.baseUri = this.getBaseUri();
  }

  isLocal() {
    let isLocalHost = (
      this.environment == 'local' ||
      this.environment.search(/[a-z0-9]+\.ngrok\.io/) > -1
    );

    return isLocalHost ? true : false;
  }

  isRelative(endpoint) {
    return (endpoint.search(/^http/gi) > -1) ? false : true;
  }

  getEnvironment(environments) {
    let environment,
    		hostname = location.host,
    		active = 'local',
    		patterns,
    		pattern,
    		intPattern;

    environments = environments || this.environments || {};

    function isMatch(pattern) {
      return (hostname.search(pattern) > -1);
    }

    for(environment in environments) {
      if(_.isArray(environments[environment])) {
        patterns = environments[environment];

        for(intPattern = 0; intPattern < patterns.length; intPattern++) {
          pattern = patterns[intPattern];

          if(isMatch(pattern)) {
            active = environment;
          }
        }
      } else {
        pattern = environments[environment];

        if(isMatch(pattern)) {
          active = environment;
        }
      }
    }

    return active;
  }

  getEnvironmentPattern(env) {
    let patterns = !_.isUndefined(this.environments[env]) ? this.environments[env] : [];
    return _.isArray(patterns) ? patterns : [patterns];
  }

  getLocalEnvironment() {
    let env = 'local';

    if(window.location.hostname.search(/(local|comp|minc|prodlike)/) > -1) {
      env = (/(local|comp|minc|prodlike)/g).exec(window.location.hostname);

      env = (env[0] || 'comp');
      env = (env == 'local') ? 'comp' : env;
    }

    return env;
  }

  getUrl(endpoint) {
    let url = endpoint,
        $environment = (this.environment == 'local') ? 'comp' : this.environment;

    // String Interpolations
    url = $sprintf(endpoint, { environment: $environment });

    if(this.isRelative(endpoint)) {
      url = [this.baseUri, endpoint]
        .join('/')
        .replace(/([a-z-]+)\/\/+/g, '$1/');
    }

    return url;
  }

  getBaseUri() {
    let baseUri = '';

    if(this.isLocal()) {
      baseUri = this.localResource[this.getLocalEnvironment()] || this.localResource.comp || '';
    } else {
      if(this.remoteResource) {
        baseUri = this.remoteResource[this.getEnvironment()] || this.remoteResource.comp || '';
      }
    }

    return baseUri;
  }
}

export default Utilities;
