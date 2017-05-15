import { isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import * as modules from './modules';
import {
  config, utilities,
  getAuthHeaders, getParam, exceptionHandler,
  isDebug
} from './modules/helpers';

/**
 * IAM API Class
 */
class IAM {
  $root;
  debug;
  states;
  user;
  auth;
  getParam;
  isDebug;

  constructor($api) {
    merge(this, utilities, {
      config: config
    }, modules);

    this.debug = false;
    this.states = {
      auth: false
    };

    this.$root = $api;
    this.isDebug = isDebug;
    this.getParam = getParam;
    this.user.$base = this;

    this.checkSession();
    this.resetLogin();

    // Inject config and utilities into user modules
    for(let module in this.user) {
      this.user[module].$base = this;
    }
  }

  checkSession($success?, $error?) {
    $success = $success || function() {};
    $error = $error || function() {};

    this.user.get((user) => {
      this.states.auth = true;
      this.states.user = user;

      $success(this.states.user);
    }, (error) => {
      this.states.auth = false;

      // Remove any remaining cookies (This is a fallback in situations where cookie is still cached)
      Cookies.remove('iPlanetDirectoryPro', config.cookies);
      Cookies.remove('IAMSession', config.cookies);
      Cookies.remove('IAMSystemAccount', config.cookies);

      $error(error);
    });
  }

  login(credentials, $success, $error) {
    let $api = this,
        endpoint = utilities.getUrl(config.session),
        token,
        data = merge({ service: 'ldapService' }, credentials);

    $success = $success || function() {};
    $error = $error || function() {};

    request
      .post(endpoint)
      .send(data)
      .then(function(response) {
        let data = response.body;

        if(data.authnResponse.tokenId !== undefined) {
          Cookies.set('iPlanetDirectoryPro', (data.authnResponse.tokenId  || null), config.cookies);
          $success();
        } else {
          $error();
        }
      }, function() {
        $error();
      });
  }

  loginOTP(credentials, $success, $error) {
    let endpoint = utilities.getUrl(config.session),
        token,
        data = merge(this.getStageData(), credentials);

    $success = $success || function() {};
    $error = $error || function() {};

    request
      .post(endpoint)
      .send(data)
      .end((err, response) => {
        if(!err) {
          let data = response.body.authnResponse;

          if(isUndefined(data.tokenId)) {
            this.auth.authId = data['authId'];
            this.auth.stage = data['stage'];
            $success();
          } else {
            this.auth.authId = false;
            this.auth.stage = false;

            Cookies.set('iPlanetDirectoryPro', (data.tokenId  || null), config.cookies);

            this.checkSession((user) => {
              $success(user);
            });
          }
        } else {
          $error(exceptionHandler(response.body));
        }
      });
  }

  getStageData(): any {
    if(this.auth.stage && this.auth.authId) {
      return {
        service: 'LDAPandHOTP',
        stage: this.auth.stage,
        otp: '',
        authId: this.auth.authId
      };
    } else {
      return {
        service: 'LDAPandHOTP',
        username: '',
        password: ''
      };
    }
  }

  resetLogin() {
    this.auth = {
      authId: false,
      stage: false
    };
  }

  verifySession() {
    const ping = function() {
      let endpoint = utilities.getUrl(config.timeout),
          auth = getAuthHeaders();

      if(auth) {
        request
          .post(endpoint)
          .set(auth)
          .end((err, response) => {
            if(!err) {
              console.log(response);
            }
          });
      };
    };

    ping();
  }

  removeSession($success, $error) {
    let endpoint = utilities.getUrl(config.session),
        auth = getAuthHeaders();

    $success = $success || function() {};
    $error = $error || function() {};

    request
      .delete(endpoint)
      .set(auth)
      .end((error, response) => {
        Cookies.remove('iPlanetDirectoryPro', config.cookies);
        Cookies.remove('IAMSession', config.cookies);
        Cookies.remove('IAMSystemAccount', config.cookies);

        error ? $error() : $success();
      });
  }

  isLocal() {
    return utilities.isLocal();
  }

  getEnvironment() {
    return utilities.getEnvironment();
  }

  logout(refresh) {
    let cb;

    refresh = refresh || true;

    cb = (() => {
      if(refresh) {
        window.location.reload(true);
      }
    });

    this.removeSession(cb, cb);
  }
}

export default IAM;
