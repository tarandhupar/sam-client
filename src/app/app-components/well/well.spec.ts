import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamWellComponent } from './well.component';

var fixture;
var comp;

describe('Well Component Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamWellComponent ],
      imports: []
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamWellComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('title test', ()  => {

    comp.title = "test title";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('.samWell h4') ).nativeElement.innerHTML ).toEqual(comp.title);
    });
	});

});
