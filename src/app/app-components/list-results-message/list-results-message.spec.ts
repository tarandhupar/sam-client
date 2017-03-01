import { TestBed, async } from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { ListResultsMessageComponent } from './list-results-message.component';

var fixture;
var comp;

describe('ListResultsMessage', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListResultsMessageComponent ]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(ListResultsMessageComponent);
      comp = fixture.componentInstance;
      comp.total = 100;
      comp.currentPage = 1;
      comp.showing = 10;
      comp.ngOnChanges();
      fixture.detectChanges();
    });

  }));

  it('message test 1', ()  => {
    fixture.whenStable().then(() => {
      expect( fixture.nativeElement.innerHTML ).toEqual("Showing 1 - 10 of 100 results");
    });
	});
  
  it('message test 2', ()  => {
    comp.currentPage = 3;
    comp.ngOnChanges();
    fixture.detectChanges();
    //console.log(fixture);
    fixture.whenStable().then(() => {
      expect( fixture.nativeElement.innerHTML ).toEqual("Showing 21 - 30 of 100 results");
    });
	});
  
  it('message test 3', ()  => {
    comp.total = 5;
    comp.ngOnChanges();
    fixture.detectChanges();
    //console.log(fixture);
    fixture.whenStable().then(() => {
      expect( fixture.nativeElement.innerHTML ).toEqual("Showing 1 - 5 of 5 results");
    });
	});
});
