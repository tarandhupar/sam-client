import { Directive, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AutocompleteService } from 'sam-ui-kit/form-controls/autocomplete/autocomplete.service';
import { UserAccessService } from "../../../api-kit/access/access.service";

@Injectable()
export class RMSUserServiceImpl implements AutocompleteService {

  constructor(private userAccessService: UserAccessService) {
    console.log('user serivce');
  }

  getAllRMSUsers(q:string): ReplaySubject<any> {
    const results = new ReplaySubject();
    this.userAccessService.getUserAutoComplete(q).subscribe(
      (res) => {
        results.next(res.reduce( (prev, curr) => {
          const newObj = {
            key: curr.email,
            value: `${curr.firstName} ${curr.lastName} (${curr.email })`
          };
          prev.push(newObj);
          return prev;
        }, []));
      }
    );
    return results;
  }

  setFetchMethod(_?: any): any {}

  fetch(val: string, pageEnd: boolean, searchOptions?: any): Observable<any> {
    return this.getAllRMSUsers(val);
  }
}

@Directive({
  selector: 'sam-autocomplete[rmsusers]',
  providers: [
    {provide: AutocompleteService, useClass: RMSUserServiceImpl}
  ]
})
export class SamRMSUsersServiceAutoDirective {
  constructor() { console.log('user dir'); }
}
