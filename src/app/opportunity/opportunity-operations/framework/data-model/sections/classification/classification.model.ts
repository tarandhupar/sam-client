import * as _ from 'lodash';

export class OppClassificationViewModel {
  private _data: any;

  constructor(data) {
    this._data = data;
  }

  get setAsideType(): string {
    return _.get(this._data, 'solicitation.setAside', null);
  }

  set setAsideType(setAsidetype: string) {
    _.set(this._data, 'solicitation.setAside', setAsidetype);
  }

  get classificationCodeType(): string {
    return _.get(this._data, 'classificationCode', null);
  }

  set classificationCodeType(classificationCodeType: string) {
    _.set(this._data, 'classificationCode', classificationCodeType);
  }

  get naicsCodeTypes(): any {
    return _.get(this._data, 'naics', null);
  }

  set naicsCodeTypes(naicsCodeTypes: any) {
    _.set(this._data, 'naics', naicsCodeTypes);
  }
  get countryType(): string {
    return _.get(this._data, 'placeOfPerformance.country', null);
  }

  set countryType(countryType: string) {
    _.set(this._data, 'placeOfPerformance.country', countryType);
  }
  get stateType(): string {
    return _.get(this._data, 'placeOfPerformance.state', null);
  }

  set stateType(stateType: string) {
    _.set(this._data, 'placeOfPerformance.state', stateType);
  }
  get zip(): string {
    return _.get(this._data, 'placeOfPerformance.zip', null);
  }

  set zip(zip: string) {
    _.set(this._data, 'placeOfPerformance.zip', zip);
  }
  get city(): string {
    return _.get(this._data, 'placeOfPerformance.city', null);
  }

  set city(city: string) {
    _.set(this._data, 'placeOfPerformance.city', city);
  }
}
