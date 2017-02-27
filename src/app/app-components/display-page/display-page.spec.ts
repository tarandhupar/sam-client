import { TestBed, async } from '@angular/core/testing';
import { SamUIKitModule } from 'ui-kit';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { DisplayPageComponent } from './display-page.component';

var fixture;
var comp;
var titleEl;

describe('DisplayPageTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPageComponent ],
      imports: [SamUIKitModule,RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(DisplayPageComponent);
      comp = fixture.componentInstance;
    });

  }));

  it('logo test', ()  => {
    let fakepath = "/this/is/a/fake/path.png";
    //comp.sidenavConfig = {};
    comp.logoData = {logo: fakepath, info: ""};
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('.sidenav-logo') ).nativeElement.getAttribute("src") ).toEqual(fakepath);
    });
	});

  it('sidenav test', ()  => {
    comp.sidenavConfig = {
      label: "test",
      children: [
        {
          "label": "Award Details",
          "route": "#opportunity-award",
        },
        {
          "label": "General Information",
          "route": "#opportunity-general",
        },
        {
          "label": "Classification",
          "route": "#opportunity-classification"
        },
        {
          "label": "Synopsis/Description",
          "route": "#opportunity-synopsis"
        },
        {
          "label": "Packages",
          "route": "#opportunity-packages"
        },
        {
          "label": "Contact Information",
          "route": "#opportunity-contact"
        }
      ]
    };

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query( By.css('.usa-sidenav-list li:nth-child(1) a') ).nativeElement.innerHTML).toEqual("Award Details");
      expect(fixture.debugElement.query( By.css('.usa-sidenav-list li:nth-child(2) a') ).nativeElement.innerHTML).toEqual("General Information");
      expect(fixture.debugElement.query( By.css('.usa-sidenav-list li:nth-child(3) a') ).nativeElement.innerHTML).toEqual("Classification");
      expect(fixture.debugElement.query( By.css('.usa-sidenav-list li:nth-child(4) a') ).nativeElement.innerHTML).toEqual("Synopsis/Description");
      expect(fixture.debugElement.query( By.css('.usa-sidenav-list li:nth-child(5) a') ).nativeElement.innerHTML).toEqual("Packages");
      expect(fixture.debugElement.query( By.css('.usa-sidenav-list li:nth-child(6) a') ).nativeElement.innerHTML).toEqual("Contact Information");
    });
	});

});
