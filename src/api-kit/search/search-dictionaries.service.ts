import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import {Observable, ReplaySubject} from "rxjs";

@Injectable()
export class SearchDictionariesService{

  constructor(private oAPIService: WrapperService){}

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
    this.oAPIService.call(oApiParam).subscribe(
      (res) => {
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
            }
            prev.push(newObj);
            return prev;
          }
        }, []));
      },
      (error) => {
          return error;
      }
    );
    return results;
  }


}
