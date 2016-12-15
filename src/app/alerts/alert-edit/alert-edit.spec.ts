import {TestBed, ComponentFixtureAutoDetect} from '@angular/core/testing';

// Load the implementations that should be tested
import {SamUIKitModule} from 'ui-kit';
import {RouterTestingModule} from "@angular/router/testing";
import {AlertEditComponent} from "./alert-edit.component";
import {Alert} from "../alert.model";
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import {error, info, warning} from '../alerts-test-data.spec';
import {SystemAlertsService} from "api-kit/system-alerts/system-alerts.service";
import {Observable} from "rxjs";

let systemAlertsStub: any = {
  updateAlert: () => Observable.of(warning),
  createAlert: () => Observable.of(info)
};

// describe('The <alert-edit> component', () => {
//   let component:AlertEditComponent;
//   let fixture:any;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: ComponentFixtureAutoDetect, useValue: true },
//         { provide: SystemAlertsService, useValue: systemAlertsStub },
//       ],
//       declarations: [AlertEditComponent, DateFormatPipe, SystemAlertsService],
//       imports: [SamUIKitModule,RouterTestingModule],
//     });
//
//     fixture = TestBed.createComponent(AlertEditComponent);
//     component = fixture.componentInstance;
//     component.alert = Alert.FromResponse(error);
//   });
//
//   it('should compile', () => {
//     expect(true).toBe(true);
//   });
//
//
//   describe('Edit tests', function() {
//     beforeEach(() => {
//       component.mode = 'edit';
//     });
//
//     it('should have edit in the title if the component is in edit mode', () => {
//       const header = fixture.debugElement.query(By.css('.edit-header'));
//       expect(header.textContent).toMatch(/edit/i);
//     });
//
//     it('should call the update endpoint on save draft', () => {
//       let svc = fixture.debugElement.injector.get(SystemAlertsService);
//       spyOn(svc, 'updateAlert');
//       fixture.debugElement.query(By.css('.save-draft-button')).nativeElement.click();
//       expect(svc.updateAlert).toHaveBeenCalled();
//     });
//
//     it('should call the update endpoint on publish', () => {
//       let svc = fixture.debugElement.injector.get(SystemAlertsService);
//       spyOn(svc, 'updateAlert');
//       fixture.debugElement.query(By.css('.publish-button')).nativeElement.click();
//       expect(svc.updateAlert).toHaveBeenCalled();
//     });
//
//   });
//
//   describe('Create tests', function() {
//     beforeEach(() => {
//       component.mode = 'add';
//     });
//
//     it('should have add in the title if the component is in add mode', () => {
//       const header = fixture.debugElement.query(By.css('.edit-header'));
//       expect(header.textContent).toMatch(/add/i);
//     });
//
//     it('should call the create endpoint when save draft is clicked', function() => {
//       const svc = fixture.debugElement.injector.get(SystemAlertsService);
//       spyOn(svc, 'updateAlert');
//       fixture.debugElement.query(By.css('.save-draft-button')).nativeElement.click();
//       expect(svc.createAlert).toHaveBeenCalled();
//     });
//
//     it('should call the create endpoint when publish is clicked', function() => {
//       const svc = fixture.debugElement.injector.get(SystemAlertsService);
//       spyOn(svc, 'updateAlert');
//       fixture.debugElement.query(By.css('.publish-button')).nativeElement.click();
//       expect(svc.createAlert).toHaveBeenCalled();
//     });
//   });
// });
