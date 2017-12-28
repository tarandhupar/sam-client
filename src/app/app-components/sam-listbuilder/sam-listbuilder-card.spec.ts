import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule,FormBuilder }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamListBuilderComponent } from './sam-listbuilder.component';
import { SamListBuilderCardComponent } from './sam-listbuilder-card.component';
import { SamListBuilderActionComponent } from './sam-listbuilder-action.component';
import { PipesModule } from 'app/app-pipes/app-pipes.module';

describe('The Sam ListBuilderCard component', () => {
  let component: SamListBuilderCardComponent;
  let fixture: any;
  let fb: FormBuilder = new FormBuilder();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamListBuilderCardComponent,SamListBuilderActionComponent ],
      imports: [ SamUIKitModule ]
    });

    fixture = TestBed.createComponent(SamListBuilderCardComponent);
    component = fixture.componentInstance;
    component.index = 0;
    component.data = fb.group({
        test: "aaa"
    });
    fixture.detectChanges();
  });

  it('should compile', function () {
    expect(true).toBe(true);
  });

  it("should be able to do edit actions", ()=>{
      component.action.subscribe(evt=>{
        expect(evt.type).toBe("edit");
        expect(evt.data).toBe(0);
      });
      component.actionHandler("edit");
  });

  it("should be able to do delete actions", ()=>{
    component.action.subscribe(evt=>{
      expect(evt.type).toBe("delete");
      expect(evt.data).toBe(0);
    });
    component.actionHandler("delete");
  });

  it("should be able to do editSubmit actions", ()=>{
    component.action.subscribe(evt=>{
      expect(evt.type).toBe("editSubmit");
    });
    component.actionHandler("editSubmit");
  });

  it("should be able to cancel edit actions", ()=>{
    component.action.subscribe(evt=>{
      expect(evt.type).toBe("edit-cancel");
    });
    component.cancelEdit();
  });
  it("should be able to cancel add actions", ()=>{
    component.action.subscribe(evt=>{
      expect(evt.type).toBe("add-cancel");
    });
    component.addMode = true;
    component.cancelEdit();
  });
});
