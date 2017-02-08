import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { UserAccess } from './user.interface';

@Injectable()
export class UserService {

  constructor(private apiService: WrapperService) {

  }

  getAccess(userId: number): Observable<UserAccess> {
    let apiOptions: any = {
      name: 'access',
      suffix: '/' + userId,
      method: 'GET',
      oParam: { }
    };

    return this.apiService.call(apiOptions);
  }
}
