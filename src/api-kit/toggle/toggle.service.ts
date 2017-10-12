import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies";
import { Router } from "@angular/router";

@Injectable()
export class ToggleService{
  constructor(private apiService: WrapperService, private router:Router) {}
  getToggleStatus(key: string,appContext: string) {
    let apiParam = {
      name: 'gettoggeServices',
      prefix: appContext,
      suffix:  '/read/' + key ,
      oParam: {},
      method: 'GET'
   };
    return this.apiService.call(apiParam);
  }
}
