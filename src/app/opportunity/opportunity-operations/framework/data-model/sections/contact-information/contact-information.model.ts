import * as _ from 'lodash';

export class OppContactInfoViewModel {
  private _data: any;

  constructor(data) {
    this._data = data;
  }

  get primaryPOC(): any {
    let primary = _.find(this._data.pointOfContact, (poc) => {
      return poc.type === 'primary';
    });

    return primary || null;
  }

  get secondaryPOC(): any {
    let secondary = _.find(this._data.pointOfContact, (poc) => {
      return poc.type === 'secondary';
    });

    return secondary || null;
  }

  set pointOfContact(pocs: any[]) {
    if (pocs && pocs.length === 0) {
      pocs = null;
    }

    _.set(this._data, 'pointOfContact', pocs);
  }
}
