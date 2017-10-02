import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FALFormService } from './fal-form.service';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FALFormViewModel } from './fal-form.model';
import { FALErrorDisplayComponent } from '../components/fal-error-display/fal-error-display.component';
import { FALSectionNames } from './fal-form.constants';
import { FALFormErrorService } from './fal-form-error.service';
import { AuthGuard } from '../../../api-kit/authguard/authguard.service';
import { MenuItem } from 'sam-ui-kit/components/sidenav';
import { FilterMultiArrayObjectPipe } from '../../app-pipes/filter-multi-array-object.pipe';
import { AlertFooterService } from '../../app-components/alert-footer/alert-footer.service';
import { ProgramService } from '../../../api-kit/program/program.service';
import { IBreadcrumb } from 'sam-ui-kit/types';

@Component({
  moduleId: __filename,
  templateUrl: 'fal-form.template.html',
  providers: [FALFormService, ProgramService]
})
export class FALFormComponent implements OnInit, OnDestroy, AfterViewInit {
  scrollToTop: boolean = true;
  isAdd: boolean = true;
  falFormViewModel: FALFormViewModel;
  createPermissions: any;
  @ViewChild('titleModal') titleModal;
  @ViewChild('tabsFalComponent') tabsFalComponent;
  hasErrors: any;
  tabsComponent: any;
  titleMissingConfig = {title: '', description: '', confirmText: '', cancelText: ''};
  sections: string[] = [
    FALSectionNames.HEADER,
    FALSectionNames.OVERVIEW,
    FALSectionNames.AUTHORIZATION,
    FALSectionNames.OBLIGATIONS,
    FALSectionNames.OTHER_FINANCIAL_INFO,
    FALSectionNames.CRITERIA_INFO,
    FALSectionNames.APPLYING_FOR_ASSISTANCE,
    FALSectionNames.COMPLIANCE_REQUIREMENTS,
    FALSectionNames.CONTACT_INFORMATION
  ];
  currentFragment: string;
  currentSection: number;
  leadingErrorMsg: string;
  globalLinksUrl: string;
  globalNavigationFlag: boolean = false;
  modelBtnsNavigationFlag: boolean = false;
  crumbs: Array<IBreadcrumb> = [{url: '/', breadcrumb: 'Home', urlmock: false}, {
    breadcrumb: 'My Workspace',
    urlmock: true
  }, {breadcrumb: 'Assistance Workspace', urlmock: true}];
  successFooterAlertModel = {
    title: "Success",
    description: "",
    type: "success",
    timer: 5000
  };
  notifySuccessFooterAlertModel = {
    title: "Success",
    description: "Successfully sent notification.",
    type: "success",
    timer: 3000
  };

  notifyErrorFooterAlertModel = {
    title: "Error",
    description: "Error sending notification.",
    type: "error",
    timer: 3000
  };
  @ViewChild('errorDisplay') errorDisplayComponent: FALErrorDisplayComponent;
  @ViewChildren('form') form;
  title: string;
  private routeSubscribe;
  private pristineIconClass = 'pending';
  private updatedIconClass = 'completed';
  private invalidIconClass = 'error';


  sectionLabels: any = [
    'Header Information',
    'Overview',
    'Authorizations',
    'Obligations',
    'Other Financial Info',
    'Criteria for Applying',
    'Applying For Assistance',
    'Compliance Requirements',
    'Contact Information'
  ];

  // todo: find a way to refactor this...
  sidenavSelection;
  sidenavModel: MenuItem = {
    label: "abc",
    children: [{
      label: this.sectionLabels[0],
      route: "#" + this.sections[0],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[1],
      route: "#" + this.sections[1],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[2],
      route: "#" + this.sections[2],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[3],
      route: "#" + this.sections[3],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[4],
      route: "#" + this.sections[4],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[5],
      route: "#" + this.sections[5],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[6],
      route: "#" + this.sections[6],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[7],
      route: "#" + this.sections[7],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[8],
      route: "#" + this.sections[8],
      iconClass: this.pristineIconClass
    }]
  };

  constructor(private service: FALFormService, private route: ActivatedRoute, private router: Router,
              private errorService: FALFormErrorService, private authGuard: AuthGuard, private cdr: ChangeDetectorRef, private alertFooterService: AlertFooterService,
              private programService: ProgramService) {
    // jump to top of page when changing sections
    let comp = this;
    this.routeSubscribe = this.router.events.subscribe(event => {
      // hack to avoid jumpiness when changing from /add to /edit
      if(event instanceof NavigationEnd) {
        if(this.scrollToTop) {
          window.scrollTo(0, 0);
        } else {
          this.scrollToTop = true;
        }
      }
      if (event.url === "/" || event.url === "/reports/overview" || event.url === "/workspace" || event.url === "/help/overview"
        || event.url === "/federal-hierarchy" || event.url === "/data-services" || event.url === "/profile") {
        comp.globalLinksUrl = event.url;
        if (comp.globalNavigationFlag) {
          if (event instanceof NavigationCancel) {
          }
        } else {
          if (event instanceof NavigationStart) {
            comp.formsDirtyCheck('links');
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {fal: {data}}) => {
        this.falFormViewModel = new FALFormViewModel(resolver.fal);
        this.falFormViewModel.programId = this.route.snapshot.params['id'];
        this.isAdd = false;
        this.errorService.viewModel = this.falFormViewModel;
        this.errorService.validateAll().subscribe(
          (event) => {
          },
          (error) => {
          },
          () => {
            this.tabsComponent = this.tabsFalComponent;
            this.updateSidenavModel();
            this.showErrors(this.errorService.applicableErrors);
          }
        );
      });
    } else {
      this.falFormViewModel = new FALFormViewModel(null);
      this.errorService.viewModel = this.falFormViewModel;
    }
    let flag = this.determineLogin();
    if (!flag) {
      return;
    }
    this.determineSection();
    this.service.getFALPermission('CREATE_FALS').subscribe(res => {
      this.errorDisplayComponent.formatErrors(this.errorService.applicableErrors);
      this.authGuard.checkPermissions('addoredit', this.falFormViewModel.programId ? this.falFormViewModel['_fal'] : res);
      this.title = this.falFormViewModel.title;
      this.updateBreadCrumbs();
      this.createPermissions = res;
      this.cdr.detectChanges();
    });
    this.tabsComponent = this.tabsFalComponent;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.determineSection();
    }, 200);
  }

  private updateSidenavModel() {
    for (let sectionName of this.sections) {
      this.updateSidenavIcon(sectionName);
    }
  }

  //  TODO: Migrate to external service?
  determineLogin() {
    let cookie = FALFormService.getAuthenticationCookie();
    if (cookie != null) {
      if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
        this.router.navigate(['accessrestricted']);
        return false;
      }
    } else if (cookie == null) {
      this.router.navigate(['signin']);
      return false;
    }

    return true;
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sections.indexOf(sectionName);
  }

  determineSection() {
    this.route.fragment.subscribe((fragment: string) => {
      this.currentFragment = fragment;
      let section = '';

      if (fragment) {
        for (let s of this.sections) {
          if (fragment.indexOf(s) != -1) {
            section = s;
          }
        }
      }

      if (section) {
        this.gotoSection(section);
        this.sidenavSelection = this.sectionLabels[this.currentSection];
        setTimeout(() => { // schedule scroll after angular change detection runs
          let field = document.getElementById(fragment.replace(new RegExp('^' + section + '-'), ''));
          if (field) {
            field.scrollIntoView();
          }
        }, 1000);
      } else {
        this.gotoSection(FALSectionNames.HEADER);
        this.navigateSection(this.currentSection);
        this.sidenavSelection = this.sectionLabels[0];
      }
    });
  }

  formActionHandler(obj) {
    switch (obj.event) {
      case "done":
        this.onSaveExitClick();
        break;
      case "back":
        this.onSaveBackClick();
        break;
      case "next":
        this.onSaveContinueClick();
        break;
      case "cancel":
        this.onCancelClick();
        break;
    }
  }

  //  TODO: Migrate to section service?
  gotoNextSection() {
    if (this.currentSection + 1 >= this.sections.length) {
      this.currentSection = this.sections.indexOf("review");
    } else {
      ++this.currentSection;
    }
  }

  gotoPreviousSection() {
    if (this.currentSection - 1 < 0) {
      this.currentSection = this.sections.indexOf("review");
    } else {
      --this.currentSection;
    }
  }

  gotoSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
  }

  onCancelClick() {
    let submitFragment = this.router.url.substring(this.router.url.lastIndexOf("#") + 1);
    if (submitFragment === 'review') {
      let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit' : '/programs/add';
      this.router.navigate([url], {fragment: this.sections[this.currentSection - 1]});
    } else {
      //  TODO: Add unsaved prompt
      this.cancel();
    }
  }

  cancel() {
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/review' : '/fal/workspace';
    this.router.navigateByUrl(url);
  }

  navigateSection(section: number) {
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit' : '/programs/add';
    this.router.navigate([url], {
      fragment: this.sections[section],
      queryParams: this.route.snapshot.queryParams
    });
  }

  onSaveExitClick() {
    this.formsDirtyCheck('SaveExit');
  }

  onSaveBackClick() {
    this.formsDirtyCheck('SaveBack');
  }

  onSaveContinueClick() {
    this.formsDirtyCheck('SaveContinue');
  }

  private beforeSaveAction() {
    for (let section of this.form._results) {
      if (section.beforeSaveAction) {
        section.beforeSaveAction();
      }
    }
    this.falFormViewModel.setSectionStatus(this.sections[this.currentSection], 'updated');
  }

  private afterSaveAction(api) {
    this.falFormViewModel.programId = api._body;
    if(!this.isAdd) {
      let sectionName = this.sections[this.currentSection];
      this.updateSidenavIcon(sectionName);
      this.showErrors(this.errorService.applicableErrors);
    }
  }

  private updateSidenavIcon(sectionName: string) {
    let hasError = FALFormErrorService.hasErrors(FALFormErrorService.findErrorById(this.errorService.errors, sectionName));
    let status = this.falFormViewModel.getSectionStatus(sectionName);
    let iconClass = this.pristineIconClass;
    if (status === 'updated') {
      if (hasError) {
        iconClass = this.invalidIconClass;
      } else {
        iconClass = this.updatedIconClass;
      }
    } else if (status === 'pristine') {
      iconClass = this.pristineIconClass;
    }

    let filter = new FilterMultiArrayObjectPipe();
    let section = filter.transform([this.sectionLabels[this.sections.indexOf(sectionName)]], this.sidenavModel.children, 'label', true, 'children')[0];
    section['iconClass'] = iconClass;

    // todo: avoid calling this twice on page load
    // if (sectionName === FALSectionNames.OBLIGATIONS || sectionName === FALSectionNames.OTHER_FINANCIAL_INFO) {
    //   this.updateFinancialIcon();
    // }
  }

  // todo: find a better way to do this
  private updateFinancialIcon() {
    let filter = new FilterMultiArrayObjectPipe();
    let section = filter.transform(["4. Financial Information"], this.sidenavModel.children, 'label', true, 'children')[0];

    /*
     * If all subsections are pristine, then financial information section is pristine
     * If all subsections are valid, then financial information section is valid
     * Otherwise, financial information section is invalid
     */
    let obligationStatus = this.falFormViewModel.getSectionStatus(FALSectionNames.OBLIGATIONS);
    let otherFinancialInfoStatus = this.falFormViewModel.getSectionStatus(FALSectionNames.OTHER_FINANCIAL_INFO);
    let status = 'updated';

    if (obligationStatus === 'pristine' && otherFinancialInfoStatus === 'pristine') {
      status = 'pristine';
    }

    let obligationHasErrors = FALFormErrorService.hasErrors(FALFormErrorService.findErrorById(this.errorService.errors, FALSectionNames.OBLIGATIONS));
    let otherFinancialInfoHasErrors = FALFormErrorService.hasErrors(FALFormErrorService.findErrorById(this.errorService.errors, FALSectionNames.OTHER_FINANCIAL_INFO));
    let iconClass = this.pristineIconClass;
    if (status === 'updated') {
      if (obligationHasErrors || obligationStatus === 'pristine' || otherFinancialInfoHasErrors || otherFinancialInfoStatus === 'pristine') {
        iconClass = this.invalidIconClass;
      } else {
        iconClass = this.updatedIconClass;
      }
    }

    section['iconClass'] = iconClass;
  }

  navHandler(obj) {
    this.formsDirtyCheck('SideNav', obj);
  }

  public showErrors(errors) {
    this.errorDisplayComponent.formatErrors(errors);
    this.hasErrors = FALFormErrorService.hasErrors(this.errorService.errors);
    this.updateSidenavModel();
    this.cdr.detectChanges();
  }

  updateLeadingMsg(msg) {
    this.leadingErrorMsg = msg;
    this.cdr.detectChanges();
  }

  breadCrumbClick(event) {
    let actionType = event;
    if (actionType === 'My Workspace') {
      this.globalNavigationFlag = true;
      this.formsDirtyCheck('Workspace');
      this.globalLinksUrl = '/workspace';

    }
    if (actionType === 'Assistance Workspace') {
      this.formsDirtyCheck('falWorkspace');
      this.globalLinksUrl = 'fal/workspace';
    }

  }

  onTitleModalNo() {
    if (!this.modelBtnsNavigationFlag) {
      this.globalNavigationFlag = true;
      this.router.navigateByUrl(this.globalLinksUrl);
    }
    this.modelBtnsNavigationFlag = false;
  }

  onTitleModalYesorClose() {
    this.modelBtnsNavigationFlag = true;
    this.sidenavSelection = "";
    this.cdr.detectChanges();
    this.sidenavSelection = "Header Information";
    this.cdr.detectChanges();
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit'.concat('#header-information') : '/programs/add'.concat('#header-information');
    this.globalLinksUrl = url;
    this.titleModal.closeModal();
    this.globalNavigationFlag = false;
    this.router.navigateByUrl(url);
  }

  public checkNavigation(target) {
    if (target.url === this.router.url) {
      let field = document.getElementById(target.fieldId);
      if (field) {
        field.scrollIntoView();
      }
    }
  }

  formsDirtyCheck(actionType, navObj?: any) {
    if (actionType !== 'Workspace' && actionType !== 'Home' && actionType !== 'links' && actionType !== 'falWorkspace') {
      if (!this.falFormViewModel.title) {
        let title = 'No Title Provided';
        let description = 'You must provide a title for this draft assistance listing in order to proceed.';
        let confirmText = 'Close';
        this.titleModelConfig(title, description, confirmText, '');
        this.titleModal.openModal();
      } else {
        //  TODO: Support partial update?
        this.checkFormDirtyStatus(actionType, navObj);
      }
    } else {
      this.checkFormDirtyStatus(actionType, navObj);
    }
  }

  checkFormDirtyStatus(actionType, navObj?: any) {
    for (let section of this.form._results) {
      if (section.falHeaderInfoForm) {
        this.saveFormOnDirty(section.falHeaderInfoForm, false, navObj, actionType);
      }
      if (section.falOverviewForm) {
        this.saveFormOnDirty(section.falOverviewForm, false, navObj, actionType);
      }
      if (section.falAuthForm) {
        this.saveFormOnDirty(section.falAuthForm, true, navObj, actionType, section.authSubForm.falAuthSubForm);
      }
      if (section.finObligationsForm) {
        this.saveFormOnDirty(section.finObligationsForm, true, navObj, actionType, section.obligationSubForm.falObligationSubForm);
      }
      if (section.otherFinancialInfoForm) {
        this.saveFormOnDirty(section, true, navObj, actionType);
      }
      if (section.falCriteriaForm) {
        this.saveFormOnDirty(section.falCriteriaForm, false, navObj, actionType);
      }
      if (section.falAssistanceForm) {
        this.saveFormOnDirty(section.falAssistanceForm, true, navObj, actionType, section.falAssistanceForm.controls.deadlines);
      }
      if (section.complianceRequirementsGroup) {
        this.saveFormOnDirty(section.complianceRequirementsGroup, false, navObj, actionType);
      }
      if (section.falContactInfoForm) {
        this.saveFormOnDirty(section.falContactInfoForm, false, navObj, actionType);
      }
    }
  }

  saveFormOnDirty(form, subFormFlag, navObj, actionType, subForm?: any) {
    if (subFormFlag === true) {
      let dirty = false;
      if (form.otherFinancialInfoForm) {
        if (form.otherFinancialInfoForm.dirty || form.otherFinancialInfoForm.controls.accountIdentification.dirty || form.otherFinancialInfoForm.controls.tafs.dirty) {
          dirty = true;
        }
      } else if (form.dirty || subForm.dirty) {
        dirty = true;
      }
      this.saveAction(dirty, navObj, actionType);
    } else {
      this.saveAction(form.dirty, navObj, actionType);
    }
  }

  saveAction(dirtyFlag, navObj, actionType) {
    if (dirtyFlag) {
      if (actionType !== 'Workspace' && actionType !== 'Home' && actionType !== 'links' && actionType !== 'falWorkspace') {
        this.saveForm(navObj, actionType);
      } else {
        if (!this.falFormViewModel.title) {
          this.navigateSection(this.currentSection);
          let title = 'No Title Provided';
          let description = 'You must provide a title in order to save this draft assistance listing. <br>Do you wish to return to the listing to enter a title? <br>Select "yes" to return to the listing, or select "no" to navigate away from the listing without saving.';
          let confirmText = 'Yes';
          let cancelText = 'No';
          this.titleModelConfig(title, description, confirmText, cancelText);
        } else {
          this.saveForm(navObj, actionType);
        }
      }
    } else {
      this.navigationOnAction(actionType, navObj);
    }
  }

  titleModelConfig(title, description, confirmText, cancelText) {
    this.titleModal.openModal();
    this.titleMissingConfig.title = title;
    this.titleMissingConfig.description = description;
    this.titleMissingConfig.confirmText = confirmText;
    this.titleMissingConfig.cancelText = cancelText;
  }

  saveForm(navObj, actionType) {
    this.beforeSaveAction();
    this.service.saveFAL(this.falFormViewModel.programId, this.falFormViewModel.dataAndAdditionalInfo)
      .subscribe(api => {
        this.afterSaveAction(api);
        let section = this.sectionLabels[this.currentSection];
        this.successFooterAlertModel.description = section + ' saved successfully.';
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
        this.navigationOnAction(actionType, navObj);
      },
      error => {
        console.error('error saving assistance listing to api', error);
      });
  }

  navigationOnAction(actionType, navObj) {
    let url;
    if (actionType === 'SaveExit') {
      url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/review' : '/fal/workspace';
      this.router.navigate([url]);
    }
    if (actionType === 'SideNav') {
      url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit' : '/programs/add';
      if(this.isAdd) {
        this.scrollToTop = false;
      }
      this.router.navigate([url], {fragment: navObj.route.substring(1)});
    }
    if (actionType === 'SaveBack') {
      this.gotoPreviousSection();
      this.navigateSection(this.currentSection);
    }
    if (actionType === 'SaveContinue') {
      // hack to avoid triggering refresh when going from /add to /edit
      if (!this.isAdd) {
        this.gotoNextSection();
        this.navigateSection(this.currentSection);
      } else {
        this.scrollToTop = false;
        this.navigateSection(this.currentSection+1);
      }
    }
    if (actionType === 'Workspace') {
      this.router.navigate(['/workspace']);
    }
    if (actionType === 'falWorkspace') {
      this.router.navigate(['/fal/workspace']);
    }
    if (actionType === 'PublicView') {
      let url = '/programs/' + this.falFormViewModel.programId + '/view';
      this.router.navigateByUrl(url);
    }
    if (actionType === 'Submit') {
      let url = '/programs/' + this.falFormViewModel.programId + '/submit';
      this.router.navigateByUrl(url);
    }
    if (actionType === 'Notify') {
      this.notifyAgencyCoordinator();
    }
    if (this.falFormViewModel.programId && this.title !== this.falFormViewModel.title) {
      this.crumbs = [];
      this.crumbs = [{url: '/', breadcrumb: 'Home', urlmock: false},
                     {breadcrumb: 'My Workspace', urlmock: true},
                     {breadcrumb: 'Assistance Workspace', urlmock: true},
                     {breadcrumb: this.falFormViewModel.title, urlmock: false}];
    }
    this.cdr.detectChanges();
  }

  onViewClick() {
    this.formsDirtyCheck('PublicView')
  }

  onSubmitClick() {
    this.formsDirtyCheck('Submit');
  }

  onNotifyClick() {
    this.formsDirtyCheck('Notify');
  }

  notifyAgencyCoordinator() {
    this.service.sendNotification(this.falFormViewModel.programId)
      .subscribe(api => {
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifySuccessFooterAlertModel)));
          this.router.navigate(['/fal/workspace']);
        },
        error => {
          console.error('error sending notification', error);
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyErrorFooterAlertModel)));
        });
  }

  public tabsClicked(tab) {
    switch (tab.label) {
      case 'Authenticated':
        this.onSaveExitClick();
        break;
      case 'Public':
        this.onViewClick();
        break;
      case 'Submit':
        this.onSubmitClick();
        break;
      case 'Notify Agency Coordinator':
        this.onNotifyClick();
        break;
      default:
        break;
    }
  }
  updateBreadCrumbs() {
    if (this.falFormViewModel.programId) {
      this.crumbs.push({breadcrumb: this.falFormViewModel.title, urlmock: false});
    } else {
      this.crumbs.push({breadcrumb: 'New Assistance Listing', urlmock: false});
    }
    this.cdr.detectChanges();
  }
}
