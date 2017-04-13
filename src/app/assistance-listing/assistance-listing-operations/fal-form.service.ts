import {Injectable} from '@angular/core';
import {ProgramService} from "../../../api-kit/program/program.service";
import * as Cookies from 'js-cookie';

@Injectable()

export class FALFormService {
  constructor(private programService: ProgramService) {

  }

  //  TODO: Moved to generic authentication service
  static getAuthenticationCookie() {
    return Cookies.get('iPlanetDirectoryPro');
    // return 'GSA_CFDA_R_cfdasuperuser';
  }

  getFAL(programId: string) {
    return this.programService.getProgramById(programId, FALFormService.getAuthenticationCookie());
  }

  getContactsList() {
    return this.programService.getContacts(FALFormService.getAuthenticationCookie());
  }

  saveFAL(programId: string, data: {}) {
    return this.programService.saveProgram(programId, data, FALFormService.getAuthenticationCookie());
  }

  getProgramList() {
    return this.programService.runProgram({
      status: 'published',
      includeCount : 'false',
      Cookie: FALFormService.getAuthenticationCookie(),
      size:'100',
      sortBy: 'programNumber'
    });
  }
}
