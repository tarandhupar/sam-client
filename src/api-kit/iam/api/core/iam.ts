import * as _ from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import config from '../config';
import utilities from '../utilities';

import User from './user';

const exceptionHandler = function(responseBody) {
  return _.extend({
    status: 'error',
    message: 'Sorry, an unknown server error occured. Please contact the Help Desk for support.'
  }, responseBody);
};

const isDebug = function() {
  let isDebug = (utils.queryparams.debug !== undefined || false);
  return (utils.isLocal() && isDebug);
};

let $config = _.extend({}, config.endpoints.iam),
    utils = new utilities({
      localResource: $config.localResource,
      remoteResource: $config.remoteResource
    });

/**
 * [Component][IAM] User Module
 */
let user: any = {
  get($success, $error) {
    let core = this,
        endpoint = utils.getUrl($config.session);

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(Cookies.get('iPlanetDirectoryPro')) {
      request
        .get(endpoint)
        .set('iPlanetDirectoryPro', Cookies.get('iPlanetDirectoryPro'))
        .then(function(response) {
          let user = new User(response.body.sessionToken);
          $success(user);
        }, function(response) {
          core.$base.removeSession();
          $error(exceptionHandler(response.body));
        });
    } else {
      $error({ message: 'No user active user session.' });
    }
  },

  create(token, userData, $success, $error) {
    let endpoint = utils.getUrl($config.registration.register),
        data: any = {
          tokenId: token,
          user: (userData || {})
        };

    if(!_.isUndefined(userData.kbaAnswerList) && _.isArray(userData.kbaAnswerList)) {
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
    let endpoint = utils.getUrl($config.details.update),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        },

        data = userData || {};

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .patch(endpoint)
      .set(headers)
      .send(data)
      .then(function(response) {
        $success(response.body);
      }, $error);
  },

  deactivate(email, $success, $error) {
    let endpoint = utils.getUrl($config.details.deactivate.replace(/\{email\}/g, email)),
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
      utils.getUrl($config.registration.init.replace(/\{email\}/g, email)),
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
    let endpoint = utils.getUrl($config.registration.confirm),
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
    let endpoint = utils.getUrl($config.password.unauthenticated.init.replace(/\{email\}/g, email));

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
    let endpoint = utils.getUrl($config.password.unauthenticated.verify),
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
          data = _.extend({
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
    let endpoint = utils.getUrl($config.password.unauthenticated.kba),
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
        let data = _.extend({
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
    let endpoint = utils.getUrl($config.password.unauthenticated.reset),
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
    let endpoint = utils.getUrl($config.password.authenticated.replace(/\{email\}/g, email)),
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
    let endpoint = utils.getUrl($config.kba.questions),
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
    let endpoint = utils.getUrl($config.kba.update),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        },

        data = {
          kbaAnswerList: answers
        },

        intAnswer;

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(_.isUndefined(answers)) {
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
    let endpoint = utils.getUrl($config.mergeWith.replace(/\{email\}/g, email)),
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
    let endpoint = utils.getUrl($config.import.history.replace(/\{email\}/g, email)),
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
        "legacyPassword": "5f4dcc3b5aa765d61d8327deb882cf99",
        "phone": "hassanriaz@gmail.com",
        "sourceLegacySystem": "DoD",
        "importTimestamp": 1482438998453,
        "orgKey": 100000000,
        "loginAttempts": 0,
        "claimedTimestamp": 1484930796371,
        "fullName": "Kuame Sanford",
        "claimed": true
      },
      {
        "id": 300358,
        "email": "ina@iaculis.us",
        "legacyPassword": "579356b2d3267d2eaa93b741e17c997a",
        "phone": "hassanriaz@gmail.com",
        "sourceLegacySystem": "DoD",
        "importTimestamp": 1482438998465,
        "orgKey": 100000357,
        "loginAttempts": 0,
        "claimedTimestamp": 1484930761579,
        "fullName": "Violet Barlow",
        "claimed": true
      }
    ];

    request
      .get(endpoint)
      .set(headers)
      .end(function(err, response) {
        let accounts = [];
        if(!err) {
          accounts = response.body;

          accounts = accounts.map((account) => {
            account.role = account.role || [];
            return account;
          });

          $success(response.body);
        } else {
          if(isDebug()) {
            $error(mock);
          } else {
            $error(exceptionHandler(response));
          }
        }
      });
  },

  create(email, system, username, password, $success, $error) {
    let endpoint = utils.getUrl($config.import.roles),
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
          $success(response.body);
        } else {
          $success(response.body);
        }
      });
  }
};

/**
 * IAM API Class
 */
class IAM {
  debug;
  states;
  user;
  auth;
  isDebug;

  constructor($api) {
    _.extend(this, utils, {
      config: config,
      user: user,
      kba: kba,
      import: $import
    });

    this.debug = false;
    this.states = {
      auth: false
    };

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
        endpoint = utils.getUrl($config.session),
        token,
        data = _.extend({ service: 'ldapService' }, credentials);

    $success = $success || function(data) {};
    $error = $error || function(data) {};

    request
      .post(endpoint)
      .send(data)
      .then(function(response) {
        let data = response.body;

        if(data.authnResponse.tokenId !== undefined) {
          Cookies.set('iPlanetDirectoryPro', (data.authnResponse.tokenId  || null), $config.cookies);
          $success();
        } else {
          $error();
        }
      }, function(data) {
        $error();
      });
  }

  loginOTP(credentials, $success, $error) {
    let endpoint = utils.getUrl($config.session),
        token,
        data = _.extend(this.getStageData(), credentials);

    $success = $success || function(data) {};
    $error = $error || function(data) {};

    request
      .post(endpoint)
      .send(data)
      .end((err, response) => {
        if(!err) {
          let data = response.body.authnResponse;

          if(_.isUndefined(data.tokenId)) {
            this.auth.authId = data['authId'];
            this.auth.stage = data['stage'];
            $success();
          } else {
            this.auth.authId = false;
            this.auth.stage = false;
            Cookies.set('iPlanetDirectoryPro', (data.tokenId  || null), $config.cookies);

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

  removeSession() {
    Cookies.remove('iPlanetDirectoryPro', $config.cookies);
  }

  isLocal() {
    return utils.isLocal();
  }

  getEnvironment() {
    return utils.getEnvironment();
  }

  logout() {
    this.removeSession();
    window.location.reload(true);
  }
}

export default IAM;
