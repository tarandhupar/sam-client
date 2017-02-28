import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { SamUIKitModule } from 'samUIKit';
import { SamHeaderLinksComponent } from './header-links.component';
import { IAMService } from 'api-kit';

describe('The Sam Header Links component', () => {
  let component: SamHeaderLinksComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamHeaderLinksComponent],
      imports: [SamUIKitModule, RouterTestingModule],
      providers: [IAMService],
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
    let signinLink = fixture.debugElement.query(By.css(".signin-link"));
    expect(signinLink.nativeElement.innerHTML).toBe("Sign In");
    let signupLink = fixture.debugElement.query(By.css(".signup-link"));
    expect(signupLink.nativeElement.innerHTML).toBe("Sign Up");
  });

  it('should open drop down menu when clicking on menu link', async(()=>{
    fixture.detectChanges();
    expect(component.showDropdown).toBe(false);
    let menuLink = fixture.debugElement.query(By.css(".menu-link"));
    menuLink.triggerEventHandler('click',null);
    fixture.whenStable().then(()=>{
      fixture.detectChanges();
      expect(component.showDropdown).toBe(true);
      let dropdownData = component.dropdownData.filter((item)=>{
        return !item.pageInProgress;
      });
      let titles = fixture.debugElement.queryAll(By.css(".dropdown-button-title"));
      for(var index in dropdownData){
        expect(titles[index].nativeElement.innerHTML).toBe(dropdownData[index].linkTitle);
      }
    });
  }));
});
