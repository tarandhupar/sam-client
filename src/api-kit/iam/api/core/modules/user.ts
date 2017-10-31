import { isArray, isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug, logger
} from './helpers';

import { User } from '../user';
import { getMockUser } from './mocks';

Cookies.defaults = config.cookies();

function yesOrNo(value) {
  return (value || false) ? 'yes' : 'no';
}

function getCarrierDomain(carrier: string) {
  return config.carriers[carrier || ''];
}

/**
 * [Component][IAM][User] CAC Submodule
 */
const cac = {
  merge: function(email, token, $success, $error) {
    let endpoint = utilities.getUrl(config.mergeWith.replace(/\{email\}/g, email)),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    return request
      .post(endpoint)
      .set(auth)
      .then(function(response) {
        $success(response.body);
      }, $error);
  }
};

/**
 * [Component][IAM][User] Registration Submodule
 */
const registration = {
  init(email, $success, $error) {
    let endpoint = [
      utilities.getUrl(config.registration.init.replace(/\{email\}/g, email)),
      Date.now().toString()
    ].join('&');

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .get(endpoint)
      .set('X-Requested-With', 'XMLHttpRequest')
      .end(function(err, response) {
        if(err) {
          $error(response.body.message);
        } else {
          $success(response.body);
        }
      });
  },

  confirm(token, $success, $error) {
    let endpoint = utilities.getUrl(config.registration.confirm),
        data = {
          tokenId: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(data)
      .then(function(response) {
        $success(response.body);
      }, $error);
  },

  register(token, userData, $success, $error) {
    this.$base.user.create(token, userData, $success, $error);
  }
};

/**
 * [Component][IAM][User] Password Submodule
 */
const password = {
  init(email, $success, $error) {
    let endpoint = utilities.getUrl(config.password.unauthenticated.init.replace(/\{email\}/g, email));

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .get(endpoint)
      .end(function(err, response) {
        if(!err) {
          $success(response.body);
        } else {
          $error(exceptionHandler(response));
        }
      });
  },

  verify(token, $success, $error) {
    let endpoint = utilities.getUrl(config.password.unauthenticated.verify),
        params = {
          token: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(params)
      .end(function(err, response) {
        let data;

        if(!err) {
          data = merge({
            status: '',
            question: '',
            token: ''
          }, response.body);

          $success(data.token, data.question);
        } else {
          $error(exceptionHandler(response));
        }
      });
  },

  kba(token, answer, $success, $error) {
    let endpoint = utilities.getUrl(config.password.unauthenticated.kba),
        params = {
          answer: answer,
          token: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(params)
      .end(function(err, response) {
        let data = merge({
              status: '',
              question: '',
              token: '',
              message: ''
            }, response.body);

        if(!err) {
          $success(data.status, data.token, data.question, data.message);
        } else {
          $error(exceptionHandler(response));
        }
      });
  },

  // Password Reset for Unauthenticated Users
  reset(newPassword: string, token: string, $success, $error) {
    let endpoint = utilities.getUrl(config.password.unauthenticated.reset),
        params = {
          password: newPassword,
          token: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(params)
      .end(function(err, response) {
        if(!err) {
          $success(response.body);
        } else {
          $error(exceptionHandler(response));
        }
      });
  },

  // Password Reset for Authenticated Sessions
  change(email, oldPassword, newPassword, $success, $error) {
    let endpoint = utilities.getUrl(config.password.authenticated.replace(/\{email\}/g, email)),
        auth = getAuthHeaders(),
        data = {
          currentpassword: oldPassword,
          userpassword: newPassword
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .post(endpoint)
        .set(auth)
        .send(data)
        .end(function(err, response) {
          if(!err) {
            $success(response.body);
          } else {
            $error(exceptionHandler(response));
          }
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  }
};

export const user = {
  states: {
    auth: isDebug(),
    fsd: isDebug(),
    system: isDebug(),
  },

  get($success, $error) {
    let core = this,
        endpoint = utilities.getUrl(config.user),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      // Verify User Session Cache
      if(User.getCache()) {
        $success(new User(User.getCache()));
      } else {
        request
          .get(endpoint)
          .set(auth)
          .then(response => {
            let $user: User = new User(response.body);
            User.updateCache(response.body);
            $success($user);
          }, response => {
            core.$base.removeSession();
            $error(exceptionHandler(response));
          });
      }
    } else {
      if(isDebug()) {
        $success(new User(getMockUser()));
      } else {
        $error({ message: 'Please sign in' });
      }
    }
  },

  create(token, userData, $success, $error) {
    let endpoint = utilities.getUrl(config.registration.register),
        data = {
          tokenId: token,
          user: (userData || {})
        };

    if(!isUndefined(userData.kbaAnswerList) && isArray(userData.kbaAnswerList)) {
      data['kbaAnswerList'] = userData.kbaAnswerList;
      delete userData.kbaAnswerList;
    }

    data.user.emailNotification = yesOrNo(data.user.emailNotification);

    if(data.user.carrier)
      data.user.carrierExtension = getCarrierDomain(data.user.carrier);
    if(data.user.workPhone)
      data.user.workPhone = data.user.workPhone.replace(/[^0-9]/g, '');
    if(data.user.personalPhone)
      data.user.personalPhone = data.user.personalPhone.replace(/[^0-9]/g, '');

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(logger(data)) {
      return;
    };

    request
      .post(endpoint)
      .send(data)
      .end(function(err, response) {
        let token;

        if(err) {
          $error(exceptionHandler(response || {}));
        } else {
          token = response.body.tokenId;

          // Automatically authenticate the user and start a session
          Cookies.set('iPlanetDirectoryPro', token, config.cookies());

          $success(token || {});
        }
      });
  },

  update(userData, $success, $error) {
    let endpoint = utilities.getUrl(config.details.update),
        auth = getAuthHeaders(),
        data = userData || {};

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    data.emailNotification = yesOrNo(data.emailNotification);

    if(data.carrier)
      data.carrierExtension = getCarrierDomain(data.carrier);
    if(data.workPhone)
      data.workPhone = data.workPhone.replace(/[^0-9]/g, '');
    if(data.personalPhone)
      data.personalPhone = data.personalPhone.replace(/[^0-9]/g, '');


    if(logger(merge(User.getCache() || {}, userData))) {
      User.updateCache(data);
      return;
    }

    if(auth) {
      request
        .patch(endpoint)
        .set(auth)
        .send(data)
        .then(response => {
          User.updateCache(data);
          $success(response.body);
        }, $error);
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  deactivate(email, $success, $error) {
    let endpoint = utilities.getUrl(config.details.deactivate.replace(/\{email\}/g, email)),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .delete(endpoint)
        .set(auth)
        .then(function(response) {
          $success(response);
        }, function(response) {
          $error(exceptionHandler(response));
        });
    } else {
      $error(exceptionHandler({ message: 'Please sign in' }));
    }
  },

  cac: cac,
  registration: registration,
  password: password,

  isSignedIn() {
    if(isDebug()) {
      // Allow other modules that depend on IAMSession for checking user session to use debug mode
      if(!User.getCache()) {
        User.updateCache(getMockUser());
      }

      return this.states.auth;
    } else {
      return Cookies.get('iPlanetDirectoryPro') ? true : false;
    }
  },

  isFSD() {
    if(isDebug()) {
      return this.states.fsd;
    } else {
      const user = new User(User.getCache() || {});
      return this.isSignedIn() && user.fsd ? true : false;
    }
  },

  isSystemAccount() {
    if(isDebug()) {
      return this.states.system;
    } else {
      const user = new User(User.getCache() || {});
      return this.isSignedIn() && user.systemAccount ? true : false;
    }
  }
};
