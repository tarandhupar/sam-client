import * as _ from 'lodash';

export class OppGeneralInfoViewModel {

  private _data: any;

  constructor(data) {
    this._data = data;
  }

  get archiveType() {
    let archiveType = '';
    if(this._data.archive && this._data.archive.type)
      archiveType = this._data.archive.type;

    return archiveType;
  }

  set archiveType(type){
    _.set(this._data, 'archive.type', type);
  }

  get archiveDate() {
    let archiveDate = '';
    if(this._data.archive && this._data.archive.date)
      archiveDate = this._data.archive.date;

    return archiveDate;
  }

  set archiveDate(archiveDate){
    _.set(this._data, 'archive.date', archiveDate);
  }

  get vendorCDIvl(){
    if(this._data.permissions && this._data.permissions.ivl && this._data.permissions.ivl.create && this._data.permissions.ivl.update && this._data.permissions.ivl.delete) {
      if(this._data.permissions.ivl.create == true && this._data.permissions.ivl.update == true && this._data.permissions.ivl.delete == true) {
        return 'yes';
      }
      return 'no';
    }

    return null;
  }

  set vendorCDIvl(vendorOption){
    let flag = false;
    if(vendorOption == 'yes') {
      flag = true;
    }
    _.set(this._data, 'permissions.ivl.create', flag);
    _.set(this._data, 'permissions.ivl.update', flag);
    _.set(this._data, 'permissions.ivl.delete', flag);
  }

  get vendorViewIvl() {
    if(this._data.permissions && this._data.permissions.ivl && this._data.permissions.ivl.read) {
      if(this._data.permissions.ivl.read == true) {
        return 'yes';
      }
      return 'no';
    }

    return null;
  }

  set vendorViewIvl(vendorOption) {
    let flag = false;
    if(vendorOption == 'yes') {
      flag = true;
    }

    _.set(this._data, 'permissions.ivl.read', flag);
  }
}
