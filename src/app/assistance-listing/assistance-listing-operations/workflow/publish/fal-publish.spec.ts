import {inject, TestBed} from "@angular/core/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {routing} from 'app.routing';
import {RouterTestingModule} from "@angular/router/testing";
import {FALFormService} from "../../fal-form.service";
import {Router} from "@angular/router";
import {FALPublishComponent} from "./fal-publish.component";

describe('FALPublishComponent', () => {
  let comp: FALPublishComponent;
  let MockSaveService = jasmine.createSpyObj('MockSaveService', ['falWFRequestTypeProgram']);
  let MockGetSubmitReason = jasmine.createSpyObj('MockGetSubmitReason', ['getSubmitReason']);
  let MockGetFAL = jasmine.createSpyObj('MockGetFAL', ['getFAL']);
  beforeEach(() => {
    comp = new FALPublishComponent(null, null, null, null, null);
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        FALPublishComponent
      ],
      providers: [
        {provide: FALFormService, useValue: MockSaveService},
        {provide: FALFormService, useValue: MockGetFAL},
        {provide: FALFormService, useValue: MockGetSubmitReason}],
      imports: [FormsModule, ReactiveFormsModule, HttpModule, RouterTestingModule],
    });
  });
  it('should exist', () => {
    expect(comp).toBeDefined();
  });
  it('setBreadCrumbs', () => {
    comp.setBreadCrumbs('test');
    expect(comp.crumbs.length).toEqual(4);
  });
  it('onPublishClick calls function publishSave', () => {
    let spyData = spyOn(comp, 'publishSave');
    comp.onPublishClick();
    expect(spyData).toHaveBeenCalled();
  });
  it('breadCrumbNavigation', () => {
    let spyData = spyOn(comp, 'breadCrumbNavigation');
    comp.breadcrumbHandler('Assistance Listings');
    expect(spyData).toHaveBeenCalled();
  });
  it('breadCrumbNavigation else if ', () => {
    let spyData = spyOn(comp, 'breadCrumbNavigation');
    comp.breadcrumbHandler('test');
    expect(spyData).toHaveBeenCalled();
  });
  it('onTextChange when value', () => {
    let event = {
      target: {
        value: 'test'
      }
    };
    comp.onTextChange(event);
    expect(comp.btnDisabled).toBeFalsy();
  });
  it('onTextChange when value is null', () => {
    let event = {
      target: {
        value: null
      }
    };
    comp.onTextChange(event);
    expect(comp.btnDisabled).toBeTruthy();
  });
  it('onTextChange when value is empty', () => {
    let event = {
      target: {
        value: ''
      }
    };
    comp.onTextChange(event);
    expect(comp.btnDisabled).toBeTruthy();
  });
  it('onCancelClick', () => {
    let spyData = spyOn(comp, 'setNavigation');
    comp.onCancelClick();
    expect(spyData).toHaveBeenCalled();
  });
  it('ngOnInit', () => {
    let spyData = spyOn(comp, 'populateData');
    comp.ngOnInit();
    expect(spyData).toHaveBeenCalled();
  });
});