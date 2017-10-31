
import * as request from 'superagent';
import { defaults, merge } from 'lodash';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  transformMigrationAccount,
  logger, isDebug
} from './helpers';

import { getMockCWSApplication, getMockCWSSummary } from './mocks';
import { CWSApplication } from '../../../interfaces';

const transforms = {
  intake(data: CWSApplication) {
    let keys = ('contractOpportunities|contractData|entityInformation|systemAdmins|systemManagers').split('|'),
        key,
        index,
        defaults = {};

    // Temporary property use
    if(data.interfacingSystemName) {
      data.statuses = data.interfacingSystemName.split(',').map(status => parseInt(status));
    }

    for(index = 0; index < keys.length; index++) {
      key = keys[index];
      data[key] = data[key] ? data[key].split(',') : [];
    }

    data.applicationStatus = data.applicationStatus || 'Draft';

    return data;
  },

  outake(data: CWSApplication) {
    let keys = ('contractOpportunities|contractData|entityInformation|systemAdmins|systemManagers|statuses').split('|'),
        key,
        index;

    for(index = 0; index < keys.length; index++) {
      key = keys[index];

      if(data[key]) {
        data[key] = data[key].join(',');
      }
    }

    // Temporary property use
    if(data.statuses && typeof data.statuses === 'string') {
      data.interfacingSystemName = data.statuses;
      delete data.statuses;
    }

    return data;
  }
};

const application = {
  get(id: string, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.get, { id: id }),
        auth = getAuthHeaders(),
        mock = transforms.intake(getMockCWSApplication(id));

    if(isDebug()) {
      $success(mock);
      return;
    }

    if(!id) {
      $error({ message: 'Requires application `id`' });
      return;
    }

    if(!auth) {
      $error({ message: 'Please sign in' });
      return;
    }

    request
      .get(endpoint)
      .set(auth)
      .then(response => {
        !response.body ? $error(exceptionHandler(response)) : $success(transforms.intake(response.body));;
      }, response => {
        $error(exceptionHandler(response));
      });
  },

  getAll($success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.get.replace(/\/\{id\}/, '')),
        auth = getAuthHeaders(),
        mock = [
          transforms.intake(getMockCWSApplication(1)),
          transforms.intake(getMockCWSApplication(2)),
          transforms.intake(getMockCWSApplication(3)),
        ];

    if(isDebug()) {
      $success(mock);
      return;
    }

    if(!auth) {
      $error({ message: 'Please sign in' });
      return;
    }

    request
      .get(endpoint)
      .set(auth)
      .then(response => {
        let applications = response.body || [];
        applications = applications.map(application => transforms.intake(application));
        $success(applications);
      }, response => {
        $error(exceptionHandler(response));
      });
  },

  create(data: CWSApplication, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.create),
        auth = getAuthHeaders(),
        params = transforms.outake(data);

    delete params.uid;

    if(logger(data)) {
      data = merge({ uid: 1 }, transforms.intake(data));
      $success(data);
      return;
    }

    if(!auth) {
      $error({ message: 'Please sign in' });
      return;
    }

    request
      .post(endpoint)
      .set(auth)
      .send(params)
      .then(response => {
        $success(transforms.intake(response.body || {}));
      }, response => {
        $error(exceptionHandler(response));
      });
  },

  update(id: string, data: CWSApplication, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.update, { id: id }),
        auth = getAuthHeaders(),
        params = transforms.outake(data);

    if(logger(data)) {
      $success(transforms.intake(data));
      return;
    }

    if(!id) {
      $error({ message: 'Requires application `id`' });
      return;
    }

    if(!auth) {
      $error({ message: 'Please sign in' });
      return;
    }

    request
      .put(endpoint)
      .set(auth)
      .send(params)
      .then(response => {
        $success(transforms.intake(response.body || {}));
      }, response => {
        $error(exceptionHandler(response));
      });
  },

  delete(id: string, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.update, { id: id }),
        auth = getAuthHeaders();

    if(!id) {
      $error({ message: 'Requires application `id`' });
      return;
    }

    if(!auth) {
      $error({ message: 'Please sign in' });
      return;
    }

    if(!isDebug()) {
      request
        .delete(endpoint)
        .set(auth)
        .responseType('text')
        .end((error, response) => {
          if(response == undefined && error) {
            $success();
          } else {
            error ? $error(exceptionHandler(response)) : $success();
          }
        });
    } else {
      $success();
    }
  },

  approve(data: CWSApplication, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.approve),
        auth = getAuthHeaders(),
        id = data.uid,
        params = data || {};

    if(!id) {
      $error({ message: 'Requires `uid` in the application object' });
      return;
    }

    this.update(id, data, $success, $error);
  },

  reject(data: CWSApplication, $success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.application.reject),
        auth = getAuthHeaders(),
        id = data.uid,
        params = data || {};

    if(!id) {
      $error({ message: 'Requires `uid` in the application object' });
      return;
    }

    this.update(id, data, $success, $error);
  }
};


export const cws = {
  application,

  status($success: Function = () => {}, $error: Function = () => {}) {
    let endpoint = utilities.getUrl(config.cws.status),
        auth = getAuthHeaders(),
        mock = getMockCWSSummary();

    if(isDebug()) {
      $success(mock);
      return;
    }

    if(!auth) {
      $error({ message: 'Please sign in' });
      return;
    }

    request
      .get(endpoint)
      .set(auth)
      .then(response => {
        $success(merge({
          pending: 0,
          approved: 0,
          rejected: 0,
          cancelled: 0,
        }, response.body));
      }, response => {
        $error(exceptionHandler(response));
      });
  },
};
