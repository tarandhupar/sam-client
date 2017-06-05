import { defaults, isFunction, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  transformMigrationAccount,
  isDebug
} from './helpers';

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
        headers = getAuthHeaders(),
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

    request
      .get(endpoint)
      .set(headers)
      .end((err, response) => {
        let accounts = [];

        if(!err) {
          accounts = response.body || [];

          $success(
            accounts.map((account) => transformMigrationAccount(account))
          );
        } else {
          if(isDebug()) {
            $error(
              mock.map((account) => transformMigrationAccount(account))
            );
          } else {
            $error(exceptionHandler(response));
          }
        }
      });
  },

  create(id, system, username, password, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.import.create),
        headers = getAuthHeaders(),
        params = {
          'legacySystem': system,
          'legacyUsername': username,
          'legacyPassword': password,
          'systemAccount': id
        };

    $success = $success || (() => {});
    $error = $error || (() => {});

    request
      .post(endpoint)
      .set(headers)
      .send(params)
      .end((err, response) => {
        if(!err) {
          $success(transformMigrationAccount(response.body));
        } else {
          $error(response.body);
        }
      });
  }
};

const account = {
  get(id, $success, $error) {
    let core = this,
        isAll = isFunction(id),
        auth = getAuthHeaders(),
        endpoint = isAll ?
          utilities.getUrl(config.system.account.get.replace(/\/\{id\}$/, '')) :
          utilities.getUrl(config.system.account.get, { id: (id || '') });

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
        .end(function(error, response) {
          let accounts = response.body || (isAll ? [] : {});
          if(error) {
            $error(accounts);
          } else {
            $success(accounts);
          }
        });
    } else {
      $error(exceptionHandler({}));
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

    if(auth) {
      request
        .post(endpoint)
        .set(auth)
        .send(data)
        .end(function(error, response) {
          if(error) {
            $error(exceptionHandler(response.body));
          } else {
            $success(response.body || {});
          }
        });
    } else {
      $error(exceptionHandler({}));
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
            $error(exceptionHandler(response.body));
          } else {
            $success(response.body || {});
          }
        });
    } else {
      $error(exceptionHandler({}));
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

    request
      .put(endpoint)
      .set(auth)
      .send(data)
      .end(function(error, response) {
        const message = response ? exceptionHandler(response.body) : error.rawResponse;
        if(error) {
          $error(message);
        } else {
          $success(message);
        }
      });
  },

  deactivate(id, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.deactivate, { id: id }),
        headers = getAuthHeaders();

    $success = $success || (() => {});
    $error = $error || (() => {});

    if(id) {
      request
        .delete(endpoint)
        .set(headers)
        .end(function(error, response) {
          if(error) {
            $error(exceptionHandler(response.body));
          } else {
            $success(response);
          }
        });
    } else if(isDebug()) {
      $error({ message: `Please pass the id of the system account you are deactivating!`});
    }
  },

  import: $import
};

export const system = {
  account: account
};
