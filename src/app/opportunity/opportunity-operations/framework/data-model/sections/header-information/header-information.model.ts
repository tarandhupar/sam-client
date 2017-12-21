import * as _ from 'lodash';

export class OppHeaderInfoViewModel {

  private _data: any;

  constructor(data) {
    this._data = data;
  }

  get office(): string {
    return _.get(this._data, 'organizationId', null);
  }

  set office(office: string) {
    _.set(this._data, 'organizationId', office);
  }

  get opportunityType(): string {
    return _.get(this._data, 'type', null);
  }

  set opportunityType(type: string) {
    _.set(this._data, 'type', type);
  }

  get noticeNumber(): string {
    return _.get(this._data, 'solicitationNumber', null);
  }

  set noticeNumber(id: string) {
    _.set(this._data, 'solicitationNumber', id);
  }
}
