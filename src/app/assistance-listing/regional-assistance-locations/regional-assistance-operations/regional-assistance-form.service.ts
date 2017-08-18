import {Injectable} from '@angular/core';
import * as Cookies from 'js-cookie';
import {ProgramService} from "../../../../api-kit/program/program.service";
import {DictionaryService} from "../../../../api-kit/dictionary/dictionary.service";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {Observable} from "rxjs/Observable";



@Injectable()

export class RAOFormService {

  constructor(private programService: ProgramService, private dictionaryService: DictionaryService, private fhService: FHService) {

  }

  //  TODO: Moved to generic authentication service
  static getAuthenticationCookie() {
    return Cookies.get('iPlanetDirectoryPro');
  }

  getRAO(officeId: string) {
    return this.programService.getRAOById(officeId);
  }

  getOrganization(id) {
    return this.fhService.getOrganizationById(id, false);
  }

  submitRAO(officeId: string, data: {}) {
    return this.programService.submitRAO(officeId, data, RAOFormService.getAuthenticationCookie());
  }

  deleteRAO(id: string) {
    return this.programService.deleteRAO(id, RAOFormService.getAuthenticationCookie());
  }

  getSubmitPermission() {
    return this.programService.getPermissions(RAOFormService.getAuthenticationCookie(),'SUBMIT_FALS');
  }

  // call to dictionary service for any drop-down options we need
  getRAODict(){
    let dictionaries = ['states', 'countries', 'regional_office_division'];
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve(dictionaries.join());
    if (filteredDictionaries===''){
      return Observable.of(this.dictionaryService.dictionaries);
    } else {
      return this.dictionaryService.getProgramDictionaryById(filteredDictionaries);
    }
  }

  getRAOPermission(type: string) {
    return this.programService.getPermissions(RAOFormService.getAuthenticationCookie(),type);
  }

}
