import {Injectable} from '@angular/core';
import {ProgramService} from "../../../api-kit/program/program.service";
import * as Cookies from 'js-cookie';
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import { FHService } from "../../../api-kit/fh/fh.service";

@Injectable()

export class FALFormService {

  constructor(private programService: ProgramService, private dictionaryService: DictionaryService, private fhService: FHService) {

  }

  //  TODO: Moved to generic authentication service
  static getAuthenticationCookie() {
    return Cookies.get('iPlanetDirectoryPro');
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

  getRelatedProgramList(programs) {
    return this.programService.falautosearch('', programs.join(','));
  }

  getFunctionalCodesDict(){
    return this.dictionaryService.getDictionaryById('functional_codes');
  }

  getSubjectTermsDict(multiTypeData){
    return this.dictionaryService.getDictionaryById('program_subject_terms', '100', multiTypeData.join(','));
  }

  getAssistanceDict(){
    let dictionaries = ['deadline_flag', 'date_range'];
    return this.dictionaryService.getDictionaryById(dictionaries.join(','));
  }

  getCriteria_Info_Dictionaries(){
    let dictionaries = ['applicant_types', 'beneficiary_types', 'phasing_assistance', 'assistance_usage_types'];
    return this.dictionaryService.getDictionaryById(dictionaries.join(','));
  }
  getObligation_Info_Dictionaries(){
    return this.dictionaryService.getDictionaryById('assistance_type');
  }
  getContactDict(){
    let dictionaries = ['states', 'countries'];
    return this.dictionaryService.getDictionaryById(dictionaries.join(','));
  }

  getOrganization(id) {
    return this.fhService.getOrganizationById(id, false);
  }
}
