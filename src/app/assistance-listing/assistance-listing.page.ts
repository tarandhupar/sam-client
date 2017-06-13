import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
import { SidenavService } from 'sam-ui-kit/components/sidenav/services/sidenav.service';
import * as Cookies from 'js-cookie';
import * as moment from 'moment';
import * as _ from 'lodash';

// Todo: avoid importing all of observable
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import {SidenavHelper} from '../app-utils/sidenav-helper';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing.page.html',
  providers: [
    FHService,
    ProgramService,
    DictionaryService,
    HistoricalIndexService,
    SidenavHelper
  ]
})
export class ProgramPage implements OnInit, OnDestroy {
  program: any;
  programID: any;
  federalHierarchy: any;
  relatedProgram: any[] = [];
  currentUrl: string;
  dictionaries: any;
  authorizationIdsGrouped: any[];
  history: any[];
  historicalIndex: any;
  alerts: any = [];
  errorOrganization: any;
  public logoUrl: any;
  public logoInfo: any;
  errorLogo: any;
  cookieValue: string;
  isCookie: boolean = false;
  assistanceTypes: any[] = [];
  //SideNav: On load select first item on sidenav component
  selectedPage: number = 0;
  private gotoPage;
  pageRoute: string;
  pageFragment: string;
  sidenavModel = {
    "label": "AL",
    "children": []
  };
  roles = [];
  roleFalg: boolean = false;
  qParams: any;
  @ViewChild('deleteModal') deleteModal;
  modalConfig = {title:'Delete Draft AL', description:''};
  changeRequestDropdown: any = {
    config: {
      "hint": "Actions",
      "name": "fal-change-request",
      "disabled": false,
    },
    permissions:null,
    defaultOption: "Make a Request"
  };

  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;
  private dictionarySub: Subscription;
  private federalHierarchySub: Subscription;
  private historicalIndexSub: Subscription;
  private relatedProgramsSub: Subscription;
  private rolesSub: Subscription;
  private reasonSub: Subscription;

  @ViewChild('editModal') editModal;


  constructor(private sidenavService: SidenavService,
              private sidenavHelper: SidenavHelper,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private historicalIndexService: HistoricalIndexService,
              private programService: ProgramService,
              private fhService: FHService,
              private dictionaryService: DictionaryService) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        this.pageFragment = tree.fragment;
      }
    });
    route.queryParams.subscribe(data => {
      this.qParams = data;
    });
  }

  ngOnInit() {
    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;

    let cookie = Cookies.get('iPlanetDirectoryPro');

    if (cookie != null) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.cookieValue = cookie;
      }
    }

    let programAPISource = this.loadProgram();
    this.loadDictionaries();
    this.loadFederalHierarchy(programAPISource);
    let historicalIndexAPISource = this.loadHistoricalIndex(programAPISource);
    this.loadRelatedPrograms(programAPISource);
    this.loadAssistanceTypes(programAPISource);
    let DOMReady$ = Observable.zip(programAPISource, historicalIndexAPISource).delay(2000);
    this.sidenavHelper.DOMComplete(this, DOMReady$);
    this.sidenavService.updateData(this.selectedPage, 0);

    if(this.cookieValue) {
      this.loadUserPermissions();
      //TODO check if this FAL has pending request, if so switch dropdown flag and add alert to link it to CR listing page
    }
  }

  sidenavPathEvtHandler(data) {
    this.sidenavHelper.sidenavPathEvtHandler(this, data);
  }

  selectedItem(item) {
    this.selectedPage = this.sidenavService.getData()[0];
  }

  ngOnDestroy() {
    if (this.apiSubjectSub) {
      this.apiSubjectSub.unsubscribe();
    }
    if (this.apiStreamSub) {
      this.apiStreamSub.unsubscribe();
    }
    if (this.dictionarySub) {
      this.dictionarySub.unsubscribe();
    }
    if (this.federalHierarchySub) {
      this.federalHierarchySub.unsubscribe();
    }
    if (this.historicalIndexSub) {
      this.historicalIndexSub.unsubscribe();
    }
    if (this.relatedProgramsSub) {
      this.relatedProgramsSub.unsubscribe();
    }
    if (this.reasonSub) {
      this.reasonSub.unsubscribe();
    }
    if (this.rolesSub) {
      this.rolesSub.unsubscribe();
    }
  }

  /**
   * @return Observable of Program API
   */
  private loadProgram() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      this.programID = params['id'];
      this.alerts = [];
      this.relatedProgram = [];
      return this.programService.getProgramById(params['id'], this.cookieValue);
    });
    this.apiStreamSub = apiStream.subscribe(apiSubject);

    this.apiSubjectSub = apiSubject.subscribe(api => {
      // run whenever api data is updated
      this.program = api;

      if (!this.program._links.self) {
        this.router.navigate['accessrestricted'];
      }

      this.checkCurrentFY();
      this.setAlerts();
      this.getRoles();

      if (this.program.data && this.program.data.authorizations) {
        this.authorizationIdsGrouped = _.values(_.groupBy(this.program.data.authorizations.list, 'authorizationId'));
      }

      this.pageRoute = "programs/" + this.program.id + "/view";
      let falSideNavContent = {
        "label": "Assistance Listing",
        "route": this.pageRoute,
        "children": []
      };
      if (this.program.status.code != 'published') {
        falSideNavContent.children.push({
          "label": "Header Information",
          "field": "#program-information",
        });
      }

      falSideNavContent.children.push.apply(falSideNavContent.children, [{
        "label": "Overview",
        "field": "#overview",
      },
        {
          "label": "Authorizations",
          "field": "#authorizations",
        },
        {
          "label": "Financial Information",
          "field": "#financial-information",
        },
        {
          "label": "Criteria for Applying",
          "field": "#criteria-for-applying",
        },
        {
          "label": "Applying for Assistance",
          "field": "#applying-for-assistance",
        },
        {
          "label": "Compliance Requirements",
          "field": "#compliance-requirements",
        },
        {
          "label": "Contact Information",
          "field": "#contact-information",
        },
        {
          "label": "History",
          "field": "#history",
        }]);

      this.sidenavHelper.updateSideNav(this, false, falSideNavContent);
    }, err => {
      this.router.navigate(['/404']);
    });

    return apiSubject;
  }

  /**
   * @return Observable of Dictionary API
   */
  private loadDictionaries() {
    // declare dictionaries to load
    let dictionaries = [
      'program_subject_terms',
      'date_range',
      'match_percent',
      'assistance_type',
      'applicant_types',
      'assistance_usage_types',
      'beneficiary_types',
      'functional_codes',
      'cfr200_requirements'
    ];

    let dictionaryServiceSubject = new ReplaySubject(1); // broadcasts the dictionary data to multiple subscribers
    // construct a stream of dictionary data
    this.dictionarySub = this.dictionaryService.getDictionaryById(dictionaries.join(',')).subscribe(dictionaryServiceSubject);

    var temp: any = {};
    dictionaryServiceSubject.subscribe(res => {
      // run whenever dictionary data is updated
      for (let key in res) {
        temp[key] = res[key]; // store the dictionary
      }
      this.dictionaries = temp;
    });

    return dictionaryServiceSubject;
  }

  private loadFederalHierarchy(apiSource: Observable<any>) {
    let apiSubject = new ReplaySubject(1);

    // construct a stream of federal hierarchy data
    let apiStream = apiSource.switchMap(api => {
      return this.fhService.getOrganizationById(api.data.organizationId, false);
    });

    apiStream.subscribe(apiSubject);

    this.federalHierarchySub = apiSubject.subscribe(res => {
      this.federalHierarchy = res['_embedded'][0]['org'];
      this.fhService.getOrganizationLogo(apiSubject,
        (logoData) => {
          if (logoData != null) {
            this.logoUrl = logoData.logo;
            this.logoInfo = logoData.info;
          } else {
            this.errorLogo = true;
          }
        }, (err) => {
          this.errorLogo = true;
        });
    }, err => {
      console.log('Error loading organization: ', err);
      this.errorOrganization = true;
    });

    return apiSubject;
  }

  private loadHistoricalIndex(apiSource: Observable<any>) {
    // construct a stream of historical index data
    let historicalIndexStream = apiSource.switchMap(api => {
      return this.historicalIndexService.getHistoricalIndexByProgramNumber(api.id, api.data.programNumber);
    });

    this.historicalIndexSub = historicalIndexStream.subscribe(res => {
      // run whenever historical index data is updated
      this.historicalIndex = res._embedded ? res._embedded.historicalIndex : []; // store the historical index
      let pipe = new HistoricalIndexLabelPipe();
      this.history = _.map(this.historicalIndex, function (value) {
        return {
          "id": value.id,
          "index": value.index,
          "date": value.fiscalYear,
          "title": pipe.transform(value.actionType),
          "description": value.changeDescription
        }
      });
      this.history = _.sortBy(this.history, ['index']);
    });

    return historicalIndexStream;
  }

  private loadRelatedPrograms(apiSource: Observable<any>) {
    // construct a stream of related programs ids
    let relatedProgramsIdStream = apiSource.switchMap(api => {
      if (api.data.relatedPrograms && api.data.relatedPrograms.length > 0) {
        return Observable.from(api.data.relatedPrograms);
      }
      return Observable.empty<string>(); // if there are no related programs, don't trigger an update
    });

    // construct a stream that contains all related programs from related program ids
    let relatedProgramsStream = relatedProgramsIdStream.flatMap((relatedId: any) => {
      return this.programService.getProgramById(relatedId, this.cookieValue).retryWhen(
        errors => {
          return this.route.params;
        }
      );
    });

    this.relatedProgramsSub = relatedProgramsStream.subscribe((relatedProgram: any) => {
      // run whenever related programs are updated
      if (typeof relatedProgram !== 'undefined') {
        this.relatedProgram.push({ // store the related program
          'programNumber': relatedProgram.data.programNumber,
          'id': relatedProgram.id
        });
      }
    }, error => {
      console.log("loadRelatedPrograms() Error ", error)
    }, () => {
      console.log("loadRelatedPrograms() Completed")
    });

    return relatedProgramsStream;
  }

  private checkCurrentFY() {
    // check if this program has changed in this FY, if not, display an alert
    // does not apply to draft FALs
    if (this.program.status && this.program.status.code && this.program.status.code === 'draft') {
      return;
    }


    if ((new Date(this.program.publishedDate)).getFullYear() < new Date().getFullYear()) {
      this.alerts.push({
        'labelname': 'not-updated-since', 'config': {
          'type': 'warning', 'title': '', 'description': 'Note: \n\
This Assistance Listing was not updated by the issuing agency in ' + (new Date()).getFullYear() + '. \n\
Please contact the issuing agency listed under "Contact Information" for more information.'
        }
      });
    }
  }

  private loadAssistanceTypes(apiSource: Observable<any>) {
    apiSource.subscribe(api => {
      if (api.data.financial && api.data.financial.obligations && api.data.financial.obligations.length > 0) {
        this.assistanceTypes = _.map(api.data.financial.obligations, 'assistanceType');
      }

      if (api.data.assistanceTypes && api.data.assistanceTypes.length > 0) {
        this.assistanceTypes = _.union(this.assistanceTypes, api.data.assistanceTypes);
      }
    });
  }

  private toTheTop() {
    document.body.scrollTop = 0;
  }

  private loadUserPermissions(){
    let apiSubject = new ReplaySubject();

    this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS').subscribe(apiSubject);

    apiSubject.subscribe(res => {
      this.changeRequestDropdown.permissions = res;
    });

    return apiSubject;
  }

  public onChangeRequestSelect(event) {
    if(event.value === 'archive_request') {
      this.router.navigateByUrl('programs/' + event.program.id + '/archive-request');
    }
  }

  public canEdit() {
    // show edit button if user has update permission, except on published FALs, or if user has revise permission
    if (this.program._links && this.program._links['program:update'] && this.program.status && this.program.status.code !== 'published') {
      return true;
    } else if (this.program._links && this.program._links['program:revise']) {
      return true;
    }

    return false;
  }

  public canDelete() {
    return this.program.status && this.program.status.code === 'draft' && this.program._links && this.program._links['program:delete'];
  }

  public onEditClick(page: string[]) {
    if (this.program._links && this.program._links['program:update'] && this.program._links['program:update'].href) {
      let id = this.program._links['program:update'].href.match(/\/programs\/(.*)\/edit/)[1]; // extract id from hateoas edit link
      let url = '/programsForm/' + id + '/edit'.concat(page.toString());
      this.router.navigateByUrl(url);
    } else if (this.program._links && this.program._links['program:revise']) {
      this.editModal.openModal(page.toString());
    }
  }

  public onEditModalSubmit(page: any[]) {
    this.editModal.closeModal();
    this.programService.reviseProgram(this.programID, this.cookieValue).subscribe(res => {
      let url = '/programsForm/' + JSON.parse(res._body).id + '/edit'.concat(page[0]);
      this.router.navigateByUrl(url);
    });
  }

  public onDeleteClick() {
    this.deleteModal.openModal();
    let title = this.program.data.title;
    if (title !== undefined) {
      this.modalConfig.description = 'Please confirm that you want to delete "' + title + '".';
    } else {
      this.modalConfig.description = 'Please confirm that you want to delete draft AL.';
    }
  }

  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.programService.deleteProgram(this.programID, this.cookieValue).subscribe(res => {
      this.router.navigate(['/fal/workspace']);
    }, err => {
      // todo: show error message when failing to delete
      console.log('Error deleting program ', err);
    });
  }

  public getCurrentFY(event) {
    return moment().quarter() === 4 ? moment().add('year', 1).year() : moment().year()
  }

  // different alerts are shown depending on the FAL's status
  private setAlerts() {
    let draftAlert = {
      'labelname': 'draft-fal-alert',
      'config': {
        'type': 'info',
        'title': '',
        'description': 'This is a draft Assistance Listing. Any updates will need to be published before the public is able to view the changes.'
      }
    };

    let publishedAlert = {
      'labelname': 'published-fal-alert',
      'config': {
        'type': 'info',
        'title': '',
        'description': 'This is the currently published version of this program.'
      }
    };

    let rejectedAlert = {
      'labelname': 'rejected-fal-alert',
      'config': {
        'type': 'error',
        'title': 'Rejected',
        'description': ''
      }
    };

    // show correct alert based on current status
    let status = this.program.status;
    let code = status.code ? status.code : null;
    switch (code) {
      case 'draft':
        // alert for draft version
        this.alerts.push(draftAlert);
        break;

      case 'published':
        // alert for latest published version, which is only shown to logged in users
        if (this.cookieValue && this.program.latest === true) {
          this.alerts.push(publishedAlert);
        }
        break;

      case 'rejected':
        // alert for rejected message, which is only shown to users with permission
        if (this.program._links && this.program._links['program:request:action:reject']) {
          let link = this.program._links['program:request:action:reject'];
          if (link.href) {
            let id = link.href.match(/\/programRequests\/(.*)/)[1];
            this.programService.getReasons(id, this.cookieValue).subscribe(reject => {
              rejectedAlert.config.description = reject.reason;
              this.alerts.push(rejectedAlert);
            });
          }
        }
        break;

      default:
        // noop
        break;
    }
  }

  onRejectClick() {
    let url = '/programs/' + this.program.id + '/reject';
    this.router.navigateByUrl(url);
  }

  getRoles() {
    this.rolesSub = this.programService.getPermissions(this.cookieValue, 'ROLES').subscribe(res => {
      if (res && res.ROLES && res.ROLES.length > 0) {
        this.roles = res.ROLES;
        if(this.program._links && this.program._links['program:request:action:submit']) {
          let href = this.program._links['program:request:action:submit'].href;
          this.getReasons(href.substring(href.lastIndexOf("/") + 1), this.roles);
        }
      }
    });
  }
  getReasons(programId: any, roles: any) {
    this.reasonSub = this.programService.getReasons(programId, this.cookieValue).subscribe(res => {
      let reason = res.reason;
      if (this.cookieValue) {

        // show alert if viewing pending version with having Agency Submitters, Agency Coordinators, superuser and limiteduser
        if (this.program.status && this.program.status.code && this.program.status.code === 'pending' && ((roles && roles.length > 0) && (roles[0] === 'CFDA_AGENCY_COORD' || roles[0] === 'AGENCY_SUBMITTER'
          || roles[0] === 'CFDASUPERUSER' || roles[0] === 'CFDALIMITEDSUPERUSER'))) {
          let pendingAgencyAlertDesc = `This assistance listing is pending review/approval. Changes cannot be made at this time. Assistance Listing will publish on ` + moment(this.program.autoPublishDate).format("MM/DD/YYYY") + `.`+
            `<br><br><b>Submission Comment</b> <br>` + reason;
          let pendingAgencyAlert = {
            'labelname': 'pending-fal-alert',
            'config': {
              'type': 'info',
              'title': '',
              'description': pendingAgencyAlertDesc
            }
          };
          this.alerts.push(pendingAgencyAlert);
        }
        // show alert if viewing pending version with having OMB Reviewers, superuser and limiteduser
        if (this.program.status && this.program.status.code && this.program.status.code === 'pending' && (this.roles[0] === 'OMB_ANALYST' || this.roles[0] === 'RMO_SUPERUSER'
          || roles[0] === 'CFDASUPERUSER' || roles[0] === 'CFDALIMITEDSUPERUSER')) {
          let pendingOMBAlertDesc = `This Assistance Listing revision is pending publication. The Assistance Listing will publish on ` + moment(this.program.autoPublishDate).format("MM/DD/YYYY") + ` unless you extend the review period, reject the Assistance Listing, or manually publish the Assistance Listing.
            You can use the buttons below to perform any one of the aforementioned actions.<br><br><b>Submission Comment</b><br>` + reason;
          let pendingOMBAlert = {
            'labelname': 'pending-fal-alert',
            'config': {
              'type': 'warning',
              'title': '',
              'description': pendingOMBAlertDesc
            }
          };
          this.alerts.push(pendingOMBAlert);
        }
      }
    });
  }

  public containsExecutiveOrder() {
    let a = _.find(this.program.data.assistance.preApplicationCoordination.environmentalImpact.reports, {reportCode: "ExecutiveOrder12372"});
    if (a === undefined) {
      return false;
    } else if (a.isSelected === true) {
      return true;
    } else {
      return false;
    }
  }
}
