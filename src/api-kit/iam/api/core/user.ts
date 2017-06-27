import { clone, indexOf, merge, values } from 'lodash';
import { isDebug } from './modules/helpers';

import * as moment from 'moment';

const LDAP_MAPPINGS = {
  'dn':               'dn',
  'cn':               'fullName',
  'sn':               'lastName',
  'givenName':        'firstName',
  'mobilePhone':      'mobilePhoneNumbers',
  'phone':            'workPhone',
  'mail':             'email',
  'uid':              '_id'
};

const ROLE_MAPPINGS = {
  systemAccount: 'GSA_IAM_CWS_SFA_R_SrvAcct',
  fsd:           'FSD_Agent'
};

export class User {
  public _id = '';
  public email = '';
  public firstName = '';
  public initials = '';
  public lastName = '';

  public status: 'Active';
  public lastLogin = moment();

  constructor(params) {
    params = params || {};
    this.set(this.reverseMappings(params));
  }

  set(user) {
    let roles = user.gsaRAC,
        role,
        mapping;

    user = this.reverseMappings(user || {});

    merge(this, user, {
      emailNotification: this.toBoolean(user.emailNotification || 'no')
    });

    if(!this._id && this.email) {
      this._id = this.email;
    }

    // Map Roles Array
    for(role in ROLE_MAPPINGS) {
      mapping = ROLE_MAPPINGS[role];
      this[role] = indexOf(roles, mapping) > -1 ? true : false;
    }
  }

  toBoolean(value) {
    let result = false;

    switch(value) {
      case 'yes':
        result = true;
        break;
    }

    return result;
  }

  reverseMappings(params) {
    let mappings = LDAP_MAPPINGS,
        $key,
        key,
        items = [],
        item,
        intItem,
        data: any = {};

    params = params || {};

    for(key in params) {
      if(mappings[key]) {
        $key = mappings[key];

        // Reverse Mapping is only needed if the target mapping is not available in the source
        if(!params[mappings[key]]) {
          data[$key] = params[key];
        }
      } else {
        data[key] = params[key];
      }
    }

    data.gsaRAC = data.gsaRAC || [];

    if(isDebug()) {
      data.gsaRAC = values(ROLE_MAPPINGS);
    }

    return data;
  }

  get fullName(): string {
    let fullName = [
      this.firstName || '',
      this.initials || '',
      this.lastName || ''
    ];

    return fullName.join(' ').trim();
  }
}
