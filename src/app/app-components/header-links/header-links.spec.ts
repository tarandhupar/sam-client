import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { SamUIKitModule } from 'sam-ui-kit';
import { SamHeaderLinksComponent } from './header-links.component';
import { IAMService } from 'api-kit';

class iamStub{
  checkSession($success,$error){
    return $error;
  }
}

class iamServiceStub {
  iam = new iamStub();
}
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
    TestBed.overrideComponent(SamHeaderLinksComponent, {
      set: {
        providers: [
          { provide: IAMService, useClass: iamServiceStub }
        ]
      }
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
    let signinLink = fixture.debugElement.query(By.css(".right.menu > .item:nth-child(3)"));
    expect(signinLink.nativeElement.innerHTML.trim()).toBe("Sign in");
    let signupLink = fixture.debugElement.query(By.css(".right.menu > .item:nth-child(4)"));
    expect(signupLink.nativeElement.innerHTML.trim()).toBe("Sign up");
  });

  it('should open drop down menu when clicking on menu link', ()=>{
    fixture.detectChanges();
    let menuLink = fixture.debugElement.query(By.css(".right.menu > .item:nth-child(1)"));
    menuLink.triggerEventHandler('click',null);
    fixture.whenStable().then(()=>{
      fixture.detectChanges();
      expect(component.showDropdown).toBe(true);
      let dropdownData = component.dropdownData.filter((item)=>{
        return !item.pageInProgress;
      });
      let titles = fixture.debugElement.queryAll(By.css(".sam-ui.labeled.icon.right.inverted.menu > .item"));
      for(var index in dropdownData){
        expect(titles[index].nativeElement.innerHTML).toContain(dropdownData[index].linkTitle);
      }
    });
  });
});
