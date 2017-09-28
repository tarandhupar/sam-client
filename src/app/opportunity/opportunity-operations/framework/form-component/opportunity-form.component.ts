import {Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OpportunityAuthGuard } from '../../../components/authgaurd/authguard.service';
import { OpportunityFormService } from '../service/opportunity-form.service';
import { OpportunityFormViewModel } from '../data-model/opportunity-form.model';
import { AlertFooterService } from '../../../../app-components/alert-footer/alert-footer.service';
import { MenuItem } from 'sam-ui-kit/components/sidenav';
import { OpportunitySectionNames } from '../data-model/opportunity-form-constants';

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-form.template.html',
  providers: []
})

export class OpportunityFormComponent implements OnInit, OnDestroy, AfterViewInit {

  scrollToTop: boolean = true;
  isAdd: boolean = true;
  hasErrors: boolean = false;
  tabsComponent: any;
  @ViewChild('titleModal') titleModal;
  @ViewChild('tabsOppComponent') tabsOppComponent;
  titleMissingConfig = {
    title: 'No Title Provided',
    description: 'You must provide a title for this draft opportunity in order to proceed.',
    closeText: 'Close'
  };

  oppFormViewModel: OpportunityFormViewModel;

  private routeSubscribe;
  private pristineIconClass = '';

  currentSection: number;
  currentFragment: string;

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
              private authGuard: OpportunityAuthGuard, private cdr: ChangeDetectorRef, private alertFooterService: AlertFooterService,
              private oppService: OpportunityFormService) {

    // jump to top of page when changing sections
    this.routeSubscribe = this.router.events.subscribe(event => {
      // hack to avoid jumpiness when changing from /add to /edit
      if(event instanceof NavigationEnd) {
        if(this.scrollToTop) {
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
      this.route.data.subscribe((resolver: {fal: {data}}) => {
        this.oppFormViewModel = new OpportunityFormViewModel(resolver.fal);
        this.oppFormViewModel.opportunityId = this.route.snapshot.params['id'];
        this.isAdd = false;
      });
    }
    else {
      this.oppFormViewModel = new OpportunityFormViewModel(null);
    }

    let flag = this.determineLogin();
    if(!flag) {
      return;
    }
    this.determineSection();
  }

  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
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
    //let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/review' : '/opportunities/workspace';
    let url = '/search?keywords=&index=opp&page=1&is_active=true';
    this.router.navigateByUrl(url);
  }

  onSaveBackClick() {
    this.gotoPreviousSection();
    this.navigateSection(this.currentSection);
  }

  onSaveContinueClick() {
    if (!this.isAdd) {
      this.gotoNextSection();
      this.navigateSection(this.currentSection);
    } else {
      this.scrollToTop = false;
      this.navigateSection(this.currentSection+1);
    }
  }

  onCancelClick() {
      this.cancel();
  }

  cancel() {
    //let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/review' : '/opportunities/workspace';
    let url = '/search?keywords=&index=opp&page=1&is_active=true';
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
      this.router.navigate(['/opportunities/workspace']);
    }
  }

  navHandler(obj) {
    let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/edit' : '/opportunities/add';
    this.router.navigate([url], {fragment: obj.route.substring(1)});
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

  public onViewClick(){
    let url = '/opportunities/' + this.oppFormViewModel.opportunityId ;
    this.router.navigateByUrl(url);
  }

}
