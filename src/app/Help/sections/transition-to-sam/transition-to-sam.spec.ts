import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

//import testing module and component
import { TransitionToSamComponent } from './transition-to-sam.component';
import { HelpModule } from '../../help.module';

describe("Transition Roadmap page in online help",()=>{
  let component:TransitionToSamComponent;
  let fixture: any;
  let releaseData: any = [
    {releaseNum:3,releaseDate:"Sept 2015",releaseFeature:["Test"]},
    {releaseNum:4,releaseDate:"Dec 2015",releaseFeature:["Test","Test","Test"]},
  ];

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransitionToSamComponent],
      imports: [HelpModule,RouterTestingModule]

    });
    fixture = TestBed.createComponent(TransitionToSamComponent);
    component = fixture.componentInstance;
  });

  it("should compile",()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it("should have release note table vertical unit should be 3",()=>{
    component.releaseData = releaseData;
    fixture.detectChanges();
    expect(component.getVerticalLineLength()).toBe(3);
  });

  it("should change filter by clicking By Legacy Website Button",()=>{
    fixture.detectChanges();
    expect(component.isCurrentFilter('feature')).toBe(true);
    let filterDivs = fixture.debugElement.queryAll(By.css('.filter-div'));
    filterDivs[1].triggerEventHandler('click',null);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isCurrentFilter('legacy')).toBe(true);
    });
  })

});
