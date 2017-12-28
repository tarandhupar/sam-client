import { TestBed } from '@angular/core/testing';
import { OpportunitySideNavService } from "./opportunity-form-sidenav.service";

describe('opportunity-form.service.ts', () => {

  let sideNavService: OpportunitySideNavService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [OpportunitySideNavService],
    });
  });

  it('getSections returns all sections', () => {
    sideNavService = new OpportunitySideNavService();
    let sections = sideNavService.getSections();
    expect(sections.length).toBeGreaterThan(0);
  });

  it('getSectionLabel returns section label based on index', () => {
    sideNavService = new OpportunitySideNavService();
    let sectionLabel = sideNavService.getSectionLabel(0);
    expect(sectionLabel).toEqual('Header Information');
  });

  it('getSectionIndex returns section index based on fragment', () => {
    sideNavService = new OpportunitySideNavService();
    let sectionIndex = sideNavService.getSectionIndex('header');
    expect(sectionIndex).toEqual(0);
  });

  it('getFragment returns fragment based on index', () => {
    sideNavService = new OpportunitySideNavService();
    let fragment = sideNavService.getFragment(0);
    expect(fragment).toEqual('header');
  });

  it('getSideNavModel returns defined sidenav model', () => {
    sideNavService = new OpportunitySideNavService();
    let sidenavModel = sideNavService.getSideNavModel();
    expect(sidenavModel.children.length).toBeGreaterThan(0);
    expect(sidenavModel.label).toBeDefined();
  });

  it('disableSideNavItem disables sidenavitem based on fragment', () => {
    sideNavService = new OpportunitySideNavService();
    sideNavService.disableSideNavItem('classification');
    let model = sideNavService.getSideNavModel();
    expect(model.children[3].disabled).toEqual(true);
  });

  it('enableSideNavItem enables sidenavitem based on fragment', () => {
    sideNavService = new OpportunitySideNavService();
    sideNavService.enableSideNavItem('classification');
    let model = sideNavService.getSideNavModel();
    expect(model.children[3].disabled).toEqual(false);
  });

});
