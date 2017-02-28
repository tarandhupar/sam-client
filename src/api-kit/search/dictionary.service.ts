import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {WrapperService} from "../wrapper/wrapper.service";
/**
 * Created by michael.kellogg on 2/27/17.
 */

@Injectable()
export class SearchDictionaryService {
  private params = new Subject<Object>();
  paramsUpdated$ = this.params.asObservable();
  constructor(private oAPIService: WrapperService) {}

  getDictionaryDataById(obj) {
    console.log('this is the object we receive inside the dictionary service ' + obj.ids)
    let oApiParam = {
      name: 'dictionaries',
      suffix: '/',
      oParam: {
        ids: obj.ids
      },
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);


  }

}
