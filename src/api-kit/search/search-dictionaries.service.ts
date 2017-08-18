import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import {Observable, ReplaySubject} from "rxjs";
import * as _ from 'lodash';

@Injectable()
export class SearchDictionariesService{

  searchDictionaries:any;

  constructor(private oAPIService: WrapperService){
    this.searchDictionaries = {};
  }

  dunsEntityAutoSearch(q: string) {
    let oApiParam = {
      name: 'searchDictionaries',
      suffix: '/entities',
      oParam: {
        'query': q + '*',
      },
      method: 'GET'
    };
    return this.oAPIService.call(oApiParam);
  };


  dunsPersistGrabber(q: string){
    const results = new ReplaySubject();
    let oApiParam = {
      name: 'searchDictionaries',
      suffix: '/entities',
      oParam: {
        'ids': q,
      },
      method: 'GET'
    };
    if (q =='' && !_.isEmpty(this.searchDictionaries)){
      this.processResults(this.searchDictionaries, results, q)
    } else {
      this.oAPIService.call(oApiParam).subscribe(
        (res) => {
          if (q == ''){
            this.searchDictionaries = res;
          }
          this.processResults(res, results, q)
        },
        (error) => {
          return error;
        }
      );
    }
    return results;
  }

  processResults(res, results, q){
    results.next(res._embedded.dictionaries[0].elements.reduce((prev, curr) => {
      // if the duns number in the current item doesn't match any in the url string don't include it in the results
      if(q.indexOf(curr.elementId) === -1){
        return prev;
      }
      // otherwise push our newly created obj into prev
      else{
        const newObj = {
          value: curr.elementId,
          label: curr.value + "(" + curr.elementId + ")"
        };
        prev.push(newObj);
        return prev;
      }
    }, []));
  }

}
