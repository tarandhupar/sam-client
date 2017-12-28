import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { IAMService } from 'api-kit';
import { User } from 'api-kit/iam/interfaces';

@Injectable()
export class FSDUserResolve implements Resolve<User> {
  constructor(private api: IAMService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return Observable.create(observer => {
      this.api.iam.fsd.user(route.params.id, user => {
        observer.next(user);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }
}
