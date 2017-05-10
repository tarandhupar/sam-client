import { defaults, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug
} from './helpers';

function transformSAResponse(data) {
  return defaults({
    pointOfContact: []
  }, data || {});
}

export const system = {
  account: {
    get($success, $error) {
      let core = this,
          auth = getAuthHeaders(),
          endpoint = utilities.getUrl(config.system.account.get);

      $success = $success || (() => {});
      $error = $error || (() => {});

      if(auth) {
        request
          .get(endpoint)
          .set(auth)
          .end(function(error, response) {
            let accounts = response.body || [];
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
    }
  }
};
