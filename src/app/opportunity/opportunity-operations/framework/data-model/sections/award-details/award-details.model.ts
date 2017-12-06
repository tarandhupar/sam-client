import * as _ from 'lodash';

export class OppAwardDetailsViewModel {

  private _data: any;

  constructor(data) {
    this._data = data;
  }

  get awardNumber(): string {
    return _.get(this._data, 'award.number', null);
  }

  set awardNumber(number: string) {
    _.set(this._data, 'award.number', number);
  }

  get amount(): number {
    return _.get(this._data, 'award.amount', null);
  }

  set amount(value: number) {
    _.set(this._data, 'award.amount', value);
  }

  get lineItemNumber(): string {
    return _.get(this._data, 'award.lineItemNumber', null);
  }

  set lineItemNumber(value: string) {
    _.set(this._data, 'award.lineItemNumber', value);
  }

  get deliveryOrderNumber(): string {
    return _.get(this._data, 'award.deliveryOrderNumber', null);
  }

  set deliveryOrderNumber(number: string) {
    _.set(this._data, 'award.deliveryOrderNumber', number);
  }

  get awardeeDuns(): string {
    return _.get(this._data, 'award.awardee.duns', null);
  }

  set awardeeDuns(number: string) {
    _.set(this._data, 'award.awardee.duns', number);
  }

  get awardeeName(): string {
    return _.get(this._data, 'award.awardee.name', null);
  }

  set awardeeName(name: string) {
    _.set(this._data, 'award.awardee.name', name);
  }
}
