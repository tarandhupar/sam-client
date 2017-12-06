import { TestBed } from '@angular/core/testing';
import { SupportComponent } from './support.component';
import { SamUIKitModule } from '../../../../sam-ui-elements/src/ui-kit/index';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SamUploadComponent } from './upload.component';
import { HttpModule } from '@angular/http';

describe("Customer Support Page", ()=>{
  let component: SupportComponent;
  let fixture: any;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SamUIKitModule,
        RouterTestingModule,
        HttpModule,
      ],
      declarations: [
        SupportComponent,
        SamUploadComponent,
      ]
    });

    fixture = TestBed.createComponent(SupportComponent);
    component = fixture.componentInstance;
  });

  it("should compile without error", ()=>{
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
