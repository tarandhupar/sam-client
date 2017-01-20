import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

import { ApiService } from './api';

export interface User {
  _id: string,
  email: string,

  title?: string,
  suffix?: string,

  fullName: string,
  middleName?: string,

  firstName: string,
  initials: string,
  lastName: string,

  homePhone?:string,
  workPhone?: string,
  mobile?: string,
  phoneExtension?: string,

  businessName?: string,

  address1Street?: string,
  address1City?: string,
  address1Country?: string,
  address1State?: string,
  address1Type?: string,
  address1Zip?: string,

  address2Street?: string,
  address2City?: string,
  address2Country?: string,
  address2State?: string,
  address2Type?: string,
  address2Zip?: string,

  department?: string,
  orgID?: string,

  gsaRAC?: any[],

  userPassword: string,
  accountClaimed: boolean,
}

@Injectable()
export class IAMService {
  private _user: BehaviorSubject<User>;
  private store = {

  };

  public iam;

  constructor() {
    this.iam = new ApiService().iam;
    this._user = <BehaviorSubject<User>>new BehaviorSubject({});
  }

  get user() {
    return this._user.asObservable();
  }
}
