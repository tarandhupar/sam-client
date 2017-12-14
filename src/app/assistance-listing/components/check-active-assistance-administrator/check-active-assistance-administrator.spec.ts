import {UserAccessService} from '../../../../api-kit/access/access.service';
import {AlertFooterService} from '../../../app-components/alert-footer/alert-footer.service';
import {CheckActiveAssistanceAdministratorComponent} from './check-active-assistance-administrator.component';
import {WrapperService} from '../../../../api-kit/wrapper/wrapper.service';
import {Observable} from "rxjs";

class UserAccessServiceTest extends UserAccessService {
  findUsers(queryParams:any = {}) {
    if (queryParams['orgKey'] == '123,123') {
      return Observable.of([{}]);
    } else {
      return Observable.of(null);
    }
  }
}

//Isolated Testing
describe('src/app/assistance-listing/components/check-active-assistance-administrator/check-active-assistance-administrator.spec.ts', () => {
  let userAccessService: UserAccessServiceTest;
  let alertFooterService: AlertFooterService;
  let comp: CheckActiveAssistanceAdministratorComponent;
  let wrapper: WrapperService;
  let route = {};

  beforeEach(() => {
    userAccessService = new UserAccessServiceTest(wrapper, <any>route);
    comp = new CheckActiveAssistanceAdministratorComponent(userAccessService, alertFooterService);
    comp.organization = {
      fullParentPath: "123.123"
    };
  });

  it('Isolated unit test: Init component shouldn\'t show the error message test 1', function () {
    comp.ngOnChanges();

    expect(comp.showAlert).toBe(false);
  });

  it('Isolated unit test: Init component shouldn\'t show the error message test 2', function () {
    comp.organization = null;
    comp.ngOnChanges();

    expect(comp.showAlert).toBe(false);
  });

  it('Isolated unit test: Init component should show the error message', function () {
    comp.organization.fullParentPath = "123.123.123";
    comp.ngOnChanges();

    expect(comp.showAlert).toBe(true);
  });
});
