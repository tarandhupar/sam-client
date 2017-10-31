import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Subject, Observable } from 'rxjs';
import { isString, merge, pick, pickBy } from 'lodash';

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

interface Alert {
  type?: 'success' | 'info' | 'warning' | 'error',
  title?: string,
  message?: string,
}

@Injectable()
export class IAMService {
  private _emitter: Subject<User> = new Subject<User>();
  private store = {
    user: null as User
  };

  public iam;
  private _alert: Alert = {
    type: 'success',
    title: '',
    message: '',
  }

  constructor() {
    this.iam = new ApiService().iam;
  }

  setUser(user: User): void {
    this.store.user = user;
    this._emitter.next(user);
  }

  getUser(): Observable<User> {
    return this._emitter.asObservable();
  }

  get alert(): Alert {
    return this._alert;
  }

  set alert(alert: Alert) {
    alert = pick(pickBy(alert, isString), Object.keys(this._alert));
    this._alert = merge({
      type: 'success',
      title: '',
      message: '',
    }, alert);
  }
}
