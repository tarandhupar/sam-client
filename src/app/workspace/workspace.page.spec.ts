import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { FHService } from "../../api-kit/fh/fh.service";


class RouterStub {
  navigate(url: string) { return url; }
}


describe('Organization Detail Page', () => {
  // provide our implementations or mocks to the dependency injector

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
      ]
    });

  });





});
