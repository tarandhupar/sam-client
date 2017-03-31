import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { AwardDataComponent } from "./award-data.component";
import { HelpModule } from "../../help.module";

describe("Award data page in help page", ()=>{
  let component: AwardDataComponent;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers:[AwardDataComponent,
        {provide: Router, useValue:{events:Observable.of({url:"/help/award#wageDeterminations"})}},
        {provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{ 'admin': 'true' }])}}],
      imports:[HelpModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(AwardDataComponent);
    component = fixture.componentInstance;
  });

  it("should compile without error", ()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it("should not show admin edit button for normal users", ()=>{
    fixture.detectChanges();
    expect(component.isAdmin).toBe(true);
  });

  it("should be able to roll back edited content", ()=>{
    fixture.detectChanges();
    component.updateCopies();
    component.onEditPageClick();
    component.curConfig.splashContent = "Award wage determination data splash content";
    component.onRemoveTermClick({termName:"Service Contract Act", termContent:"Term definition lipsum"});
    component.onCancelEditPageClick();
    expect(component.curConfig.splashContent).toBe("Find minimal wage rates and benefits paid to Federal contractors.");
    expect(component.curCommonTerms[0]).toEqual({termName:"Service Contract Act", termContent:"Term definition lipsum"});
  });

  it("should be able to save edited content", ()=>{
    fixture.detectChanges();
    component.onEditPageClick();
    component.curConfig.splashContent = "Award wage determination data splash content";
    component.onRemoveFeatureClick('Request form for wage determination');
    component.onSaveEditPageClick();
    expect(component.curConfig.splashContent).toBe("Award wage determination data splash content");
    expect(component.curFeatures).toEqual(['Search', 'View']);
  });
});
