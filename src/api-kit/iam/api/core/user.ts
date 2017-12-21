import { clone, indexOf, isBoolean, merge } from 'lodash';
import { config, isDebug } from './modules/helpers';

import * as Cookies from 'js-cookie';
import * as moment from 'moment';

Cookies.defaults = config.cookies();

const LDAP_MAPPINGS = {
  // Reverse Mappings
  'uid':             '_id',
  'mail':            'email',
  'givenName':       'firstName',
  'surName':         'lastName',
  'telephoneNumber': 'workPhone',
};

const ROLE_MAPPINGS = {
  systemAccount: {
    matchAll: false,
    keys: [
      'system-accounts.admin',
      'system-accounts.manager',
      'system-accounts.migration',
    ],
  },

  systemAdmin: {
    matchAll: true,
    keys: [
      'system-accounts.admin',
    ],
  },

  systemApprover: {
    matchAll: true,
    keys: [
      'security.approver',
    ],
  },

  fsd: {
    matchAll: true,
    keys: [
      'fsd.profile',
      'fsd.kba',
      'fsd.deactivate',
      'fsd.passreset',
    ],
  },
};

export class User {
  public _id = '';
  public email = '';
  public firstName = '';
  public initials = '';
  public lastName = '';
  public suffix = '';
  public workPhone = '';
  public personalPhone = '';
  public OTPPreference = 'email';
  public isGov;
  public _links = {};

  public status = 'Active';
  public lastLogin = moment();

  public systemAccount = false;
  public systemAdmin = false;
  public systemApprover = false;
  public fsd = false;

  constructor(params) {
    params = params || {};
    this.set(this.reverseMappings(params));
  }

  set(user) {
    let roles = user.gsaRAC,
        role,
        config,
        mapping,
        setRoles = (() => {
          let role,
              roles;

          for(role in ROLE_MAPPINGS) {
            config = ROLE_MAPPINGS[role];

            if(config.keys) {
              this[role] = this.contains(this._links, config.keys, config.matchAll);
            }
          }
        });

    user = this.reverseMappings(user || {});

    // Legacy Department fallback
    if(user.department || user.departmentID) {
      user.departmentID = user.departmentID || user.departmentID;
    }

    merge(this, user, {
      emailNotification: this.toBoolean(user.emailNotification || 'no')
    });

    if(!this._id && this.email) {
      this._id = this.email;
    }

    this.suffix = (this.suffix || '').trim();

    setRoles();
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

    data._links = params._links || {};

    return data;
  }

  contains(haystack: { [key: string]: any }, needles: Array<string>, matchAll: boolean = true) {
    let needle,
        intNeedle,
        intMatches = 0;

    for(intNeedle = 0; intNeedle < needles.length; intNeedle++) {
      needle = needles[intNeedle];

      if(haystack[needle]) {
        intMatches++;
      }
    }

    return matchAll ? (intMatches == needles.length) : (intMatches > 0);
  }

  get fullName(): string {
    let fullName = [
      this.firstName || '',
      this.initials || '',
      this.lastName || '',
      this.suffix || '',
    ];

    return fullName
      .join(' ')
      .trim()
      .replace(/ +/g, ' ');
  }

  get phone(): string {
    let phone = this.workPhone || '';

    phone = phone.replace(/[^0-9]/g, '');
    phone = `${phone.length && phone.length < 11 ? '1' : ''}${phone}`;
    phone = phone.replace(/([0-9])([0-9]{3})([0-9]{3})([0-9]{4})/, '$1+($2)$3-$4');

    return phone;
  }

  get gov(): boolean {
    const orgID = (this['officeID'] || this['agencyID'] || this['departmentID'] || '').toString();
    return isBoolean(this.isGov) ? this.isGov : orgID.length > 0;
  }

  get entity(): boolean {
    //TODO
    return false;
  }

  static getCache(): { [key: string]: number|boolean|string } {
    return Cookies.getJSON('IAMSession');
  }

  static updateCache(data: { [key: string]: any }) {
    data = merge({}, Cookies.getJSON('IAMSession') || {}, data || {});
    Cookies.set('IAMSession', data, config.cookies());
  }
}
