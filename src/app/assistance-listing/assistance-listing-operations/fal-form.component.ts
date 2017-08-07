import {Component, OnInit, ViewChild, OnDestroy, ViewChildren, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {FALFormService} from "./fal-form.service";
import {ActivatedRoute, Router} from '@angular/router';
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
  titleMissingConfig = {
    title: 'No Title Provided',
    description: 'You must provide a title for this draft assistance listing in order to proceed.',
    closeText: 'Close'
  };
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
  currentSection: number;
  leadingErrorMsg: string;
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
  private pristineIconClass = 'fa fa-circle-o section-pristine';
  private updatedIconClass = 'fa fa-check section-updated';
  private invalidIconClass = 'fa fa-exclamation-triangle section-invalid';

  sectionLabels: any = [
    '1. Header Information',
    '2. Overview',
    '3. Authorizations',
    'Obligations',
    'Other Financial Info',
    '5. Criteria for Applying',
    '6. Applying For Assistance',
    '7. Compliance Requirements',
    '8. Contact Information'
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
      label: "4. Financial Information",
      route: "#" + this.sections[3],
      iconClass: this.pristineIconClass,
      children: [{
        label: this.sectionLabels[3],
        route: "#" + this.sections[3],
        iconClass: this.pristineIconClass
      }, {
        label: this.sectionLabels[4],
        route: "#" + this.sections[4],
        iconClass: this.pristineIconClass
      }]
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
    this.routeSubscribe = this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
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

        this.service.getFederalHierarchyConfigurations(this.falFormViewModel.organizationId).subscribe( data => {
          let runValidationFlag = !data.programNumberAuto;
          let highRange = data.programNumberHigh;
          let lowRange = data.programNumberLow;

          this.errorService.validateHeaderProgNo(runValidationFlag, lowRange, highRange, FALFormService.getAuthenticationCookie(), this.programService).subscribe(res => {
            this.updateSidenavIcon(FALSectionNames.HEADER);
            this.showErrors(this.errorService.applicableErrors);
          });

        });
      });
    } else {
      this.falFormViewModel = new FALFormViewModel(null);
      this.errorService.viewModel = this.falFormViewModel;
      this.errorService.initFALErrors();
    }
    this.determineLogin();
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
      this.determineSection();
    }, 0);
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
      }
    } else if (cookie == null) {
      this.router.navigate(['signin']);
    }
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sections.indexOf(sectionName);
  }

  determineSection() {
    this.route.fragment.subscribe((fragment: string) => {
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
        }, 2000);
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
    if (sectionName === FALSectionNames.OBLIGATIONS || sectionName === FALSectionNames.OTHER_FINANCIAL_INFO) {
      this.updateFinancialIcon();
    }
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
    if (event === 'Workspace') {
      this.router.navigate(['/fal/workspace']);
    }
  }

  onTitleModalClose() {
    this.sidenavSelection = "";
    this.cdr.detectChanges();
    this.sidenavSelection = "1. Header Information";
    this.cdr.detectChanges();
    let url = this.falFormViewModel.programId ? '/programs/' + this.falFormViewModel.programId + '/edit'.concat('#header-information') : '/programs/add'.concat('#header-information');
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
    if (!this.falFormViewModel.title) {
      this.titleModal.openModal();
    } else {
      //  TODO: Support partial update?
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
      this.beforeSaveAction();
      this.service.saveFAL(this.falFormViewModel.programId, this.falFormViewModel.dataAndAdditionalInfo)
        .subscribe(api => {
            this.afterSaveAction(api);
            if (actionType === 'SideNav') {
              let section = this.sectionLabels[this.currentSection];
              let sectionLabel;
              if(section !== 'Obligations' && section !== 'Other Financial Info') {
                sectionLabel = section.split('.')[1];
              } else {
                sectionLabel = section;
              }
              this.successFooterAlertModel.description = sectionLabel + ' saved successfully.'
              this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
              this.navigationOnAction(actionType, navObj);
            }
            this.navigationOnAction(actionType, navObj);
          },
          error => {
            console.error('error saving assistance listing to api', error);
          });
    } else {
      this.navigationOnAction(actionType, navObj);
    }
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
  }
}
