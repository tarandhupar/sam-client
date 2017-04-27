import * as _ from 'lodash';
import config from './config';
import utilities from './utilities';
import core from './core';

let utils = new utilities();

export class ApiService {
  iam;

  constructor() {
    _.extend(this, {
      config: config
    });

    this.bootstrap();
  }

  bootstrap() {
    this.iam = new core.iam(this);
  }

  isLocal() {
    return utils.isLocal();
  }

  getEnvironment() {
    return utils.getEnvironment();
  }
}
