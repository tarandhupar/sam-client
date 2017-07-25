import { isArray, isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug, logger
} from './helpers';

import { User } from '../user';

Cookies.defaults = config.cookies(15);

function yesOrNo(value) {
  return (value || false) ? 'yes' : 'no';
}

function getMockUserAccount() {
  const answer = '        ';

  return {
    _id: 'doe.john@gsa.gov',
    email: 'doe.john@gsa.gov',

    middleName: 'J',
    firstName: 'John',
    initials: 'J',
    lastName: 'Doe',
    suffix: 'Jr.',

    workPhone: '12401234568',

    departmentID: 100006688,
    agencyID: 0,
    officeID: 100173623,

    kbaAnswerList: [
      { questionId: 1, answer: answer },
      { questionId: 3, answer: answer },
      { questionId: 5, answer: answer }
    ],

    emailNotification: false,

    _links: {
      self: {
        href: '/comp/iam/auth/v4/session'
      },

      'system-accounts.management': {
        href: '/comp/iam/cws/api/system-accounts',
      },

      'system-accounts.migration': {
        href: '/comp/iam/import/system-accounts',
      },

      'fsd.profile': {
        href: '/comp/iam/auth/v4/fsd/users/doe.john@gsa.gov',
        templated: true,
      },

      'fsd.kba': {
        href: '/comp/iam/kba/fsd/qa/doe.john@gsa.gov',
        templated: true
      },

      'fsd.deactivate': {
        href: '/comp/iam/my-details/api/fsd/doe.john@gsa.gov/deactivate',
        templated: true
      },

      'fsd.passreset': {
        href: '/comp/iam/password/api/fsd/doe.john@gsa.gov/passwordReset',
        templated: true
      }
    }
  };
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
            $error(exceptionHandler(response.body));
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
      if(Cookies.getJSON('IAMSession')) {
        $success(new User(Cookies.getJSON('IAMSession')));
      } else {
        request
          .get(endpoint)
          .set(auth)
          .then(function(response) {
            let $user: User = new User(response.body);
            Cookies.set('IAMSession', response.body, config.cookies(15));
            $success($user);
          }, function(response) {
            core.$base.removeSession();
            $error(exceptionHandler(response.body));
          });
      }
    } else {
      if(isDebug()) {
        $success(getMockUserAccount());
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

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(logger(data)) {
      return;
    };

    request
      .post(endpoint)
      .send(data)
      .end(function(err, response) {
        if(err) {
          $error(exceptionHandler(response.body || {}));
        } else {
          $success(response.body.user || {});
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

    if(logger(data)) {
      return;
    }

    if(auth) {
      request
        .patch(endpoint)
        .set(auth)
        .send(data)
        .then((response) => {
          let $user: User = merge(Cookies.getJSON('IAMSession') || {}, userData);
          Cookies.set('IAMSession', $user, config.cookies(15));
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
          $error(exceptionHandler(response.body));
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  cac: cac,
  registration: registration,
  password: password,

  isSignedIn() {
    if(isDebug()) {
      return this.states.auth;
    } else {
      return Cookies.get('iPlanetDirectoryPro') ? true : false;
    }
  },

  isFSD() {
    if(isDebug()) {
      return this.states.fsd;
    } else {
      const user = new User(Cookies.getJSON('IAMSession') || {});
      return this.isSignedIn() && user['fsd'] ? true : false;
    }
  },

  isSystemAccount() {
    if(isDebug()) {
      return this.states.system;
    } else {
      const user = new User(Cookies.getJSON('IAMSession') || {});
      return this.isSignedIn() && user['systemAccount'] ? true : false;
    }
  }
};
