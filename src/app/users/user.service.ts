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
    }

    if (Cookie.get('superToken')) {
      return { uid: Cookie.get('superToken'), firstName: 'super', lastName: 'admin' };
    } else {
      throw new Error('User cookie missing');
    }
  }

  isLoggedIn(): boolean {
    return !!(Cookie.get('iPlantDirectoryPro') || Cookie.get('superToken'));
  }
}
