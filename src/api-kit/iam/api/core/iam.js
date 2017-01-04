import _ from 'lodash';
import Cookies from 'js-cookie';
import request from 'superagent';

import config from '../config';
import utilities from '../utilities';

const exceptionHandler = function(responseBody) {
  return _.extend({
    status: 'error',
    message: 'Sorry, an unknown server error occured. Please contact the Help Desk for support.'
  }, responseBody);
};

let $config = _.extend({}, config.endpoints.iam),
    utils = new utilities({
      localResource: $config.localResource
    });

/**
 * [Component][IAM] User Module
 */
let user = {
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
          let user = response.body.sessionToken;
          $success(user);
        }, function(response) {
          core.$base.removeSession();
          $error();
        });
    } else {
      $error();
    }
  },

  create(email, token, userData, $success, $error) {
    let endpoint = utils.getUrl($config.registration.register),
        data = {
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
        $error(response);
      });
  }
};

/**
 * [Component][IAM][User] Registration Submodule
 */
user.registration = {
  init(email, $success, $error) {
    let endpoint = utils.getUrl($config.registration.init.replace(/\{email\}/g, email));

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .get(endpoint)
      .then(function(response) {
        $success(response.body);
      }, $error);
  },

  confirm(email, token, code, $success, $error) {
    let endpoint = utils.getUrl($config.registration.confirm),
        data = {
          tokenId: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(!_.isUndefined(code) && !_.isNull(code)) {
      data.confirmationId = code;
    }

    request
      .post(endpoint)
      .send(data)
      .then(function(response) {
        $success(response.body);
      }, $error);
  },

  register(email, token, userData, $success, $error) {
    this.$base.user.create(email, token, userData, $success, $error);
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
          kba.questions = (res.body.kbaQuestionList || []).filter(function(question) {
            return question.valid;
          });

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

/**
 * [Component] IAM Class
 */
class IAM {
  constructor($api) {
    _.extend(this, utils, {
      config: config,
      user: user,
      kba: kba
    });

    this.user.$base = this;

    this.resetLogin();

    // Inject config and utilities into user modules
    for(let module in this.user) {
      this.user[module].$base = this;
    }
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
    let api = this,
        endpoint = utils.getUrl($config.session),
        token,
        data = _.extend(this.getStageData(), credentials);

    $success = $success || function(data) {};
    $error = $error || function(data) {};

    request
      .post(endpoint)
      .send(data)
      .then(function(response) {
        let data = response.body.authnResponse;

        if(_.isUndefined(data.tokenId)) {
          api.login.authId = data['authId'];
          api.login.stage = data['stage'];
        } else {
          api.login.authId = false;
          api.login.stage = false;
          Cookies.set('iPlanetDirectoryPro', (data.tokenId  || null), $config.cookies);
        }

        $success(data);
      }, function(response) {
        let data = response.response.body,
            error = data.message;

        $error(error);
      });
  }

  getStageData() {
    if(this.login.stage && this.login.authId) {
      return {
        service: 'LDAPandHOTP',
        stage: this.login.stage,
        otp: '',
        authId: this.login.authId
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
    this.login = {
      authId: false,
      stage: false
    };
  }

  removeSession() {
    Cookies.remove('iPlanetDirectoryPro', $config.cookies);
  }

  logout() {
    this.removeSession();
    window.location.reload(true);
  }
}

export default IAM;
