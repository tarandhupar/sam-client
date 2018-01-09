import { defaults, isFunction, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  transformMigrationAccount,
  logger, isDebug
} from './helpers';

import { getMockSystemAccount } from './mocks';

function transformSAResponse(data) {
  return defaults({
    pointOfContact: []
  }, data || {});
}

const $import = {
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

  history(id, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.import.history, { id: id }),
        auth = getAuthHeaders(),
        mock = [];

    $success = $success || (() => {});
    $error = $error || (() => {});

    mock = [
      {
        'id': 300001,
        'email': 'rhonda@nostra.gov',
        'username': 'rhonda@nostra.gov',
        'firstname': 'Kuame',
        'lastname': 'Sanford',
        'phone': 'hassanriaz@gmail.com',
        'sourceLegacySystem': 'DoD',
        'importTimestamp': 1482438998453,
        'loginAttempts': 0,
        'claimedTimestamp': 1484930796371,
        'claimedBy': 'doe.john@gmail.com',
        'claimed': true
      },
      {
        'id': 3,
        'email': 'Naomi@quam.edu',
        'username': 'PBROOKS',
        'firstname': 'Xanthus',
        'lastname': 'Nash',
        'phone': 'kristinwighttester@gmail.com',
        'sourceLegacySystem': 'FPDS',
        'importTimestamp': 1482249828796,
        'loginAttempts': 0,
        'claimedTimestamp': 1490638542792,
        'claimedBy': 'doe.john@gmail.com',
        'claimed': true
      }
    ];

    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .end((err, response) => {
          let accounts = [];

          if(!err) {
            accounts = (response.body || []).map((account) => transformMigrationAccount(account));
            $success(accounts);
          } else {
            if(isDebug()) {
              accounts = mock.map((account) => transformMigrationAccount(account));
              $success(accounts);
            } else {
              $error(exceptionHandler(response));
            }
          }
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  create(id, system, username, password, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.import.create),
        auth = getAuthHeaders(),
        params = {
          'legacySystem': system,
          'legacyUsername': username,
          'legacyPassword': password,
          'systemAccount': id
        };

    $success = $success || (() => {});
    $error = $error || (() => {});

    logger(params);

    if(auth) {
      request
        .post(endpoint)
        .set(auth)
        .send(params)
        .end((err, response) => {
          if(!err) {
            $success(transformMigrationAccount(response.body));
          } else {
            $error(response.body);
          }
        });
    } else {
      if(isDebug()) {
        $success(params);
      } else {
        $error({ message: 'Please sign in' });
      }
    }
  }
};

const account = {
  get(id, $success, $error) {
    let core = this,
        isAll = isFunction(id),
        auth = getAuthHeaders(),
        endpoint = isAll ?
          utilities.getUrl(config.system.account.get.replace(/\/\{id\}$/, '')) :
          utilities.getUrl(config.system.account.get, { id: (id || '') }),
        mock = isAll ? [
          getMockSystemAccount(1),
          getMockSystemAccount(2),
          getMockSystemAccount(3),
        ] : getMockSystemAccount(1);

    if(isAll) {
      $error = $success;
      $success = id;
    }

    $success = $success || (() => {});
    $error = $error || (() => {});

    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .ok(response => (response.status == 200))
        .then(response => {
          let accounts = response.body || (isAll ? [] : {});
          $success(accounts);
        }, response => {
          $error(exceptionHandler(response));
        });
    } else {
      if(isDebug()) {
        $success(mock);
      } else {
        $error(exceptionHandler({ message: 'Please sign in' }));
      }
    }
  },

  create(account, $success, $error) {
    let core = this,
        endpoint = utilities.getUrl(config.system.account.create),
        auth = getAuthHeaders(),
        data = sanitizeRequest(merge({
          _id: '',
          email: '',
          systemName: '',
          systemType: 'Non-Gov',
          comments: null,
          department: null,
          duns: null,
          businessName: null,
          businessAddress: null,
          ipAddress: null,
          primaryOwnerName: null,
          primaryOwnerEmail: null,
          pointOfContact: null
        }, account));

    $success = $success || (() => {});
    $error = $error || (() => {});

    logger(data);

    if(auth) {
      request
        .post(endpoint)
        .set(auth)
        .send(data)
        .end(function(error, response) {
          if(error) {
            $error(exceptionHandler(response));
          } else {
            $success(response.body || {});
          }
        });
    } else {
      if(isDebug()) {
        $success(data);
      } else {
        $error({ message: 'Please sign in' });
      }
    }
  },

  update(account, $success, $error) {
    let core = this,
        id = account._id,
        endpoint = utilities.getUrl(config.system.account.update, { id: id }),
        auth = getAuthHeaders(),
        data = sanitizeRequest(merge({
          _id: '',
          email: '',
          systemName: '',
          systemType: 'Non-Gov'
        }, account));

    $success = $success || (() => {});
    $error = $error || (() => {});

    if(auth && id) {
      request
        .put(endpoint)
        .set(auth)
        .send(data)
        .end(function(error, response) {
          if(error) {
            $error(exceptionHandler(response));
          } else {
            $success(response.body || {});
          }
        });
    } else {
      $error(exceptionHandler({ message: 'Please sign in' }));
    }
  },

  reset(id, password, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.reset, { id: id }),
        auth = getAuthHeaders(),
        data = {
          userPassword: password
        };

    $success = $success || (() => {});
    $error = $error || (() => {});

    if(auth) {
      request
        .put(endpoint)
        .set(auth)
        .send(data)
        .end(function(error, response) {
          const message = response ? exceptionHandler(response) : error.rawResponse;

          if(error) {
            $error(exceptionHandler(response));
          } else {
            $success(message);
          }
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  deactivate(id, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.deactivate, { id: id }),
        auth = getAuthHeaders();

    $success = $success || (() => {});
    $error = $error || (() => {});

    if(isDebug()) {
      $success();
      return;
    }

    if(auth && id) {
      request
        .delete(endpoint)
        .set(auth)
        .end(function(error, response) {
          if(error) {
            $error(exceptionHandler(response));
          } else {
            $success(response);
          }
        });
    } else {
      if(!id) {
        $error({ message: 'Please pass the id of the system account you are deactivating!' });
      } else {
        $error({ message: 'Please sign in' });
      }
    }
  },

  import: $import
};

export const system = {
  account: account
};
