import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { SamToggle } from "./bulk-update.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { SamUIKitModule } from "sam-ui-elements/src/ui-kit/index";
import { PipesModule } from "../../app-pipes/app-pipes.module";

describe('The Sam Toggle Component from RM page', () => {
  let component: SamToggle;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamToggle,
      ],
      imports: [
        FormsModule,
        AppComponentsModule,
        RouterTestingModule,
        SamUIKitModule,
        PipesModule
      ],
      providers: [],
    });

    fixture = TestBed.createComponent(SamToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile and initialize', () => {
    expect(component).toBeTruthy();
    component.onSwitchClick();
  });

});
