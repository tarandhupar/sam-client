import { TestBed, async } from '@angular/core/testing';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { SamEditorComponent } from './editor.component';

let fixture;
let comp;
let fakepath;

describe('src/app/app-components/editor/editor.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamEditorComponent ],
      imports: [SamUIKitModule, RouterTestingModule.withRoutes([])]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SamEditorComponent);
      comp = fixture.componentInstance;

      fixture.detectChanges();
    });

  }));

  it('SamEditorTest: basic compile test', ()  => {
    expect(true).toBe(true);
  });



});
