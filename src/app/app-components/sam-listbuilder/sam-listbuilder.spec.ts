import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule }  from "@angular/forms";
// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-kit';
import { SamListBuilderComponent } from './sam-listbuilder.component';
import { PipesModule } from 'app/app-pipes/app-pipes.module';

describe('The Sam ListBuilder component', () => {
  let component: SamListBuilderComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamListBuilderComponent ],
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
});
