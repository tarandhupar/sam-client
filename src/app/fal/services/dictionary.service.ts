import {Injectable} from '@angular/core';
import {APIService} from '../../common/service/api/api.service'
import 'rxjs/add/operator/map';

@Injectable()
export class DictionaryService {

  constructor(private oAPIService: APIService){}

  public getDictionaryById(id: string) {
    console.log("inside dictionary.service getDictionaryById");
    console.log("id: ", id);
    let oApiParam = {
        name: 'dictionary',
        suffix: '',
        oParam: {
            ids: id
        },
        method: 'GET'
    };

    console.log("oApiParam: ", oApiParam);
    var obj = this.oAPIService.call(oApiParam).map(data => {
        console.log("data (from apiservice): ", data);
        data = data._embedded.jSONObjectList;
        var dictionary = {};
        for(var dictionaryJSON of data) {
            dictionaryJSON = dictionaryJSON.content;
            this.updateTreeNodes(dictionaryJSON.id, dictionaryJSON.elements, null);
            dictionary[dictionaryJSON.id] = dictionaryJSON.elements;
        };

        console.log("dictionary (returning this, inside map)", dictionary);
        return dictionary;
    });

    console.log("returning obj from getDictionaryById method");
    return obj;
  }

  private updateTreeNodes(dictionaryName:any, elements:any, parent:any) {
    for(var item of elements){
        if(item.elements) {
            this.updateTreeNodes(dictionaryName, item.elements, item);
        }

        item.parent = parent;
        item.displayValue = this.formatDisplayValue(dictionaryName, item);
    }
  }

    //  TODO: Review implementation
  private formatDisplayValue(dictionaryName:any, item:any) {
    switch(dictionaryName) {
        case "functional_codes":
            return (item.parent ? item.parent.value + " - " : "")  + item.code + " " + item.value;
        default:
            return item.code + " - " + item.value;
    }
  }
}
