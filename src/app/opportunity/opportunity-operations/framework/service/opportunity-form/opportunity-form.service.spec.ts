import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend} from '@angular/http/testing';
import { WrapperService} from "../../../../../../api-kit/wrapper/wrapper.service";
import { OpportunityService } from "../../../../../../api-kit/opportunity/opportunity.service";
import { DictionaryService } from "../../../../../../api-kit/dictionary/dictionary.service";
import { OpportunityFormService } from "./opportunity-form.service";
import * as Cookies from 'js-cookie';

describe('src/app/opportunity/opportunity-operations/framework/service/opportunity-form/opportunity-form.service.ts', () => {
  let formService: OpportunityFormService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [WrapperService,
        OpportunityService,
        OpportunityFormService,
        DictionaryService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
        },
      ],
    });
  });

  it('OpportunityFormService.getPermissions: should HaveBeenCalledWith opportunityService.getPermissions', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'getPermissions');
    formService = new OpportunityFormService(oppService, dictionaryService);
    formService.getPermissions();
    expect(spyData).toHaveBeenCalledWith(Cookies.get('iPlanetDirectoryPro'));
  }));

  it('OpportunityFormService.getOpportunity: should HaveBeenCalledWith opportunityService.getContractOpportunityById', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
     oppService = new OpportunityService(wrapperService);
     let spyData = spyOn(oppService, 'getContractOpportunityById');
     formService = new OpportunityFormService(oppService, dictionaryService);
     let id = '5e859411e7f47a2e6e53d280b323236d';
     let cookie = 'cookie';
     formService.authCookie = cookie;
     formService.getOpportunity(id);
     expect(spyData).toHaveBeenCalledWith(id, cookie);
  }));

  it('OpportunityFormService.saveContractOpportunity: should HaveBeenCalledWith opportunityService.saveContractOpportunity', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'saveContractOpportunity');
    formService = new OpportunityFormService(oppService, dictionaryService);
    let id = '5e859411e7f47a2e6e53d280b323236d';
    formService.saveContractOpportunity(id, {});
    expect(spyData).toHaveBeenCalledWith(id, {}, Cookies.get('iPlanetDirectoryPro'));
  }));

  it('OpportunityFormService.deleteContractOpportunity: should HaveBeenCalledWith opportunityService.deleteContractOpportunity', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'deleteContractOpportunity');
    formService = new OpportunityFormService(oppService, dictionaryService);
    let id = '5e859411e7f47a2e6e53d280b323236d';
    formService.deleteContractOpportunity(id);
    expect(spyData).toHaveBeenCalledWith(id, Cookies.get('iPlanetDirectoryPro'));
  }));

});


