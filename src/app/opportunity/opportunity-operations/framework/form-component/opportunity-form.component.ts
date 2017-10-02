import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'sam-ui-kit/components/sidenav';
import { AlertFooterService } from '../../../../app-components/alert-footer/alert-footer.service';
import { OpportunityAuthGuard } from '../../../components/authgaurd/authguard.service';
import { OpportunitySectionNames } from '../data-model/opportunity-form-constants';
import { OpportunityFormViewModel } from '../data-model/opportunity-form.model';
import { OpportunityFormService } from '../service/opportunity-form.service';

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-form.template.html',
  providers: []
})

export class OpportunityFormComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('titleModal') titleModal;
  @ViewChild('tabsOppComponent') tabsOppComponent;
  scrollToTop: boolean = true;
  isAdd: boolean = true;
  hasErrors: boolean = false;
  tabsComponent: any;
  noticeType: string;
  noticeTypeLabel: string;
  noticeTypeOptions = [];
  oppFormViewModel: OpportunityFormViewModel;
  currentSection: number;
  currentFragment: string;

  private routeSubscribe;
  private pristineIconClass = '';

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

  sections: string[] = [
    OpportunitySectionNames.HEADER_INFORMATION,
    OpportunitySectionNames.DESCRIPTION
  ];

  sectionLabels: any = [
    'Header Information',
    'Description'
  ];

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
    }]
  };


  constructor(private service: OpportunityFormService, private route: ActivatedRoute, private router: Router,
              private authGuard: OpportunityAuthGuard, private cdr: ChangeDetectorRef,
              private alertFooterService: AlertFooterService) {

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
    this.tabsComponent = this.tabsOppComponent;

    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {opp: {data}}) => {
        this.oppFormViewModel = new OpportunityFormViewModel(resolver.opp);
        this.oppFormViewModel.opportunityId = this.route.snapshot.params['id'];
        this.isAdd = false;
      });
    }
    else {
      this.oppFormViewModel = new OpportunityFormViewModel(null);
    }
    this.authGuard.checkPermissions('addoredit', this.oppFormViewModel);
    this.getNoticeType();
    let flag = this.determineLogin();
    if (!flag) {
      return;
    }
    this.determineSection();
  }

  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
  }

  getNoticeType() {
    if (this.oppFormViewModel.opportunityId) {
      this.noticeTypeLabel = 'Contract Opportunity Type';
      if (this.oppFormViewModel.opportunityType) {
        this.service.getOpportunityDictionary('procurement_type')
          .subscribe(api => {
              let data = api;
              if (data['procurement_type'] && data['procurement_type'].length > 0) {
                for (let paData of data['procurement_type']) {
                  this.noticeTypeOptions.push({key: paData.elementId, value: paData.value});
                }
              }
              let item = this.noticeTypeOptions.find(item => item.key === this.oppFormViewModel.opportunityType);
              this.noticeType = item.value;
            },
            error => {
              console.error('error getting notice type to api', error);
            });
      }
    }
  }

  ngAfterViewInit(): void {

    setTimeout(() =>{
      this.determineSection();
    });

  }

  determineLogin() {
    return this.authGuard.canActivate();
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
        this.gotoSection(OpportunitySectionNames.HEADER_INFORMATION);
        this.navigateSection(this.currentSection);
        this.sidenavSelection = this.sectionLabels[0];
      }
    });
  }

  gotoSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
  }

  navigateSection(section: number) {
    let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/edit' : '/opportunities/add';
    this.router.navigate([url], {
      fragment: this.sections[section],
      queryParams: this.route.snapshot.queryParams
    });
  }

  isSection(sectionName: string) {
    return this.currentSection == this.sections.indexOf(sectionName);
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
    //let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/review' : '/opp/workspace';
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
    let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/review' : '/opp/workspace';
    this.router.navigateByUrl(url);
  }

  gotoNextSection() {
    if (this.currentSection + 1 < this.sections.length) {
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
    this.sidenavSelection = this.sectionLabels[0];
    this.cdr.detectChanges();
    let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/edit'.concat('#' + this.sections[0]) : '/opportunities/add'.concat('#' + this.sections[0]);
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
    let url = '/opportunities/' + this.oppFormViewModel.opportunityId;
    this.router.navigateByUrl(url);
  }

  saveForm(actionType, navObj?: any) {
    if (!this.oppFormViewModel.title) {
      this.titleModal.openModal();
    } else {
    this.service.saveContractOpportunity(this.oppFormViewModel.opportunityId, this.oppFormViewModel.dataAndAdditionalInfo)
      .subscribe(api => {
          this.afterSaveAction(api);
          let section = this.sectionLabels[this.currentSection];
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
      url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/review' : '/opp/workspace';
      this.router.navigateByUrl(url);
    }
      if (actionType === 'SideNav') {
     let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/edit' : '/opportunities/add';
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
