import { isObject, isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  transformMigrationAccount,
  isDebug
} from './helpers';

export const $import = {
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
          accounts = accounts.map((account) => {
            return transformMigrationAccount(account);
          });

          $success(accounts);
        } else {
          if(isDebug()) {
            let accounts = mock.map((account) => {
              return transformMigrationAccount(account);
            });

            $success(accounts);
          } else {
            $error(exceptionHandler(response));
          }
        }
      });
  },

  create(email, system, username, password, $success, $error) {
    let endpoint = utilities.getUrl(config.import.roles),
        headers = getAuthHeaders(),
        params = {
          'legacySystem': system,
          'legacyUsername': username,
          'legacyPassword': password,
          'currentUser': email
        };

    $success = $success || (() => {});
    $error = $error || (() => {});

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
