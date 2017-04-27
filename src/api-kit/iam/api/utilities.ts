import { indexOf, isArray, isObject, isUndefined, merge } from 'lodash';
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
    if(indexOf(matches, output[1]) == -1) {
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

  if(isObject(data)) {
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
        return undefined;
      });

  return params;
}

class Utilities {
  environments;
  debug;
  environment;
  baseUri;
  log;
  queryparams;

  constructor(options?) {
    let params = $params();

    this.debug = config.debug || false;
    this.environments = config.environments || {};
    this.environment = this.getEnvironment();
    this.baseUri = '';

    if(isObject(options)) {
      this.baseUri = options.baseUri || false;
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

  getEnvironment(environments?) {
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
      if(isArray(environments[environment])) {
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
    let patterns = !isUndefined(this.environments[env]) ? this.environments[env] : [];
    return isArray(patterns) ? patterns : [patterns];
  }

  getLocalEnvironment() {
    let env: any = 'local';

    if(window.location.hostname.search(/(local|comp|minc|prodlike)/) > -1) {
      env = (/(local|comp|minc|prodlike)/g).exec(window.location.hostname);

      env = (env[0] || 'comp');
      env = (env == 'local') ? 'comp' : env;
    }

    return env;
  }

  getUrl(endpoint, params?) {
    let $environment = (this.environment == 'local') ? 'comp' : this.environment,
        routeParams = merge({}, (params || {}), { environment: $environment }),
        url = $sprintf(endpoint, routeParams);

    if(this.isRelative(url)) {
      url = [this.baseUri, url]
        .join('/')
        .replace(/([a-z-]+)\/\/+/g, '$1/');
    }

    // Apply API Key
    url += '?api_key=8NNLSvVq9ozqkA1BA7KCey9ocE0iovWXs5dmjTu5';

    return url;
  }

  getBaseUri() {
    return this.baseUri;
  }
}

export default Utilities;
