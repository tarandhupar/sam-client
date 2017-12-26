import { isUndefined, keys, merge, pick } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import * as modules from './modules';
import {
  config, utilities,
  getAuthHeaders, getParam, exceptionHandler,
  isDebug
} from './modules/helpers';

import { Auth } from '../..//interfaces';

Cookies.defaults = config.cookies();

function clearSession() {
  Cookies.remove('iPlanetDirectoryPro');
  Cookies.remove('IAMSession');
  Cookies.remove('IAMSystemAccount');
}

/**
 * IAM API Class
 */
class IAM {
  private _stage;
  private auth;

  protected $root;
  protected getParam;
  protected isDebug;

  public debug;
  public states;
  public user;

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

  get stage(): number {
    return this._stage;
  }

  resetLogin() {
    this._stage = 1;
    this.auth = {
      stage: 'PHONE'
    };
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
      clearSession();
      $error(error);
    });
  }

  get carriers(): String[] {
    return Object.keys(config.carriers);
  }

  getPayload(data: { [prop: string]: string }, method: string = 'email'): Auth {
    let services = {
          'email': 'LDAPandHOTP',
          'sms': 'LDAPandSMS'
        },

        props = [
          'stage|username',
          'service|username|password',
          'stage|service|authId|otp',
        ][this.stage - 1].split('|'),

        payload = {},
        intKey,
        key;

    for(intKey = 0; intKey < props.length; intKey++) {
      key = props[intKey];

      switch(key) {
        case 'service':
          payload[key] = services[method];
          break;

        default:
          payload[key] = null;
      }
    }

    data = pick(data, keys(payload));
    payload = merge({}, payload, this.auth, data);

    return payload;
  }

  login(payload: { [key: string]: any } = {}, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.session),
        params = this.getPayload(payload, payload.otppreference || 'email'),
        cookieError = 'There was an issue setting your session token, please clear your browser cookies for this website and try again.',
        data;

    // Store Payload History
    this.auth = merge({}, payload);

    // TEST (Unit Test) Environment
    if(isDebug()) {
      this._stage++;
      return;
    }

    request
      .post(endpoint)
      .timeout({ response: 3000 })
      .send(params)
      .then(response => {
        data = response.body.authnResponse ? response.body.authnResponse : response.body;
        this.auth = merge({}, this.auth, data);

        switch(this.stage) {
          case 1:
            // Skip to Step 3 if no mobile number available
            if(!data.otpphonenumber) {
              this._stage++;
              this.login({ otppreference: 'email' }, $success, $error);
              return;
            }

            break;

          case 3:
            if(data.tokenId) {
              // Remove any dangling IAM cookies (if any)
              clearSession();

              Cookies.set('iPlanetDirectoryPro', data.tokenId, config.cookies());

              // Verifying Cookie Set
              if(data.tokenId === Cookies.get('iPlanetDirectoryPro')) {
                // Verify user info before proceeding with success
                this.checkSession(() => {
                  $success(data);
                  this.resetLogin();
                }, response => {
                  $error(exceptionHandler(response));
                  this.resetLogin();
                });
              } else {
                $error({ message: cookieError });
                this.removeSession();
                this.resetLogin();
              }
            } else {
              $error({ message: 'There was an issue with getting your session token from the server' });
              this.resetLogin();
            }

            return;
        }

        this._stage++;
        $success(data);
      }, response => {
        this.resetLogin();
        $error(exceptionHandler(response));
      });
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
              //TODO
              console.log(response);
            }
          });
      };
    };

    ping();
  }

  removeSession($success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.session),
        auth = getAuthHeaders();

    $success = $success || function() {};
    $error = $error || function() {};

    if(auth) {
      request
        .delete(endpoint)
        .set(auth)
        .end((error, response) => {
          clearSession();

          setTimeout(() => {
            error ? $error() : $success();
          }, 100);
        });
    } else {
      $success();
    }
  }

  isLocal() {
    return utilities.isLocal();
  }

  getEnvironment() {
    return utilities.getEnvironment();
  }

  logout(refresh: boolean = true, callback: Function = () => {}) {
    let cb;

    cb = (() => {
      if(refresh) {
        window.location.reload(true);
      }

      callback();
    });

    this.removeSession(cb, cb);
  }
}

export default IAM;
