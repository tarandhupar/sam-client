import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies";
import { Router } from "@angular/router";
import { WatchlistType } from "./watchlist.service";

@Injectable()
export class WatchlistServiceMock {
  constructor() {}

  getByRecordId(watchlist : WatchlistType) {
    return Observable.of({});
    // let suffixPath = '/' + watchlist.domainId;
    // suffixPath = suffixPath + (watchlist.type ? ('/' + watchlist.type) : '');
    // suffixPath = suffixPath + '/' + watchlist.recordId;
    // let apiOptions: any = {
    //   name: 'watchlist',
    //   suffix: suffixPath,
    //   method: 'GET',
    //   oParam: { }
    // };
    //
    // this.addAuthHeader(apiOptions);
    // return this.apiService.call(apiOptions);
  }

  updateWatchlist(watchlist: WatchlistType) {
    return Observable.of({});
    // const apiOptions: any = {
    //   name: 'watchlist',
    //   suffix: '/' + watchlist.id,
    //   method: 'PUT',
    //   body: watchlist
    // };
    //
    // this.addAuthHeader(apiOptions);
    // return this.apiService.call(apiOptions);
  }

  createWatchlist(watchlist: WatchlistType) {
    return Observable.of({});
    // const apiOptions: any = {
    //   name: 'watchlist',
    //   suffix: '',
    //   method: 'POST',
    //   body: watchlist
    // };
    //
    // this.addAuthHeader(apiOptions);
    // return this.apiService.call(apiOptions)
    //   .catch(res => {
    //     if (res.status === 401 || res.status === 403 || res.status === 0) {
    //       this.router.navigate(['/signin']);
    //     }
    //     return Observable.throw(res);
    //   });
  }
}
