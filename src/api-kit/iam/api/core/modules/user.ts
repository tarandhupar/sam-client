import { isArray, isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug
} from './helpers';

import User from '../user';

function yesOrNo(value) {
  return (value || false) ? 'yes' : 'no';
}

/**
 * [Component][IAM][User] CAC Submodule
 */
const cac = {
  merge: function(email, token, $success, $error) {
    let endpoint = utilities.getUrl(config.mergeWith.replace(/\{email\}/g, email)),
        headers = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    return request
      .post(endpoint)
      .set(headers)
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
          $error(exceptionHandler(response.body));
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
          $error(exceptionHandler(response.body));
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
          $error(exceptionHandler(response.body));
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
          $error(exceptionHandler(response.body));
        }
      });
  },

  // Password Reset for Authenticated Sessions
  change(email, oldPassword, newPassword, $success, $error) {
    let endpoint = utilities.getUrl(config.password.authenticated.replace(/\{email\}/g, email)),
        headers = getAuthHeaders(),
        data = {
          currentpassword: oldPassword,
          userpassword: newPassword
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .set(headers)
      .send(data)
      .end(function(err, response) {
        if(!err) {
          $success(response.body);
        } else {
          $error(exceptionHandler(response.body));
        }
      });
  }
};

export const user = {
  get($success, $error) {
    let core = this,
        endpoint = utilities.getUrl(config.session);

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    // Verify Session Token
    if(Cookies.get('iPlanetDirectoryPro')) {
      // Verify User Session Cache
      if(Cookies.getJSON('IAMSession')) {
        $success(new User(Cookies.getJSON('IAMSession')));
      } else {
        request
          .get(endpoint)
          .set(getAuthHeaders())
          .then(function(response) {
            let $user: User = new User(response.body.sessionToken);
            Cookies.set('IAMSession', response.body.sessionToken, config.cookies);
            $success($user);
          }, function(response) {
            core.$base.removeSession();
            $error(exceptionHandler(response.body));
          });
      }
    } else {
      $error({ message: 'No user active user session.' });
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

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(data)
      .end(function(err, response) {
        if(err) {
          $error(response.body.message);
        } else {
          $success(response.body.user || {});
        }
      });
  },

  update(userData, $success, $error) {
    let endpoint = utilities.getUrl(config.details.update),
        headers = getAuthHeaders(),
        data = userData || {};

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    data.emailNotification = yesOrNo(data.emailNotification);

    request
      .patch(endpoint)
      .set(headers)
      .send(data)
      .then((response) => {
        let $user: User = merge(Cookies.getJSON('IAMSession') || {}, userData);

        Cookies.set('IAMSession', $user);

        $success(response.body);
      }, $error);
  },

  deactivate(email, $success, $error) {
    let endpoint = utilities.getUrl(config.details.deactivate.replace(/\{email\}/g, email)),
        headers = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .delete(endpoint)
      .set(headers)
      .then(function(response) {
        $success(response);
      }, function(response) {
        $error(exceptionHandler(response.body));
      });
  },

  cac: cac,
  registration: registration,
  password: password
};
