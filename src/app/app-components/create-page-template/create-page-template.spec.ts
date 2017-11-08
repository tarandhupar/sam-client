import { TestBed, async } from '@angular/core/testing';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { SamCreatePageTemplateComponent } from './create-page-template.component';

let fixture;
let comp;
let fakepath;

describe('src/app/app-components/create-page-template/create-page-template.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamCreatePageTemplateComponent ],
      imports: [SamUIKitModule,RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamCreatePageTemplateComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

  }));

  it('SamCreatePageTemplateComponent: Basic Compile', ()  => {
    expect(true).toBe(true);
  });
});