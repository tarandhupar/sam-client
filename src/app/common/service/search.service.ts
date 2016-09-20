import { Component, Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { InputTypeConstants } from '../constants/input.type.constants.ts';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class SearchService {

    constructor(private http:Http) { }

    runSearch(obj) {
      //todo, move search url to env configuration
      return this.http.get(`http://gsaiae-samdotgov-search-api-dev02.reisys.com/v1/search?index=${obj.index}&q=${obj.keyword}&page=${obj.pageNum}`).map((res:Response) => res.json());
    }

}
