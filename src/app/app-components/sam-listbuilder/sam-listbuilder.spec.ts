import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,FormBuilder }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-kit';
import { SamListBuilderComponent } from './sam-listbuilder.component';
import { SamListBuilderCardComponent } from './sam-listbuilder-card.component';
import { SamListBuilderActionComponent } from './sam-listbuilder-action.component';
import { PipesModule } from 'app/app-pipes/app-pipes.module';

describe('The Sam ListBuilder component', () => {
  let component: SamListBuilderComponent;
  let fixture: any;
  let fb: FormBuilder = new FormBuilder();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamListBuilderComponent,SamListBuilderCardComponent,SamListBuilderActionComponent ],
      imports: [ SamUIKitModule, RouterTestingModule,PipesModule ]
    });

    fixture = TestBed.createComponent(SamListBuilderComponent);
    component = fixture.componentInstance;
    component.formArrayInput = [];
    fixture.detectChanges();
  });

  it('should compile ListBuilder', function () {
    expect(true).toBe(true);
  });

  it('should populate model with item', function () {
    let group = fb.group({
      test:fb.control("test value")
    });
    component.formArrayInput = [group];
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.model.length).toEqual(1);
    expect(component.model[0].value['test']).toEqual("test value");
  });
});
