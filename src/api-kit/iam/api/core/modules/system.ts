import { defaults, isFunction, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  transformMigrationAccount,
  logger, isDebug
} from './helpers';

function getMockSystemAccount(index) {
  const types = ['Gov','Non-Gov'];

  index = index || 1;

  return {
    _id:               `system-email-${index}@email.com`,
    email:             `system-email-${index}@email.com`,
    systemType:        types[Math.random()],
    systemName:        `System-Account-${index}`,
    ipAddress:         `System-Account-${index}`,

    comments:          'System comments...',
    duns:              'Test Duns',
    businessName:      'John Doe Inc.',
    businessAddress:   '1600 Pennsylvania Ave NW, Washington DC 20500',
    department:        100006688,
    primaryOwnerName:  `Primary Owner Name ${index}`,
    primaryOwnerEmail: `primary-owner-email-${index}@email.com`,

    pointOfContact: [
      'chiukk1@gmail.com',
      'chiu_kevin@bah.com',
    ]
  };
}

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
        .end(function(error, response) {
          let accounts = response.body || (isAll ? [] : {});
          if(error) {
            $error(accounts);
          } else {
            $success(accounts);
          }
        });
    } else {
      if(isDebug()) {
        $success(mock);
      } else {
        $error(exceptionHandler({}));
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
            $error(exceptionHandler(response.body));
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

    if(auth) {
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
    } else {
      $error({ message: 'Please sign in' });
    }
  },

  deactivate(id, $success, $error) {
    let endpoint = utilities.getUrl(config.system.account.deactivate, { id: id }),
        auth = getAuthHeaders();

    $success = $success || (() => {});
    $error = $error || (() => {});

    if(auth && id) {
      request
        .delete(endpoint)
        .set(auth)
        .end(function(error, response) {
          if(error) {
            $error(exceptionHandler(response.body));
          } else {
            $success(response);
          }
        });
    } else {
      if(isDebug()) {
        $success();
      } else if(!id) {
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
