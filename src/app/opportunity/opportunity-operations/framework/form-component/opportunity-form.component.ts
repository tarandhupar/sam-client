import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertFooterService } from '../../../../app-components/alert-footer/alert-footer.service';
import { OpportunityAuthGuard } from '../../../components/authgaurd/authguard.service';
import { OpportunitySectionNames } from '../data-model/opportunity-form-constants';
import { OpportunityFormViewModel } from '../data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../service/opportunity-form/opportunity-form.service';
import { OpportunitySideNavService } from '../service/sidenav/opportunity-form-sidenav.service';

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-form.template.html',
  providers: []
})

export class OpportunityFormComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('titleModal') titleModal;
  @ViewChild('tabsOppComponent') tabsOppComponent;
  hasPermission: boolean = false;
  scrollToTop: boolean = true;
  isAdd: boolean = true;
  hasErrors: boolean = false;
  tabsComponent: any;
  notice: any;
  noticeType: string;
  noticeTypeLabel: string;
  noticeTypeOptions = [];
  oppFormViewModel: OpportunityFormViewModel;
  currentSection: number;
  currentFragment: string;

  private routeSubscribe;
  sidenavSelection;
  sidenavModel;
  sectionLength;

  titleMissingConfig = {
    title: 'No Title Provided',
    description: 'You must provide a title for this draft opportunity in order to proceed.',
    closeText: 'Close'
  };

  successFooterAlertModel = {
    title: "Success",
    description: "",
    type: "success",
    timer: 5000
  };

  crumbs = [{url: '/', breadcrumb: 'Home', urlmock: false}, {
    breadcrumb: 'Workspace',
    urlmock: true
  }, {breadcrumb: 'Opportunities', urlmock: false}];

  constructor(private service: OpportunityFormService, private route: ActivatedRoute, private router: Router,
              private authGuard: OpportunityAuthGuard, private cdr: ChangeDetectorRef,
              private alertFooterService: AlertFooterService, private sidenavService: OpportunitySideNavService) {

    // jump to top of page when changing sections
    this.routeSubscribe = this.router.events.subscribe(event => {
      // hack to avoid jumpiness when changing from /add to /edit
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
    this.sidenavModel = this.sidenavService.getSideNavModel();
    this.sectionLength = this.sidenavService.getSections().length;
    this.tabsComponent = this.tabsOppComponent;

    if (this.route.snapshot.params['id']) { //edit page
      this.route.data.subscribe((resolver: {opp: {data}}) => {
        this.notice = resolver.opp;
        this.oppFormViewModel = new OpportunityFormViewModel(resolver.opp);
        this.oppFormViewModel.opportunityId = this.route.snapshot.params['id'];
        this.isAdd = false;
        this.hasPermission = this.authGuard.checkPermissions('addoredit', this.notice);
        this.determineSection();
      });
    } else { // add page settings
      this.oppFormViewModel = new OpportunityFormViewModel(null);
      this.hasPermission = this.authGuard.checkPermissions('addoredit', null);
      this.determineSection();
    }

    this.getNoticeType();
  }

  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
  }

  getNoticeType() {
    if (this.oppFormViewModel.opportunityId) {
      this.noticeTypeLabel = 'Contract Opportunity Type';
      if (this.oppFormViewModel.oppHeaderInfoViewModel.opportunityType) {
        this.service.getOpportunityDictionary('procurement_type')
          .subscribe(api => {
              let data = api;
              if (data['procurement_type'] && data['procurement_type'].length > 0) {
                for (let paData of data['procurement_type']) {
                  this.noticeTypeOptions.push({key: paData.elementId, value: paData.value});
                }
              }
              let item = this.noticeTypeOptions.find(item => item.key === this.oppFormViewModel.oppHeaderInfoViewModel.opportunityType);
              this.noticeType = item.value;
            },
            error => {
              console.error('error getting notice type to api', error);
            });
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.determineSection();
    }, 200);
  }

  determineSection() {
    if (this.hasPermission) {
      this.route.fragment.subscribe((fragment: string) => {
        this.currentFragment = fragment;
        let section = '';

        if (fragment) {
          for (let s of this.sidenavService.getSections()) {
            if (fragment.indexOf(s) != -1) {
              section = s;
            }
          }
        }

        if (section) {
          this.gotoSection(section);
          this.sidenavSelection = this.sidenavService.getSectionLabel(this.currentSection);
          setTimeout(() => { // schedule scroll after angular change detection runs
            let field = document.getElementById(fragment.replace(new RegExp('^' + section + '-'), ''));
            if (field) {
              field.scrollIntoView();
            }
          }, 1000);
        } else {
          this.gotoSection(OpportunitySectionNames.HEADER_INFORMATION);
          this.navigateSection(this.currentSection);
          this.sidenavSelection = this.sidenavService.getSectionLabel(0);
        }
      });
    }
  }

  gotoSection(sectionName) {
    this.currentSection = this.sidenavService.getSectionIndex(sectionName);
  }

  navigateSection(section: number) {
    let url = this.oppFormViewModel.opportunityId ? '/opp/' + this.oppFormViewModel.opportunityId + '/edit' : '/opp/add';
    this.router.navigate([url], {
      fragment: this.sidenavService.getFragment(section),
      queryParams: this.route.snapshot.queryParams
    });
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sidenavService.getSectionIndex(sectionName);
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

  onSaveExitClick() {
    //let url = this.oppFormViewModel.opportunityId ? '/opp/' + this.oppFormViewModel.opportunityId + '/review' : '/opp/workspace';
    this.saveForm('SaveExit');
  }

  onSaveBackClick() {
    this.saveForm('SaveBack');
  }

  onSaveContinueClick() {
    this.saveForm('SaveContinue');
  }

  private afterSaveAction(api) {
    this.oppFormViewModel.opportunityId = api._body;
  }

  onCancelClick() {
    this.cancel();
  }

  cancel() {
    let url = this.oppFormViewModel.opportunityId ? '/opp/' + this.oppFormViewModel.opportunityId + '/review' : '/opp/workspace';
    this.router.navigateByUrl(url);
  }

  gotoNextSection() {
    if (this.currentSection + 1 < this.sectionLength) {
      ++this.currentSection;
    }
  }

  gotoPreviousSection() {
    if (this.currentSection - 1 >= 0) {
      --this.currentSection;
    }
  }

  breadCrumbClick(event) {
    if (event === 'Workspace') {
      this.router.navigate(['/opp/workspace']);
    }
  }

  navHandler(obj) {
    this.saveForm('SideNav', obj);
  }

  onTitleModalClose() {
    this.sidenavSelection = "";
    this.cdr.detectChanges();
    this.sidenavSelection = this.sidenavService.getSectionLabel(0);
    this.cdr.detectChanges();
    let url = this.oppFormViewModel.opportunityId ? '/opp/' + this.oppFormViewModel.opportunityId + '/edit'.concat('#' + this.sidenavService.getFragment(0)) : '/opp/add'.concat('#' + this.sidenavService.getFragment(0));
    this.router.navigateByUrl(url);
  }

  public tabsClicked(tab) {
    switch (tab.label) {
      case 'Authenticated':
        this.onSaveExitClick();
        break;
      case 'Public':
        this.onViewClick();
        break;
      default:
        break;
    }
  }

  public onViewClick() {
    let url = '/opp/' + this.oppFormViewModel.opportunityId;
    this.router.navigateByUrl(url);
  }

  saveForm(actionType, navObj?: any) {
    if (!this.oppFormViewModel.title) {
      this.titleModal.openModal();
    } else {
    this.service.saveContractOpportunity(this.oppFormViewModel.opportunityId, this.oppFormViewModel.dataAndAdditionalInfo)
      .subscribe(api => {
          this.afterSaveAction(api);
          let section = this.sidenavService.getSectionLabel(this.currentSection);
          this.successFooterAlertModel.description = section + ' saved successfully.';
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
          this.navigationOnAction(actionType, navObj);
        },
        error => {
          console.error('error saving opportunity to api', error);
        });
    }
  }

  navigationOnAction(actionType, navObj) {
    let url;
    if (actionType === 'SaveExit') {
      url = this.oppFormViewModel.opportunityId ? '/opp/' + this.oppFormViewModel.opportunityId + '/review' : '/opp/workspace';
      this.router.navigateByUrl(url);
    }
      if (actionType === 'SideNav') {
     let url = this.oppFormViewModel.opportunityId ? '/opp/' + this.oppFormViewModel.opportunityId + '/edit' : '/opp/add';
     this.router.navigate([url], {fragment: navObj.route.substring(1)});
     }
    if (actionType === 'SaveBack') {
      this.gotoPreviousSection();
      this.navigateSection(this.currentSection);
    }
    if (actionType === 'SaveContinue') {
      if (!this.isAdd) {
        this.gotoNextSection();
        this.navigateSection(this.currentSection);
      } else {
        this.scrollToTop = false;
        this.navigateSection(this.currentSection + 1);
      }
    }
  }

}
