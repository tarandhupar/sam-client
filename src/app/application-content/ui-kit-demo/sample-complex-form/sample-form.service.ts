import {Injectable} from '@angular/core';
import * as Cookies from 'js-cookie';
import {DictionaryService} from "api-kit/dictionary/dictionary.service";
import { FHService } from "api-kit/fh/fh.service";

@Injectable()

export class SampleFormService {

  constructor() {

  }

  //  TODO: Moved to generic authentication service
  static getAuthenticationCookie() {
    return Cookies.get('iPlanetDirectoryPro');
  }

  getFAL(programId: string) {
    //return this.programService.getProgramById(programId, SampleFormService.getAuthenticationCookie());
  }

  getContactsList() {
    //return this.programService.getContacts(SampleFormService.getAuthenticationCookie());
  }

  saveFAL(programId: string, data: {}) {
    //return this.programService.saveProgram(programId, data, SampleFormService.getAuthenticationCookie());
  }
}
