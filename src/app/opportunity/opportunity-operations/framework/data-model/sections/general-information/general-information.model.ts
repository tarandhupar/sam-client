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
      archiveDate = this._data.archive.date.substr(0, this._data.archive.date.indexOf('T'));

    return archiveDate;
  }

  set archiveDate(archiveDate){
    let time = this.archiveTime;
    if (time == ''){
      time = '00:00'
    }
    let dateTime = archiveDate + 'T' + time;
    _.set(this._data, 'archive.date', dateTime);
  }

  get archiveTime() {
    let archiveDate = '';
    if(this._data.archive && this._data.archive.date)
      archiveDate = this._data.archive.date.substr(this._data.archive.date.indexOf('T'), this._data.archive.date.length);

    return archiveDate;
  }

  set archiveTime(archiveTime){
    let date = this.archiveDate;
    if (date == ''){
      date = '0000-00-00'
    }
    let dateTime = date + 'T' + archiveTime;
    _.set(this._data, 'archive.date', dateTime);
  }

  get vendorCDIvl(){
    if(this._data.permissions && this._data.permissions.ivl) {
      if(this._data.permissions.ivl.create === true && this._data.permissions.ivl.update === true && this._data.permissions.ivl.delete === true) {
        return 'yes';
      }
      if(this._data.permissions.ivl.create === false && this._data.permissions.ivl.update === false && this._data.permissions.ivl.delete === false) {
        return 'no';
      }
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
    if(this._data.permissions && this._data.permissions.ivl) {
      if(this._data.permissions.ivl.read === true) {
        return 'yes';
      }
      if(this._data.permissions.ivl.read === false) {
        return 'no';
      }
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

  get addiReportingTypes() {
    return _.get(this._data, 'flags', null);
  }

  set addiReportingTypes(addiReportingOption) {
    _.set(this._data, 'flags', addiReportingOption);
  }
}
