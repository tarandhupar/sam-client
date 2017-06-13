import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SamTitleSectionComponent } from './title-section.component';

var fixture;
var comp;

describe('Sam Title Section Component Tests', () => {
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

  it('should compile', ()  => {
    expect(comp).toBeTruthy();
  });

});
