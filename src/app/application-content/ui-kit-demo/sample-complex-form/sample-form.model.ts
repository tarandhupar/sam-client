import * as _ from 'lodash';

//  TODO:  If view model exceeds 250 LOC, abstract out different sections to preserve readability
export class SampleFormViewModel {
  private _id: string;
  private _fal: any;
  private _data: any;

  constructor(fal) {
    this._fal = fal ? fal : {};
    this._data = (fal && fal.data) ? fal.data : {};
  }
  
  set id(id: string) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get isNew() {
    return this._id == null || typeof this._id === 'undefined';
  }
}
