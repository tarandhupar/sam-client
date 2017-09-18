import {Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from "../../../api-kit/authguard/authguard.service";
import { OpportunityFormService } from "./opportunity-form.service";
import { OpportunityFormViewModel } from "./opportunity-form.model";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { MenuItem } from 'sam-ui-kit/components/sidenav';
import { OpportunitySectionNames } from './opportunity-form-constants';

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-form.template.html',
  providers: []
})

export class OpportunityFormComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('titleModal') titleModal;
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
    OpportunitySectionNames.NOTICE_TYPE,
  ];

  sectionLabels: any = [
    'Notice Type'
  ];

  sidenavSelection;
  sidenavModel: MenuItem = {
    label: "abc",
    children: [{
      label: this.sectionLabels[0],
      route: "#" + this.sections[0],
      iconClass: this.pristineIconClass
    }]
  };


  constructor(private service: OpportunityFormService, private route: ActivatedRoute, private router: Router,
              private authGuard: AuthGuard, private cdr: ChangeDetectorRef, private alertFooterService: AlertFooterService,
              private oppService: OpportunityFormService) {
    // jump to top of page when changing sections
    this.routeSubscribe = this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.route.data.subscribe((resolver: {fal: {data}}) => {
        this.oppFormViewModel = new OpportunityFormViewModel(resolver.fal);
        this.oppFormViewModel.opportunityId = this.route.snapshot.params['id'];
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
    setTimeout(() => {
      this.determineSection();
    });
  }

  determineLogin() {
    let cookie = OpportunityFormService.getAuthenticationCookie();
    if (cookie != null && cookie != 'undefined') {
      if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
        this.router.navigate(['accessrestricted']);
        return false;
      }
    } else if (cookie == null || cookie == 'undefined') {
      this.router.navigate(['signin']);
      return false;
    }

    return true;
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
        this.gotoSection(OpportunitySectionNames.NOTICE_TYPE);
        this.navigateSection();
        this.sidenavSelection = this.sectionLabels[0];
      }
    });
  }

  gotoSection(sectionName) {
    this.currentSection = this.sections.indexOf(sectionName);
  }

  navigateSection() {
    let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/edit' : '/opportunities/add';
    this.router.navigate([url], {
      fragment: this.sections[this.currentSection],
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

  breadCrumbClick(event) {
    if (event === 'Workspace') {
      this.router.navigate(['/opportunities/workspace']);
    }
  }

  onTitleModalClose() {
    this.sidenavSelection = "";
    this.cdr.detectChanges();
    this.sidenavSelection = this.sectionLabels[0];
    this.cdr.detectChanges();
    let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId + '/edit'.concat('#' + this.sections[0]) : '/opportunities/add'.concat('#' + this.sections[0]);
    this.router.navigateByUrl(url);
  }

  onSaveExitClick() {
   this.router.navigateByUrl('/search?keywords=&index=opp&page=1&is_active=true');
  }

  onSaveBackClick() {
    this.router.navigateByUrl('/search?keywords=&index=opp&page=1&is_active=true');
  }

  onSaveContinueClick() {
    this.router.navigateByUrl('/search?keywords=&index=opp&page=1&is_active=true');
  }

  onCancelClick() {
      this.cancel();
  }

  cancel() {
    //let url = this.oppFormViewModel.opportunityId ? '/opportunities/' + this.oppFormViewModel.opportunityId : '/opportunities/workspace';
    let url = '/search?keywords=&index=opp&page=1&is_active=true';
    this.router.navigateByUrl(url);
  }
}
