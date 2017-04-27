import { isArray, isObject, isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';
import * as moment from 'moment';

import * as modules from './modules';
import {
  config, utilities,
  getAuthHeaders, exceptionHandler,
  isDebug
} from './modules/helpers';

import User from './user';

function transformMigrationAccount(account) {
  account = isObject(account) ? account : {};
  account = merge({
    sourceLegacySystem: '',
    username: '',
    firstname: '',
    lastname: '',
    roles: []
  }, account);

  account.system = account.sourceLegacySystem.toUpperCase() + '.gov';
  account.name = [account.firstname || '', account.lastname || ''].join(' ').trim();
  account.migratedAt = (account.claimedTimestamp ? moment(account.claimedTimestamp) : moment()).format('MM/DD/YYYY');

  return account;
}

/**
 * [Component][IAM] User Module
 */
let user: any = {
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
          .set({ 'iPlanetDirectoryPro': Cookies.get('iPlanetDirectoryPro') })
          .then(function(response) {
            let user = new User(response.body.sessionToken);
            Cookies.set('IAMSession', response.body.sessionToken, config.cookie);
            $success(user);
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
        data: any = {
          tokenId: token,
          user: (userData || {})
        };

    if(!isUndefined(userData.kbaAnswerList) && isArray(userData.kbaAnswerList)) {
      data.kbaAnswerList = userData.kbaAnswerList;
      delete userData.kbaAnswerList;
    }

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

    request
      .patch(endpoint)
      .set(headers)
      .send(data)
      .then((response) => {
        let user = merge(Cookies.getJSON('IAMSession') || {}, userData);

        Cookies.set('IAMSession', user);

        $success(response.body);
      }, $error);
  },

  deactivate(email, $success, $error) {
    let endpoint = utilities.getUrl(config.details.deactivate.replace(/\{email\}/g, email)),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        };

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
  }
};

/**
 * [Component][IAM][User] Registration Submodule
 */
user.registration = {
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
user.password = {
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
        data = {
          token: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(data)
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
  reset(password, token, $success, $error) {
    let endpoint = utilities.getUrl(config.password.unauthenticated.reset),
        data = {
          password: password,
          token: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(data)
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
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        },

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

/**
 * [Component][IAM] KBA Module
 */
let kba = {
  questions($success, $error) {
    let endpoint = utilities.getUrl(config.kba.questions),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .get(endpoint)
      .set(headers)
      .end(function(err, res) {
        let kba = {
          questions: [],
          selected: []
        };

        if(!err) {
          kba.questions = (res.body.kbaQuestionList || []);
          kba.selected = (res.body.kbaAnswerIdList || []).map(function(questionID) {
            return parseInt(questionID);
          });

          $success(kba);
        } else {
          $error(kba);
        }
      });
  },

  update(answers, $success, $error) {
    let endpoint = utilities.getUrl(config.kba.update),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        },

        data = {
          kbaAnswerList: answers
        },

        intAnswer;

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(isUndefined(answers)) {
      console.warn('KBA answers must be passed in as an argument, update aborted!');
      return;
    }

    data.kbaAnswerList =  data.kbaAnswerList.map(function(question) {
      question.answer = question.answer.trim();
      return question;
    });

    request
      .patch(endpoint)
      .set(headers)
      .send(data)
      .end(function(err, res) {
        if(!err) {
          $success(res);
        } else {
          $error(res);
        }
      });
  }
};

user.cac = {
  merge: function(email, token, $success, $error) {
    let endpoint = utilities.getUrl(config.mergeWith.replace(/\{email\}/g, email)),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        };

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

let $import = {
  systems() {
    return ([
      'SAM',
      'FPDS',
      'CFDA',
      'eSRS/FSRS',
      'FBO',
      'PPIRS',
      'CPARS',
    ]).map((source) => {
      return {
        label: `${source}.gov`,
        value: source
      };
    });
  },

  history(email, $success, $error) {
    let endpoint = utilities.getUrl(config.import.history),
        headers = {
          'iPlanetDirectoryPro': Cookies.get('iPlanetDirectoryPro')
        },

        mock = [];

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    mock = [
      {
        "id": 300001,
        "email": "rhonda@nostra.gov",
        "username": "rhonda@nostra.gov",
        "firstname": "Kuame",
        "lastname": "Sanford",
        "phone": "hassanriaz@gmail.com",
        "sourceLegacySystem": "DoD",
        "importTimestamp": 1482438998453,
        "loginAttempts": 0,
        "claimedTimestamp": 1484930796371,
        "claimedBy": "doe.john@gmail.com",
        "claimed": true
      },
      {
        "id": 3,
        "email": "Naomi@quam.edu",
        "username": "PBROOKS",
        "firstname": "Xanthus",
        "lastname": "Nash",
        "phone": "kristinwighttester@gmail.com",
        "sourceLegacySystem": "FPDS",
        "importTimestamp": 1482249828796,
        "loginAttempts": 0,
        "claimedTimestamp": 1490638542792,
        "claimedBy": "doe.john@gmail.com",
        "claimed": true
      }
    ];

    request
      .get(endpoint)
      .set(headers)
      .end(function(err, response) {
        let accounts = [];

        if(!err) {
          accounts = response.body || [];
          accounts = accounts.map((account) => {
            return transformMigrationAccount(account);
          });

          $success(accounts);
        } else {
          if(isDebug()) {
            $error(
              mock.map((account) => {
                return transformMigrationAccount(account);
              })
            );
          } else {
            $error(exceptionHandler(response));
          }
        }
      });
  },

  create(email, system, username, password, $success, $error) {
    let endpoint = utilities.getUrl(config.import.roles),
        headers = {
          'iPlanetDirectoryPro': Cookies.get('iPlanetDirectoryPro')
        },

        params = {
          'legacySystem': system,
          'legacyUsername': username,
          'legacyPassword': password,
          'currentUser': email
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .set(headers)
      .send(params)
      .end(function(err, response) {
        if(!err) {
          $success(
            transformMigrationAccount(response.body)
          );
        } else {
          $error(response.body);
        }
      });
  }
};

/**
 * IAM API Class
 */
class IAM {
  $root;
  debug;
  states;
  user;
  auth;
  isDebug;

  constructor($api) {
    merge(this, utilities, {
      config: config,
      user: user,
      kba: kba,
      import: $import
    }, modules);

    this.debug = false;
    this.states = {
      auth: false
    };

    this.$root = $api;
    this.isDebug = isDebug;
    this.user.$base = this;

    this.checkSession();
    this.resetLogin();

    // Inject config and utilities into user modules
    for(let module in this.user) {
      this.user[module].$base = this;
    }
  }

  checkSession($success?, $error?) {
    $success = $success || function(data) {};
    $error = $error || function(data) {};

    this.user.get((user) => {
      this.states.auth = true;
      this.states.user = user;

      $success(this.states.user);
    }, (error) => {
      this.states.auth = false;
      $error(error);
    });
  }

  login(credentials, $success, $error) {
    let $api = this,
        endpoint = utilities.getUrl(config.session),
        token,
        data = merge({ service: 'ldapService' }, credentials);

    $success = $success || function(data) {};
    $error = $error || function(data) {};

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
      }, function(data) {
        $error();
      });
  }

  loginOTP(credentials, $success, $error) {
    let endpoint = utilities.getUrl(config.session),
        token,
        data = merge(this.getStageData(), credentials);

    $success = $success || function(data) {};
    $error = $error || function(data) {};

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

    $success = $success || function(data) {};
    $error = $error || function(data) {};

    request
      .delete(endpoint)
      .set(auth)
      .end((error, response) => {
        error ? $error() : $success();

        Cookies.remove('iPlanetDirectoryPro', config.cookies);
        Cookies.remove('IAMSession', config.cookies);
        Cookies.remove('IAMSystemAccount', config.cookies);
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
