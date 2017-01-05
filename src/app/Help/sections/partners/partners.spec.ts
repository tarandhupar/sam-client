import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { PartnersComponent } from "./partners.component";
import { HelpModule } from "../../help.module";

describe('Our Partners page in online help', () => {
  let component:PartnersComponent;
  let fixture:any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartnersComponent],
      imports: [HelpModule,RouterTestingModule]

    });
    fixture = TestBed.createComponent(PartnersComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should contain featured partners section and additional partners section', ()=>{
    fixture.detectChanges();
    let featuredRef = fixture.debugElement.query(By.css('#featuredPartners'));
    let additionalRef = fixture.debugElement.query(By.css('#additionalPartners'));
    expect(featuredRef).toBeDefined();
    expect(featuredRef.nativeElement.innerHTML).toBe("Featured Partners");
    expect(additionalRef).toBeDefined();
    expect(additionalRef.nativeElement.innerHTML).toBe("Additional Partners");
  });

});
