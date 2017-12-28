import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,FormBuilder }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamListBuilderComponent } from './sam-listbuilder.component';
import { SamListBuilderCardComponent } from './sam-listbuilder-card.component';
import { SamListBuilderActionComponent } from './sam-listbuilder-action.component';
import { PipesModule } from 'app/app-pipes/app-pipes.module';

describe('The Sam ListBuilder component', () => {
  let component: SamListBuilderComponent;
  let fixture: any;
  let fb: FormBuilder = new FormBuilder();

  let initialize = ()=>{
    let group = fb.group({
      test:fb.control("test value")
    });
    component.formArrayInput = [group];
    component.ngOnInit();
    fixture.detectChanges();
  };
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
    initialize();
    expect(component.model.length).toEqual(1);
    expect(component.model[0].value['test']).toEqual("test value");
  });
  it("should handle card events", ()=>{
    initialize();

    //start edit
    component.cardHandler({
      type: "edit",
      data: 0
    });

    //submit edit changes
    component.cardHandler({
      type: "editSubmit",
      data: {
        index: 0,
        data: {
          test: "aaa"
        }
      }
    });
    expect(component.model[0]["test"]).toBe("aaa");

    //delete from model
    component.cardHandler({
      type: "delete",
      data: 0
    });
    expect(component.model.length).toBe(0);

    //add to model
    component.showAdd();

    component.cardHandler({
      type: "editSubmit",
      data: {
        index: 0,
        data: {
          test: "bbb"
        }
      }
    });
    expect(component.model[0]["test"]).toBe("bbb");

    component.showAdd();
    component.cardHandler({
      type: "editSubmit",
      data: {
        index: 1,
        data: {
          test: "ccc"
        }
      }
    });
    expect(component.model[1]["test"]).toBe("ccc");

    //re-arrange model
    component.cardHandler({
      type: "moveup",
      data: 1
    });
    expect(component.model[0]["test"]).toBe("ccc");
    expect(component.model[1]["test"]).toBe("bbb");

    component.cardHandler({
      type: "movedown",
      data: 0
    });
    expect(component.model[0]["test"]).toBe("bbb");
    expect(component.model[1]["test"]).toBe("ccc");
  });
});
