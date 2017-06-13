import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamTitleSubtitleComponent } from "./title-subtitle.component";


describe('Title and subtitle', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamTitleSubtitleComponent ],
      imports: []
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamTitleSubtitleComponent);
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
