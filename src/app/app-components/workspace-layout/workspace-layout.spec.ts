import { TestBed, async } from '@angular/core/testing';
import { SamUIKitModule } from 'samUIKit';
import { By } from '@angular/platform-browser';

import { WorkspaceLayoutComponent } from './workspace-layout.component';

let fixture;
let comp;

describe('WorkspaceLayoutTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLayoutComponent ],
      imports: [SamUIKitModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(WorkspaceLayoutComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('logo test', ()  => {
    comp.totalPages = 14;
    comp.currentPage = 2;
    comp.totalElements = 140;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('.showing-results-meta') ).nativeElement.innerHTML ).toContain(140);
    });
	});

});
