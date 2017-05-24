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
import { WorkspacePage } from "./workspace.page";
import { WorkspaceModule } from "./workspace.module";


class RouterStub {
  navigate(url: string) { return url; }
}


fdescribe('Workspace Page', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
        WorkspaceModule
      ],
      providers: [
        WorkspacePage,
        { provide: Router, useClass: RouterStub },
      ]
    });
  });
  
  it("should compile without error", inject([ WorkspacePage ], () => {
    expect(true).toBe(true);
  }));

});
