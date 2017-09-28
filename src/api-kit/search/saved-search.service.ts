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
        return this.oAPIService.call(oApiParam);
    }

    getAllSavedSearches(obj){
        let oApiParam = {
            name: 'savedSearch',
            suffix: '/',
            oParam: {
              page: (obj.pageNum == undefined) ? '' : obj.pageNum,
              size: (obj.size == undefined) ? '' : obj.size,
              sort: (obj.sort == undefined) ? '' : obj.sort
            },
            headers: {
                "X-Auth-Token": obj.Cookie
            },
            method: 'GET'
        };
        return this.oAPIService.call(oApiParam);
    }

    updateSavedSearch(authToken: string, id: string, data: any){
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

    getSavedSearch(authToken: string, id: string){
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
}
