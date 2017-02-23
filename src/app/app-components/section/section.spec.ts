import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamSectionComponent } from './section.component';

var fixture;
var comp;

describe('Sam Section Component Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamSectionComponent ],
      imports: []
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamSectionComponent);
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
