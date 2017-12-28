import { TestBed } from '@angular/core/testing';
import { OppNoticeTypeMapService } from './notice-type-map.service';
import { OpportunitySideNavService } from '../sidenav/opportunity-form-sidenav.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('notice-type-map.service.ts', () => {
  let noticeTypeMapService: OppNoticeTypeMapService;
  let MockSidenavService = jasmine.createSpyObj('OpportunitySideNavService', ['disableSideNavItem', 'enableSideNavItem']);
  MockSidenavService.disableSideNavItem.and.returnValue(true);
  MockSidenavService.enableSideNavItem.and.returnValue(true);

  beforeEach(() => {

    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        OppNoticeTypeMapService,
        { provide: OpportunitySideNavService, useValue: MockSidenavService },
      ],
    });
  });

  it('getNoticeTypeId returns notice Id based on constant passed', () => {
    noticeTypeMapService = new OppNoticeTypeMapService(MockSidenavService);
    let notice = noticeTypeMapService.getNoticeTypeId('p');
    expect(notice).toEqual('presolicitation');
  });

  it('getFieldId returns field Id based on constant passed', () => {
    noticeTypeMapService = new OppNoticeTypeMapService(MockSidenavService);
    let field = noticeTypeMapService.getFieldId('PRODUCT_SERVICE_CODE');
    expect(field).toEqual('opp-classification-product-service-code');
  });

  it('checkFieldVisibility returns display property', () => {
    noticeTypeMapService = new OppNoticeTypeMapService(MockSidenavService);
    let fieldConfig = noticeTypeMapService.checkFieldVisibility('r', 'PRODUCT_SERVICE_CODE');
    expect(fieldConfig).toEqual(true);
  });

  it('checkFieldRequired returns required property', () => {
    noticeTypeMapService = new OppNoticeTypeMapService(MockSidenavService);
    let fieldConfig = noticeTypeMapService.checkFieldRequired('r', 'PRODUCT_SERVICE_CODE');
    expect(fieldConfig).toEqual(false);
  });

  it('toggleSectionsDisabledProperty sets disabled property', () => {
    noticeTypeMapService = new OppNoticeTypeMapService(MockSidenavService);
    noticeTypeMapService.toggleSectionsDisabledProperty('r');
    expect(MockSidenavService.disableSideNavItem).toHaveBeenCalled();

    noticeTypeMapService.toggleSectionsDisabledProperty('k');
    expect(MockSidenavService.enableSideNavItem).toHaveBeenCalled();
  });

  it('checkSectionIsDisabled checks for desired section disabled property', () => {
    noticeTypeMapService = new OppNoticeTypeMapService(MockSidenavService);
    let val = noticeTypeMapService.checkSectionIsDisabled('p', 'award');
    expect(val).toEqual(true);
  });
});
