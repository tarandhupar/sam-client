import { Injectable } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { IAMService } from "../../api-kit/iam/iam.service";

@Injectable()
export class UserService {
  constructor(private api: IAMService) {}

  getUser() {
    if(this.isLoggedIn()) {
      if(Cookie.get('IAMSession')) {
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
      }
    } else {
      throw new Error('User cookie missing');
    }
  }

  isLoggedIn(): boolean {
    return !!(this.api.iam.user.isSignedIn() || Cookie.get('superToken'));
  }
}
