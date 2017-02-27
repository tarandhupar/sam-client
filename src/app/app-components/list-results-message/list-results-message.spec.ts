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
      fixture.detectChanges();
    });

  }));

  it('message test 1', ()  => {
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('list-results-message') ).nativeElement.innerHTML ).toEqual("Showing 10 of 100 results");
    });
	});
  
  it('message test 2', ()  => {
    fixture.whenStable().then(() => {
      comp.currentPage = 3;
      fixture.detectChanges();
      expect( fixture.debugElement.query( By.css('list-results-message') ).nativeElement.innerHTML ).toEqual("Showing 20 - 30 of 100 results");
    });
	});
  
  it('message test 3', ()  => {
    fixture.whenStable().then(() => {
      comp.total = 5;
      fixture.detectChanges();
      expect( fixture.debugElement.query( By.css('list-results-message') ).nativeElement.innerHTML ).toEqual("Showing 20 - 30 of 100 results");
    });
	});
});
