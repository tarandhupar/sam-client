import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {OppRelatedNoticeAutoFillService} from "./related-notice-autofill.service";

describe('related-notice-autofill.service.ts', () => {
  let relatedNoticeAutoFillService: OppRelatedNoticeAutoFillService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
    });
  });

  it('getNoticeTypeId returns notice Id based on constant passed', () => {
    relatedNoticeAutoFillService = new OppRelatedNoticeAutoFillService();
    let notice = relatedNoticeAutoFillService.getNoticeTypeId('o');
    expect(notice).toEqual('solicitation');
  });

  it('checkFieldAutoFill returns display property true', () => {
    relatedNoticeAutoFillService = new OppRelatedNoticeAutoFillService();
    let fieldConfig = relatedNoticeAutoFillService.checkFieldAutoFill('solicitation', 'opp-title');
    expect(fieldConfig).toEqual(true);
  });
  it('autoFillFormFields have been called autoFillHeaderViewModelSpy', () => {
    relatedNoticeAutoFillService = new OppRelatedNoticeAutoFillService();
    let type = 'o';
    let api = {
      data: {
        title: 'test'
      }
    };
    let viewModel = {
      data: {
        title: 'test'
      }
    };

    let autoFillHeaderViewModelSpy = spyOn(relatedNoticeAutoFillService, 'autoFillHeaderViewModel');
    relatedNoticeAutoFillService.autoFillFormFields(api,type,viewModel);
   expect(relatedNoticeAutoFillService.viewModel).toEqual(viewModel)
    expect(autoFillHeaderViewModelSpy).toHaveBeenCalled();
  });
  it('should autoFillHeaderViewModel on add page', () => {
    relatedNoticeAutoFillService = new OppRelatedNoticeAutoFillService();
    let noticeId = 'solicitation';
    let api = {
      data: {
        title: 'test'
      }
    };
    let viewModel = {
      data: {
        title: null
      }
    };
    relatedNoticeAutoFillService.viewModel = viewModel;
    relatedNoticeAutoFillService.autoFillHeaderViewModel(api, noticeId);
    expect(relatedNoticeAutoFillService.viewModel.title).toEqual('test')
  });
  it('should autoFillHeaderViewModel on edit page', () => {
    relatedNoticeAutoFillService = new OppRelatedNoticeAutoFillService();
    let noticeId = 'solicitation';
    let api = {
      data: {
        title: 'test2'
      }
    };
    let viewModel = {
      data: {
        title: 'test'
      }
    };
    relatedNoticeAutoFillService.viewModel = viewModel;
    relatedNoticeAutoFillService.autoFillHeaderViewModel(api, noticeId);
    expect(relatedNoticeAutoFillService.viewModel.title).toEqual('test2')
  });
});
