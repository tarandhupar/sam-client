import { TestBed, async } from '@angular/core/testing';
import { SamUIKitModule } from 'ui-kit';
import { By } from '@angular/platform-browser';

import { WorkspaceLayoutComponent } from './workspace-layout.component';
import { ListResultsMessageComponent } from '../list-results-message/list-results-message.component';

var fixture;
var comp;

describe('WorkspaceLayoutTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLayoutComponent,ListResultsMessageComponent ],
      imports: [SamUIKitModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(WorkspaceLayoutComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('result list message test', ()  => {
    comp.totalPages = 14;
    comp.currentPage = 2;
    comp.totalElements = 140;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('.showing-results-meta') ).nativeElement.innerHTML ).toContain(140);
    });
	});

});
