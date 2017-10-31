import {Injectable} from '@angular/core';
import {WrapperService} from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';


@Injectable()
export class SavedSearchService {
    constructor(private oAPIService: WrapperService){}

    createSavedSearch(authToken: string, data: any) {
        let oApiParam = {
            name: 'savedSearch',
            suffix: '/',
            oParam: {},
            headers: {
                "X-Auth-Token": authToken
            },
            body: data,
            method: 'POST'
        };
        return this.oAPIService.call(oApiParam, false);
    }

    getAllSavedSearches(obj) {
        let oApiParam = {
            name: 'savedSearch',
            suffix: '/',
            oParam: {
              page: (obj.pageNum == undefined) ? '' : obj.pageNum,
              size: (obj.size == undefined) ? '' : obj.size,
              sortBy: (obj.sortBy == undefined) ? '' : obj.sortBy
            },
            headers: {
                "X-Auth-Token": obj.Cookie
            },
            method: 'GET'
        };

        if (obj['keyword']) {
          oApiParam['oParam']['keyword'] = obj['keyword'];
        }

        if (obj['domain']) {
          oApiParam['oParam']['domain'] = obj['domain'];
        }

        if (obj['saved_date']) {
          oApiParam['oParam']['saved_date'] = obj['saved_date'];
        }

        if (obj['saved_date.to']) {
          oApiParam['oParam']['saved_date.to'] = obj['saved_date.to'];
        }

        if (obj['saved_date.from']) {
          oApiParam['oParam']['saved_date.from'] = obj['saved_date.from'];
        }

        if (obj['last_ran_date']) {
          oApiParam['oParam']['last_ran_date'] = obj['last_ran_date'];
        }

        if (obj['last_ran_date.to']) {
          oApiParam['oParam']['last_ran_date.to'] = obj['last_ran_date.to'];
        }

        if (obj['last_ran_date.from']) {
          oApiParam['oParam']['last_ran_date.from'] = obj['last_ran_date.from'];
        }

        return this.oAPIService.call(oApiParam);
    }

    updateSavedSearch(authToken: string, id: string, data: any) {
        let oApiParam = {
            name: 'savedSearch',
            suffix: '/' + id,
            oParam: {},
            headers: {
                "X-Auth-Token": authToken
            },
            body: data,
            method: 'PUT'
        };
        return this.oAPIService.call(oApiParam);
    }

  updateSavedSearchUsage(authToken: string, id: string) {
    let oApiParam = {
      name: 'savedSearch',
      suffix: '/' + id + '/usage',
      oParam: {},
      headers: {
        "X-Auth-Token": authToken
      },
      method: 'POST'
    };
    return this.oAPIService.call(oApiParam);
  }

    getSavedSearch(authToken: string, id: string) {
        let oApiParam = {
            name: 'savedSearch',
            suffix: '/' + id,
            oParam: {},
            headers: {
                "X-Auth-Token": authToken
            },
            method: 'GET'
        };
        return this.oAPIService.call(oApiParam);
    }

    deleteSavedSearch(authToken: string, id:string) {
      let oApiParam = {
        name: 'savedSearch',
        suffix: '/' + id,
        oParam: {},
        headers: {
          "X-Auth-Token": authToken
        },
        method: 'DELETE'
      };
      return this.oAPIService.call(oApiParam, false);
    }
}
