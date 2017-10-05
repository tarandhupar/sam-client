import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';


@Injectable()
export class LoginService {
  private login = new Subject<Object>();
  loginEvent$ = this.login.asObservable();
  constructor() {}

  triggerLogin(){
    this.login.next();
  }

}
