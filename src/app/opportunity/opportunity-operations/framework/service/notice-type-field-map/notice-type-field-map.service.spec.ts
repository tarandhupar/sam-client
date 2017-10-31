import { TestBed } from '@angular/core/testing';
import { OppNoticeTypeFieldService } from './notice-type-field-map.service';

describe('notice-type-field-map.service.ts', () => {
  let noticeTypeFieldService: OppNoticeTypeFieldService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [OppNoticeTypeFieldService],
    });
  });

  it('getNoticeTypeId returns notice Id based on constant passed', () => {
    noticeTypeFieldService = new OppNoticeTypeFieldService();
    let notice = noticeTypeFieldService.getNoticeTypeId('p');
    expect(notice).toEqual('presolicitation');
  });

  it('getFieldId returns field Id based on constant passed', () => {
    noticeTypeFieldService = new OppNoticeTypeFieldService();
    let field = noticeTypeFieldService.getFieldId('PRODUCT_SERVICE_CODE');
    expect(field).toEqual('opp-classification-product-service-code');
  });

  it('checkFieldVisibility returns display property', () => {
    noticeTypeFieldService = new OppNoticeTypeFieldService();
    let fieldConfig = noticeTypeFieldService.checkFieldVisibility('r', 'PRODUCT_SERVICE_CODE');
    expect(fieldConfig).toEqual(true);
  });

  it('checkFieldRequired returns required property', () => {
    noticeTypeFieldService = new OppNoticeTypeFieldService();
    let fieldConfig = noticeTypeFieldService.checkFieldRequired('r', 'PRODUCT_SERVICE_CODE');
    expect(fieldConfig).toEqual(false);
  });

});
