import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {ReportsPage} from "./reports.page";
import {IAMService} from "../../api-kit/iam/iam.service";


class RouterStub {
  navigate(url: string) { return url; }
}

describe('Reports Page', () => {
  let fixture;
  let comp;
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [ReportsPage],
    providers: [
      //{ provide: Router, useClass: RouterStub },
      { provide: IAMService, useValue: {
          iam: {
            user: {
              get: function (cb) {
              }
            }
          }
        }
      }
    ]});
    fixture = TestBed.createComponent(ReportsPage);
    comp = fixture.componentInstance;
  });

  it('should compile without error', () => {
    expect(true).toBe(true);
  });
});
