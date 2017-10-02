import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service'
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

@Injectable()
export class DictionaryService {

  dictionaries: any;

  constructor(private oAPIService: WrapperService){
    this.dictionaries = {};
  }

  public getProgramDictionaryById(ids: string, size: string = '', filterElementIds: string = '', keyword = '') {
    let oApiParam = {
        name: 'program',
        suffix: '/dictionaries',
        oParam: {
            ids: ids,
            size: size,
            filterElementIds: filterElementIds,
            keyword: keyword
        },
        method: 'GET'
    };

    var obj = this.oAPIService.call(oApiParam).map(data => {
       return this.processDictionariesData(data, 'program');
    });

    return obj;
  }

  processDictionariesData(data: any, domain: string){
    if (domain === 'program'){
      data = data._embedded.jSONObjectList;
    } else {
      data = data._embedded.dictionaries;
    }
    for(var dictionaryJSON of data) {
      if (domain === 'program') {
        dictionaryJSON = dictionaryJSON.content;
      }
      this.updateTreeNodes(dictionaryJSON.id, dictionaryJSON.elements, null);
      this.dictionaries[dictionaryJSON.id] = dictionaryJSON.elements;
    }
    return this.dictionaries;
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

  getOpportunityDictionary(ids: string) {
    let apiParam = {
      name: 'opportunity',
      suffix: '/dictionaries',
      oParam: {
        ids: ids
      },
      method: 'GET'
    };

    let obj = this.oAPIService.call(apiParam).map(data => {
      return this.processDictionariesData(data, 'opportunity');
    });
    return obj;
  }

  getContractOpportunityDictionary(ids: string) {
    let apiParam = {
      name: 'contractOpportunity',
      suffix: '/dictionaries',
      oParam: {
        ids: ids
      },
      method: 'GET'
    };

    let obj = this.oAPIService.call(apiParam).map(data => {
      return this.processDictionariesData(data, 'contractOpportunity');
    });
    return obj;
  }

  getWageDeterminationDictionary(ids: string) {
    let apiParam = {
      name: 'wageDetermination',
      suffix: '/dictionaries',
      oParam: {
        ids: ids
      },
      method: 'GET'
    };
    var obj = this.oAPIService.call(apiParam).map(data => {
      return this.processDictionariesData(data, 'wdol');
    });

    return obj;
  }

  filterDictionariesToRetrieve(dictionaries: string){
    return (_.difference(dictionaries.split(","), Object.keys(this.dictionaries))).join();
  }
}
