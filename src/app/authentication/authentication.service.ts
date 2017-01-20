import { merge } from 'lodash';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  type: string,
  title?: string,
  message?: string,
  show: boolean
}

@Injectable()
export class AuthenticationService {
  private _notification: BehaviorSubject<Notification>;
  private store = {
    //TODO
  };

  constructor() {
    this._notification = <BehaviorSubject<Notification>>new BehaviorSubject({});
  }

  get notification() {
    return this._notification.asObservable();
  }

  notify(notification: Notification) {
    this._notification.next(
      merge({}, this.store).notification
    );
  }
}
