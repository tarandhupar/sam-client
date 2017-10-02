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

function transformUserKBAResponse(data) {
  let kba = [],
      keys = ['first','second','third'];

  kba = keys.map((key, intKBA) => {
    return merge({
      questionId: data[`${key}Question`] || 0,
      answer: data[`${key}Answer`] || ''
    });
  });

  return kba;
}

/**
 * [Component][IAM][FSD] Reset Submodule
 */
const reset = {
  init(id, $success, $error) {
    let endpoint = utilities.getUrl(config.fsd.reset.init, { id: id }),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .then((response) => {
          $success(response.body);
        }, (response) => {
          $error(exceptionHandler(response.body));
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  verify(token, $success, $error) {
    let endpoint = utilities.getUrl(config.fsd.reset.verify),
        params = {
          token: token
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .post(endpoint)
      .send(params)
      .then((response) => {
        let data = merge({
              status: '',
              token: '',
              message: ''
        }, response.body);

        $success(data.status, data.token, data.message);
      }, (response) => {
        $error(exceptionHandler(response.body));
      });
  }
};

export const fsd = {
  user(id, $success, $error) {
    let core = this,
        endpoint = utilities.getUrl(config.fsd.user, { id: id }),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(isDebug()) {
      const user: User = new User(getMockUser());
      $success(user);
      return;
    }

    // Verify Session Token
    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .then((response) => {
          $success(response.body);
        }, (response) => {
          $error(exceptionHandler(response.body));
        });
    } else {
      $error({ message: 'No user active user session.' });
    }
  },

  users($success, $error) {
    let endpoint = utilities.getUrl(config.fsd.users),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .then((response) => {
          $success(response.body);
        }, (response) => {
          $error(exceptionHandler(response.body));
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  kba(id, $success, $error) {
    let endpoint = utilities.getUrl(config.fsd.kba, { id: id }),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .then((response) => {
          const kba = response.body || {};
          $success(transformUserKBAResponse(kba));
        }, (response) => {
          $error(exceptionHandler(response.body));
        });
    } else {
      if(isDebug()) {
        const kba = {
          uid: 1,
          userEmail: id,
          firstQuestion:  1,
          secondQuestion: 2,
          thirdQuestion:  3,
          firstAnswer:  'question1',
          secondAnswer: 'question2',
          thirdAnswer:  'question3',
        };

        $success(transformUserKBAResponse(kba));
      } else {
        $error({ message: 'Please sign in' });
      }
    }
  },

  deactivate(id, $success, $error) {
    let endpoint = utilities.getUrl(config.fsd.deactivate, { id: id }),
        auth = getAuthHeaders();

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .delete(endpoint)
        .set(auth)
        .then((response) => {
          $success(response.body);
        }, (response) => {
          $error(exceptionHandler(response.body));
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  reset: reset
};
