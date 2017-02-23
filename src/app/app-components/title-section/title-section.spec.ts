import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamTitleSectionComponent } from './title-section.component';

var fixture;
var comp;

describe('Sam Section Component Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamTitleSectionComponent ],
      imports: []
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamTitleSectionComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('title test', ()  => {

    comp.title = "test title";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('h1') ).nativeElement.innerHTML() ).toEqual(comp.title);
    });
	});

});
