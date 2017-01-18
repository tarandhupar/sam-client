import { merge } from 'lodash';

const LDAP_MAPPINGS = {
  'dn':               'dn',
  'cn':               'fullName',
  'sn':               'lastName',
  'givenName':        'firstName',
  'mobilePhone':      'mobilePhoneNumbers',
  'mail':             'email',
  'uid':              '_id'
};

class User {
  constructor(params) {
    params = params || {};
    this.set(this.reverseMappings(params));
  }

  set(user) {
    user = this.reverseMappings(user || {});
    merge(this, user);
  }

  reverseMappings(params) {
    let mappings = LDAP_MAPPINGS,
        $key,
        key,
        data = {};

    params = params || {};

    for(key in params) {
      if(mappings[key]) {
        $key = mappings[key];
        data[$key] = params[key];
      } else {
        data[key] = params[key];
      }
    }

    return data;
  }
}

export default User;
