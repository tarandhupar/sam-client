import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class SearchService {

    constructor(private oAPIService: APIService) {
      console.log('Search Service started.....');
    }

    runSearch(obj) {
      // //todo, move search url to env configuration
      // return this.http.get(`http://gsaiae-samdotgov-search-api-dev02.reisys.com/v1/search?index=${obj.index}&q=${obj.keyword}&page=${obj.pageNum}`).map((res:Response) => res.json());
      console.log(obj);
      let oApiParam = {
        name: 'search',
        suffix: '/',
        oParam: {
          index: obj.index,
          q: obj.keyword,
          page: obj.pageNum
        },
        method: 'GET'
      };

      return this.oAPIService.call(oApiParam);
    }

}
