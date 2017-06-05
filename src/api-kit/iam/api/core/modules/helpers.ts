import { isObject, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as moment from 'moment';

import $config from '../../config';
import utilities from '../../utilities';

const config = merge({}, $config.endpoints.iam),
      utils = new utilities({
        baseUri: `${API_UMBRELLA_URL}/iam`
      });

export { config };
export { utils as utilities };

export function getAuthHeaders() {
  return Cookies.get('iPlanetDirectoryPro') ? { 'iPlanetDirectoryPro': Cookies.get('iPlanetDirectoryPro') } : false;
}

export function getParam(key) {
  return utils.queryparams[key] || false;
};

export function exceptionHandler(responseBody) {
  return merge({
    status: 'error',
    message: 'Sorry, an unknown server error occured. Please contact the Help Desk for support.'
  }, responseBody);
};

export function isDebug() {
  return (utils.isLocal() && (utils.queryparams.debug !== undefined || false)) ||
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
