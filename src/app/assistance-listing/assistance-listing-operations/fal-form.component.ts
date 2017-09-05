import {Component, OnInit, ViewChild, OnDestroy, ViewChildren, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {FALFormService} from "./fal-form.service";
import {ActivatedRoute, Router, NavigationStart, NavigationCancel} from '@angular/router';
import {FALFormViewModel} from "./fal-form.model";
import {FALErrorDisplayComponent} from '../components/fal-error-display/fal-error-display.component';
import {FALSectionNames} from './fal-form.constants';
import {FALFormErrorService} from './fal-form-error.service';
import {AuthGuard} from "../../../api-kit/authguard/authguard.service";
import {MenuItem} from 'sam-ui-kit/components/sidenav';
import {FilterMultiArrayObjectPipe} from '../../app-pipes/filter-multi-array-object.pipe';
import {AlertFooterService} from "../../alerts/alert-footer/alert-footer.service";
import {ProgramService} from "../../../api-kit/program/program.service";

@Component({
  moduleId: __filename,
  templateUrl: 'fal-form.template.html',
  providers: [FALFormService, ProgramService]
})
export class FALFormComponent implements OnInit, OnDestroy, AfterViewInit {
  falFormViewModel: FALFormViewModel;
  createPermissions: any;
  @ViewChild('titleModal') titleModal;
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
  crumbs = [{url: '/', breadcrumb: 'Home', urlmock: false}, {
    breadcrumb: 'Workspace',
    urlmock: true
  }, {breadcrumb: 'Assistance Listing', urlmock: false}];
  successFooterAlertModel = {
    title: "Success",
    description: "",
    type: "success",
    timer: 5000
  }
  @ViewChild('errorDisplay') errorDisplayComponent: FALErrorDisplayComponent;
  @ViewChildren('form') form;
  private routeSubscribe;
  private pristineIconClass = 'not started';
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
      window.scrollTo(0, 0);
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
        this.errorService.viewModel = this.falFormViewModel;
        this.errorService.initFALErrors();
      });
    } else {
      this.falFormViewModel = new FALFormViewModel(null);
      this.errorService.viewModel = this.falFormViewModel;
      this.errorService.initFALErrors();
    }
    let flag = this.determineLogin();
    if (!flag) {
      return;
    }
    this.determineSection();
    this.service.getFALPermission('CREATE_FALS').subscribe(res => {
      this.errorDisplayComponent.formatErrors(this.errorService.applicableErrors);
      this.authGuard.checkPermissions('addoredit', this.falFormViewModel.programId ? this.falFormViewModel['_fal'] : res);
      this.createPermissions = res;
    });

    this.makeSidenavModel();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateSidenavIcon(FALSectionNames.HEADER);
      this.determineSection();
    }, 200);
  }

  private makeSidenavModel() {
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
        this.navigateSection();
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

  navigateSection() {
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit' : '/programs/add';
    this.router.navigate([url], {
      fragment: this.sections[this.currentSection],
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

    let sectionName = this.sections[this.currentSection];
    this.updateSidenavIcon(sectionName);

    // todo: remove this once each section is updating errors
    this.showErrors(this.errorService.applicableErrors);
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
  }

  updateLeadingMsg(msg) {
    this.leadingErrorMsg = msg;
  }

  breadCrumbClick(event) {
    let actionType = event;
    if (actionType === 'Workspace') {
      this.formsDirtyCheck('Workspace');
      this.globalLinksUrl = 'fal/workspace';
    }
  }

  onTitleModalNo() {
    if(!this.modelBtnsNavigationFlag) {
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
    if (actionType !== 'Workspace' && actionType !== 'Home' && actionType !== 'links') {
      if (!this.falFormViewModel.title) {
        let title = 'No Title Provided';
        let description = 'You must provide a title for this draft assistance listing in order to proceed.';
        let confirmText = 'Close'
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
        this.saveFormOnDirty(section.otherFinancialInfoForm, false, navObj, actionType);
      }
      if (section.falCriteriaForm) {
        this.saveFormOnDirty(section.falCriteriaForm, false, navObj, actionType);
      }
      if (section.falAssistanceForm) {
        this.saveFormOnDirty(section.falAssistanceForm, false, navObj, actionType);
      }
      if (section.complianceRequirementsGroup) {
        this.saveFormOnDirty(section.complianceRequirementsGroup, false, navObj, actionType);
      }
      if (section.falContactInfoForm) {
        this.saveFormOnDirty(section.falContactInfoForm, false, navObj, actionType);
      }
    }
  }

  saveFormOnDirty(section, subsectionFlag, navObj, actionType, subsection?: any) {
    if (subsectionFlag === true) {
      let dirty = false;
      if (section.dirty || subsection.dirty) {
        dirty = true;
      }
      this.saveAction(dirty, navObj, actionType);
    } else {
      this.saveAction(section.dirty, navObj, actionType);
    }
  }

  saveAction(dirtyFlag, navObj, actionType) {
    if (dirtyFlag) {
      if (actionType !== 'Workspace' && actionType !== 'Home' && actionType !== 'links') {
        this.saveForm(navObj, actionType);
      } else {
        if (!this.falFormViewModel.title) {
          this.navigateSection();
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
          this.successFooterAlertModel.description = section + ' saved successfully.'
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
      this.router.navigate([url], {fragment: navObj.route.substring(1)});
    }
    if (actionType === 'SaveBack') {
      this.gotoPreviousSection();
      this.navigateSection();
    }
    if (actionType === 'SaveContinue') {
      this.gotoNextSection();
      this.navigateSection();
    }
    if (actionType === 'Workspace') {
      this.router.navigate(['/fal/workspace']);
    }
  }
  
  onViewClick() {
    let url = '/programs/' + this.falFormViewModel.programId + '/view';
    this.router.navigateByUrl(url);
  }
  
  public tabsClicked(tab){
    switch (tab.label) {
      case 'Auntheticated':
        this.onSaveExitClick();
        break;
      case 'Public':
        this.onViewClick();
        break;
      default:
        break;
    }
  }
  
}
