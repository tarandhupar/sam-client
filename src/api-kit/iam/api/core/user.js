import { clone, merge } from 'lodash';

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
        items = [],
        item,
        intItem,
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

    for(intItem = 0; intItem < data.gsaRAC.length; intItem++) {
      item = data.gsaRAC[intItem];

      if(typeof item === 'string') {
        item = item.split('|');
        item = {
          system: item[0] || '',
          agency: item[1] || '',
          username: item[2] || '',
          importTimetamp: item[3] || '',
          role: item[4] || ''
        };
      }

      data.gsaRAC[intItem] = item;
    }

    return data;
  }
}

export default User;
