import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies";
import { Router } from "@angular/router";

export type WatchlistType = {
  active?: string,
  id?: number,
  domainId?: string,
  type: string
  frequency?: string,
  recordId?: string,
  uri? :string
} 

@Injectable()
export class WatchlistService {
  constructor(private apiService: WrapperService, private router:Router) {}

  getByRecordId(watchlist : WatchlistType) {
    let suffixPath = '/' + watchlist.domainId;
    suffixPath = suffixPath + (watchlist.type ? ('/' + watchlist.type) : '');
    suffixPath = suffixPath + '/' + watchlist.recordId;
    let apiOptions: any = {
      name: 'watchlist',
      suffix: suffixPath,
      method: 'GET',
      oParam: { }
    };

    this.addAuthHeader(apiOptions);
    return this.apiService.call(apiOptions);
 }

  updateWatchlist(watchlist: WatchlistType) {
    const apiOptions: any = {
      name: 'watchlist',
      suffix: '/' + watchlist.id,
      method: 'PUT',
      body: watchlist
    };

    this.addAuthHeader(apiOptions);
    return this.apiService.call(apiOptions);
  }

  createWatchlist(watchlist: WatchlistType) {
    const apiOptions: any = {
      name: 'watchlist',
      suffix: '',
      method: 'POST',
      body: watchlist
    };

    this.addAuthHeader(apiOptions);
    return this.apiService.call(apiOptions)
          .catch(res => {
        if (res.status === 401 || res.status === 403 || res.status === 0) {
          this.router.navigate(['/signin']);
        }
        return Observable.throw(res);
      });
  }

  addAuthHeader(options) {
    let iPlanetCookie = Cookie.getAll().iPlanetDirectoryPro;

    if (!iPlanetCookie) {
      return;
    }

    options.headers = options.headers || {};
    options.headers['X-Auth-Token'] = iPlanetCookie;
  }

}
