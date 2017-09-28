import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend} from '@angular/http/testing';
import { WrapperService} from "../../../../../api-kit/wrapper/wrapper.service";
import { OpportunityService } from "../../../../../api-kit/opportunity/opportunity.service";
import { DictionaryService } from "../../../../../api-kit/dictionary/dictionary.service";
import { OpportunityFormService } from "./opportunity-form.service";
import * as Cookies from 'js-cookie';

xdescribe('src/app/opportunity/opportunity-operations/opportunity-form.service.ts', () => {
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

  it('OpportunityFormService.isOpportunityEnabled: should HaveBeenCalledWith opportunityService.isOpportunityEnabled', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'isOpportunityEnabled');
    formService = new OpportunityFormService(oppService, dictionaryService);
    formService.isOpportunityEnabled();
    expect(spyData).toHaveBeenCalledWith(Cookies.get('iPlanetDirectoryPro'));
  }));

  it('OpportunityFormService.getOpportunity: should HaveBeenCalledWith opportunityService.getContractOpportunityById', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
     oppService = new OpportunityService(wrapperService);
     let spyData = spyOn(oppService, 'getContractOpportunityById');
     formService = new OpportunityFormService(oppService, dictionaryService);
     let id = '5e859411e7f47a2e6e53d280b323236d';
     formService.getOpportunity(id);
     expect(spyData).toHaveBeenCalledWith(id);
  }));

  it('OpportunityFormService.saveContractOpportunity: should HaveBeenCalledWith opportunityService.saveContractOpportunity', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'saveContractOpportunity');
    formService = new OpportunityFormService(oppService, dictionaryService);
    let id = '5e859411e7f47a2e6e53d280b323236d';
    formService.saveContractOpportunity(id, {});
    console.log("spydata", spyData);
    expect(spyData).toHaveBeenCalledWith(id, {});
  }));

  it('OpportunityFormService.deleteContractOpportunity: should HaveBeenCalledWith opportunityService.deleteContractOpportunity', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'deleteContractOpportunity');
    formService = new OpportunityFormService(oppService, dictionaryService);
    let id = '5e859411e7f47a2e6e53d280b323236d';
    formService.deleteContractOpportunity(id);
    console.log("spydata", spyData);
    expect(spyData).toHaveBeenCalledWith(id);
  }));

});


