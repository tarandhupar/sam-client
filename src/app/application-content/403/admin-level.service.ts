import { Injectable } from "@angular/core";
import { Cookie } from "ng2-cookies";
import {Observable} from "rxjs";
import {UserAccessService} from "api-kit/access/access.service";

@Injectable()
export class AdminLevelService {
  constructor(
    private accessService: UserAccessService
  ) { }

  getLevel(): Observable<number> {
    return this.accessService.getAdminLevel()
      .map(res => {
        return res.adminLevel;
      })
      .catch(err => {
        return Observable.of(2);
      });
  }
}
