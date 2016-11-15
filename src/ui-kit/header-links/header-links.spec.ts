import { TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import { SamUIKitModule } from "ui-kit";
import { SamHeaderLinksComponent } from "./header-links.component";


describe('The Sam Header Links component', () => {
  let component: SamHeaderLinksComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule,RouterTestingModule],
      providers: [SamHeaderLinksComponent],
    });
    fixture = TestBed.createComponent(SamHeaderLinksComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('should have sign in and sign up links', function () {
    fixture.detectChanges();
    let signinLink = fixture.debugElement.query(By.css(".sign-in-link"));
    expect(signinLink.nativeElement.innerHTML).toBe("Sign In");
    let signupLink = fixture.debugElement.query(By.css(".sign-up-link"));
    expect(signupLink.nativeElement.innerHTML).toBe("Sign Up");
  });

});
