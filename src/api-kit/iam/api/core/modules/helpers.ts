import { isObject, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as moment from 'moment';

import $config from '../../config';
import utilities from '../../utilities';

const config = merge({}, $config.endpoints.iam),
      utils = new utilities({
        baseUri: `${API_UMBRELLA_URL}/iam`
      });

Cookies.defaults = config.cookies();

export { config };
export { utils as utilities };

export function getAuthHeaders() {
  return Cookies.get('iPlanetDirectoryPro') ? { 'iPlanetDirectoryPro': Cookies.get('iPlanetDirectoryPro') } : false;
}

export function getParam(key) {
  return utils.queryparams[key] || false;
};

export function exceptionHandler(response) {
  let defaults = {
        status: 'error',
        message: 'Sorry, an unknown server error occured. Please contact the Help Desk for support.'
      },

      body = {};

  if(isObject(response)) {
    response = isObject(response.response) ? response.response : response;

    if(response.message) {
      // If `response` is the body
      body = response;
    } else {
      body = response.body || {};

      if(response.timeout) {
        body['message'] = 'The server timed out';
      }
    }
  }

  return merge({}, defaults, body);
};

export function isDebug() {
  return (utils.isLocal() && (utils.queryparams['debug'] !== undefined || false)) ||
         (ENV && ENV == 'test');
};

export function sanitizeRequest(data) {
  data = isObject(data) ? data : {};

  Object.keys(data).forEach(key => {
    if(!data[key]) {
      delete data[key];
    }
  });

  return data;
};

export function logger(dump) {
  if(isDebug()) {
    console.log(dump);
    return true;
  } else {
    return false;
  }
}

export function transformMigrationAccount(account) {
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
  account.migratedAt = (account.claimedTimestamp ? moment(account.claimedTimestamp) : moment()).format('YYYY-MM-DD, hh:mm A');

  return account;
}
