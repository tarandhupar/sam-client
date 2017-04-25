import { TestBed } from '@angular/core/testing';
import { SamUIKitModule } from "sam-ui-kit/index";
import { RequestDetailsComponent } from "./request-details";

describe('The request details component', () => {
  let component: RequestDetailsComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestDetailsComponent],
      imports: [
        SamUIKitModule,
      ],
      providers: [
      ]
    });

    fixture = TestBed.createComponent(RequestDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
