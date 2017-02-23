import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamSubSectionComponent } from './subsection.component';

var fixture;
var comp;

describe('Sam Section Component Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamSubSectionComponent ],
      imports: []
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamSubSectionComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('title test', ()  => {

    comp.title = "test title";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('h3') ).nativeElement.innerHTML() ).toEqual(comp.title);
    });
	});

});
