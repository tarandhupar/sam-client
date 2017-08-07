import { Injectable } from "@angular/core";
import { Cookie } from "ng2-cookies";

@Injectable()
export class UserService {
  constructor() {}

  getUser() {
    let cookie = Cookie.get('IAMSession');
    if (cookie) {
      let u = Cookie.get('IAMSession');
      let uo;
      try {
        uo = JSON.parse(u);
      } catch(e) {
        throw new Error('user cookie invalid');
      }

      return uo;
    } else {
      throw new Error('User cookie missing');
    }
  }
}
