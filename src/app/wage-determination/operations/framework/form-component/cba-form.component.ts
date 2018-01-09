import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AlertFooterService} from '../../../../app-components/alert-footer/alert-footer.service';
import {CBAAuthGuard} from '../../../components/authguard/authguard.service';
import {CBAFormViewModel} from '../data-model/form/cba-form.model';
import {CBAFormService} from '../service/form/cba-form.service';
import {CBASideNavService} from '../service/sidenav/cba-form-sidenav.service';
import {CBAFormErrorService} from '../../opportunity-form-error.service';
import {WageDeterminationService} from '../../../../../api-kit';
import {OpportunitySideNavService} from '../../../../opportunity/opportunity-operations/framework/service/sidenav/opportunity-form-sidenav.service';
import {UserService} from "../../../../role-management/user.service";

@Component({
  moduleId: __filename,
  templateUrl: 'cba-form.template.html',
  providers: []
})

export class CBAFormComponent implements OnInit, OnDestroy {
  @ViewChild('tabsCBAComponent') tabsCBAComponent;
  @ViewChildren('form') form;
  hasPermission: boolean = false;
  scrollToTop: boolean = true;
  isAdd: boolean = true;
  hasErrors: boolean = false;
  tabsComponent: any;
  wd: any;
  cbaFormViewModel: CBAFormViewModel;
  leadingErrorMsg: string;
  private routeSubscribe;
  sideNavSelection;
  sideNavModel;
  sectionLength;
  successFooterAlertModel = {
    title: 'Success',
    description: '',
    type: 'success',
    timer: 5000
  };

  crumbs = [
    {
      breadcrumb: 'Workspace',
      urlmock: true
    }, {
      breadcrumb: 'Collective Bargaining Agreement',
      urlmock: true
    }, {
      breadcrumb: 'Create New',
      urlmock: false
    }];

  constructor(private service: WageDeterminationService, private route: ActivatedRoute, private router: Router,
              private authGuard: CBAAuthGuard, private cdr: ChangeDetectorRef,
              private sideNavService: CBASideNavService, private alertFooterService: AlertFooterService,
              private userService: UserService) {
    this.routeSubscribe = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.scrollToTop) {
          window.scrollTo(0, 0);
        } else {
          this.scrollToTop = true;
        }
      }
    });
  }

  ngOnInit(): void {
    this.sideNavService.refreshSideNav();
    this.sideNavModel = this.sideNavService.getSideNavModel();
    this.sideNavSelection = this.sideNavService.getSectionLabel(0);
    this.tabsComponent = this.tabsCBAComponent;
    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: { cba: { data } }) => {
        this.wd = resolver.cba;
        this.cbaFormViewModel = new CBAFormViewModel(resolver.cba);
        this.isAdd = false;
        this.hasPermission = this.authGuard.checkPermissions(this.wd);
        this.tabsComponent = this.tabsCBAComponent;
      });
    } else {
      this.cbaFormViewModel = new CBAFormViewModel(null);
      this.hasPermission = this.authGuard.checkPermissions(null);
    }
  }

  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
  }

  breadcrumbHandler(event) {
    if (event === 'Workspace') {
      this.router.navigate(['/workspace']);
    } else if (event === 'Collective Bargaining Agreement') {
      this.router.navigate(['/wage-determination/cba/workspace']);
    }
  }

  navHandler() {
    //  TODO: HANDLE SIDE NAV WHEN ACTION HISTORY READDED
  }

  public tabsClicked(tab) {
    switch (tab.label) {
      case 'Edit':
        break;
      case 'Public':
        this.onViewClick();
        break;
      default:
        break;
    }
  }

  onCancelClick() {
    let url = '/workspace';
    this.router.navigateByUrl(url);
  }

  onViewClick() {
    let url = '/wage-determination/cba/' + this.cbaFormViewModel.cbaId;
    this.router.navigateByUrl(url);
  }

  onSaveClick() {
    if (!this.cbaFormViewModel.organizationId) {
      let user = this.userService.getUser();
      this.cbaFormViewModel.organizationId = (user.officeID || user.agencyID || user.departmentID || '').toString()
    }

    this.service.saveCollectiveBargaining(this.cbaFormViewModel.cbaId, this.cbaFormViewModel.toAPI())
      .subscribe(api => {
        this.successFooterAlertModel.description = 'Collective Bargaining Agreement saved successfully.';
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
        this.router.navigateByUrl('/workspace');
      }, error => {
        console.error('error saving cba to api', error);
      });
  }
}
