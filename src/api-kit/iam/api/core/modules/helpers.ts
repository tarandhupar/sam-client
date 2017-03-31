import { isObject, merge } from 'lodash';
import * as Cookies from 'js-cookie';

import $config from '../../config';
import utilities from '../../utilities';

const config = merge({}, $config.endpoints.iam),
      utils = new utilities({
        localResource: config.localResource,
        remoteResource: config.remoteResource
      });

export { config };
export { utils as utilities };

export function getAuthHeaders() {
  return Cookies.get('iPlanetDirectoryPro') ? { 'iPlanetDirectoryPro': Cookies.get('iPlanetDirectoryPro') } : false;
}

export function exceptionHandler(responseBody) {
  return merge({
    status: 'error',
    message: 'Sorry, an unknown server error occured. Please contact the Help Desk for support.'
  }, responseBody);
};

export function isDebug() {
  let isDebug = (utils.queryparams.debug !== undefined || false);
  return (utils.isLocal() && isDebug);
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
