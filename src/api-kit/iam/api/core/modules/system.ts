import { merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug
} from './helpers';

export const system = {
  account: {
    get(success, error) {
      let core = this,
          id = Cookies.get('IAMSystemAccount'),
          auth = getAuthHeaders(),
          endpoint = utilities.getUrl(config.system.account.get, { id: id });

      success = success || ((response) => {});
      error = error || ((error) => {});

      if(auth && id) {
        request
          .get(endpoint)
          .set(auth)
          .end(function(err, response) {
            if(err) {
              error(exceptionHandler(response.body));
            } else {
              success(response.body || {});
            }
          });
      } else {
        error(exceptionHandler({}));
      }
    },

    create(account, success, error) {
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

      success = success || ((response) => {});
      error = error || ((error) => {});

      if(auth) {
        request
          .post(endpoint)
          .set(auth)
          .send(data)
          .end(function(err, response) {
            if(err) {
              error(exceptionHandler(response.body));
            } else {
              let account = response.body || {};

              Cookies.set('IAMSystemAccount', account._id, config.cookies);
              success(account);
            }
          });
      } else {
        error(exceptionHandler({}));
      }
    },

    update(account, success, error) {
      let core = this,
          id = Cookies.get('IAMSystemAccount'),
          endpoint = utilities.getUrl(config.system.account.update, { id: id }),
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

      success = success || ((response) => {});
      error = error || ((error) => {});

      if(auth && id) {
        request
          .put(endpoint)
          .set(auth)
          .send(data)
          .end(function(err, response) {
            if(err) {
              error(exceptionHandler(response.body));
            } else {
              success(response.body || {});
            }
          });
      } else {
        error(exceptionHandler({}));
      }
    }
  }
};
