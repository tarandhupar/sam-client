'use strict';
export class CMSMapping  {
  statusMapping = {
    'NEW':1,
    'PUBLISHED':2,
    'DRAFT':3,
    'ARCHIVED':4
  };

  constructor(){}

  getStatusId (statusName) {
    return this.statusMapping[statusName];
  }

  getStatusName (statusId) {
    let statusName = '';
    Object.keys(this.statusMapping).forEach( key => {
      if(this.statusMapping[key] == statusId) statusName = key;
    });
    return statusName;
  }

};
