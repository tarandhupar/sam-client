import {Injectable} from '@angular/core';
import {ProgramService} from "../../../api-kit/program/program.service";
import * as Cookies from 'js-cookie';
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import { FHService } from "../../../api-kit/fh/fh.service";
import {Observable} from "rxjs/Observable";

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
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('functional_codes');
    if (filteredDictionaries===''){
      return Observable.of(this.dictionaryService.dictionaries);
    } else {
      return this.dictionaryService.getProgramDictionaryById(filteredDictionaries);
    }
  }

  getSubjectTermsDict(multiTypeData){
    return this.dictionaryService.getProgramDictionaryById('program_subject_terms', '100', multiTypeData.join(','));
  }

  getAssistanceDict(){
    let dictionaries = ['deadline_flag', 'date_range'];
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve(dictionaries.join());
    if (filteredDictionaries===''){
      return Observable.of(this.dictionaryService.dictionaries);
    } else {
      return this.dictionaryService.getProgramDictionaryById(filteredDictionaries);
    }
  }

  getCriteria_Info_Dictionaries(){
    let dictionaries = ['applicant_types', 'beneficiary_types', 'phasing_assistance', 'assistance_usage_types'];
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve(dictionaries.join());
    if (filteredDictionaries===''){
      return Observable.of(this.dictionaryService.dictionaries);
    } else {
      return this.dictionaryService.getProgramDictionaryById(filteredDictionaries);
    }
  }
  getObligation_Info_Dictionaries(){
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('assistance_type');
    if (filteredDictionaries===''){
      return Observable.of(this.dictionaryService.dictionaries);
    } else {
      return this.dictionaryService.getProgramDictionaryById(filteredDictionaries);
    }
  }

  getContactDict(){
    let dictionaries = ['states', 'countries'];
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve(dictionaries.join());
    if (filteredDictionaries===''){
      return Observable.of(this.dictionaryService.dictionaries);
    } else {
      return this.dictionaryService.getProgramDictionaryById(filteredDictionaries);
    }
  }

  getOrganization(id) {
    return this.fhService.getOrganizationById(id, false);
  }

  submitFAL(programId: string, data: {}) {
    return this.programService.submitProgram(programId, data, FALFormService.getAuthenticationCookie());
  }

  falWFRequestTypeProgram(programId: string, data: {}, workflowRequestType: string) {
    return this.programService.falWFRequestTypeProgram(programId, data, FALFormService.getAuthenticationCookie(), workflowRequestType);
  }

  getSubmitReason(programId: string) {
    return this.programService.getReasons(programId,FALFormService.getAuthenticationCookie());
  }

  sendNotification(programId: string) {
    return this.programService.sendNotification(programId, FALFormService.getAuthenticationCookie());
  }

  getFALPermission(type: string) {
    return this.programService.getPermissions(FALFormService.getAuthenticationCookie(),type);
  }

  getFederalHierarchyConfigurations(orgId: string){
    return this.programService.getFederalHierarchyConfigurations(orgId, FALFormService.getAuthenticationCookie());
  }

  getCfdaCode(orgId){
    return this.programService.getCfdaCode(orgId);
  }

  isProgramNumberUnique(programNumber, programId, organizationId){
    return this.programService.isProgramNumberUnique(programNumber, programId, FALFormService.getAuthenticationCookie(), organizationId);

  }

}
