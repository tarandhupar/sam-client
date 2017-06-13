import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { WrapperService } from '../wrapper/wrapper.service';
import 'rxjs/add/operator/map';


@Injectable()
export class PeoplePickerService {
    constructor(private oAPIService: WrapperService) {}

    getList(obj) {
        let oApiParam = {
            name: 'userPicker',
            suffix: '/',
            oParam: {
            q: obj.keyword,
            qFilters: {}
            },
            method: 'GET'
        };

        return this.oAPIService.call(oApiParam);
    }

    getPerson(email, obj) {
        let oApiParam = {
            name: 'userPicker',
            suffix: '/'+email,
            oParam: {
            },
            method: 'GET'
        };

        return this.oAPIService.call(oApiParam);
    }

    getFilteredList(obj){
        let oApiParam = {
            name: 'userPicker',
            suffix: '/filter',
            oParam: {
            },
            method: 'GET'
        };
        if(typeof obj.firstName !== 'undefined' && obj.firstName !== null && obj.firstName !== '') {
            oApiParam.oParam['firstName'] = obj.firstName;
        }
        if(typeof obj.email !== 'undefined' && obj.email !== null && obj.email !== '') {
            oApiParam.oParam['email'] = obj.email;
        }
        if(typeof obj.lastName !== 'undefined' && obj.lastName !== null && obj.lastName !== '') {
            oApiParam.oParam['lastName'] = obj.lastName;
        }
        /*
        //this should replace firstName and lastName
        if(typeof obj.givenName !== 'undefined' && obj.givenName !== null && obj.givenName !== '') {
            oApiParam.oParam['givenName'] = obj.lastName;
        }
        */

        return this.oAPIService.call(oApiParam);
    }

}
