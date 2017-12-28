import { TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { WrapperService } from 'api-kit';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';

import { EntityPickerComponent } from './entity-picker.component';


let apiServiceStub = {
  call: (oApiParam)=>{
    return {};
  }
};
describe('src/app/app-components/entity-picker/entity-picker.component.ts', () => {
  let fixture;
  let comp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityPickerComponent ],
      providers: [
        {
          provide: WrapperService, //override APIservice
          useValue: apiServiceStub
        }
      ],
      imports: [FormsModule,SamUIKitModule]
    });
    TestBed.overrideComponent(EntityPickerComponent, {
      set: {
        providers: [
          { provide: WrapperService, useValue: apiServiceStub }
        ]
      }
    });
    fixture = TestBed.createComponent(EntityPickerComponent);
    comp = fixture.componentInstance;

  });

  it('Entity Picker: compile test', ()  => {
    fixture.detectChanges();

    expect(true).toBe(true);
    comp.onSelection({value: 'test'}, false);
    expect(comp.selections).toEqual({value:'test'});

  });
});
