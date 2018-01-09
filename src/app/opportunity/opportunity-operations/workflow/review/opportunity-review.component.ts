import { Location } from '@angular/common';
import { animate, Component, Input, OnInit, state, style, transition, trigger, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { EntityService, FHService, OpportunityService } from 'api-kit';
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { Subscription } from "rxjs/Subscription";
import { MenuItem } from "sam-ui-elements/src/ui-kit/components/sidenav";
import { SidenavService } from 'sam-ui-elements/src/ui-kit/components/sidenav/services/sidenav.service';
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { DictionaryService } from "../../../../../api-kit/dictionary/dictionary.service";
import { DateFormatPipe } from "../../../../app-pipes/date-format.pipe";
import { FilterMultiArrayObjectPipe } from '../../../../app-pipes/filter-multi-array-object.pipe';
import { SidenavHelper } from "../../../../app-utils/sidenav-helper";
import { FALFormErrorService } from "../../../../assistance-listing/assistance-listing-operations/fal-form-error.service";
import { OpportunityErrorDisplayComponent } from "../../../components/opportunity-error-display/opportunity-error-display.component";
import { OpportunityFields } from "../../../opportunity.fields";
import { FilesizePipe } from "../../../pipes/filesize.pipe";
import { GetResourceTypeInfo } from "../../../pipes/get-resource-type-info.pipe";
import { ProcessOpportunityHistoryPipe } from "../../../pipes/process-opportunity-history.pipe";
import { SetDisplayFields } from "../../../pipes/set-display-fields.pipe";
import { OpportunityFieldNames, OpportunitySectionNames } from "../../framework/data-model/opportunity-form-constants";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import { OppFieldError, OppFieldErrorList, OpportunityFormErrorService } from "../../opportunity-form-error.service";

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-review.template.html',
  providers: [
    OpportunityService,
    FilterMultiArrayObjectPipe,
    SidenavHelper
  ],
  animations: [
    trigger('accordion', [
      state('collapsed', style({
        height: '0px',
      })),
      state('expanded', style({
        height: '*',
      })),
      transition('collapsed => expanded', animate('100ms ease-in')),
      transition('expanded => collapsed', animate('100ms ease-out'))
    ]),
    trigger('intro', [
      state('fade', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-30%)'
        }),
        animate('.5s .5s cubic-bezier(0.175, 0.885, 0.320, 1.275)')
      ]),
      transition('* => void', [
        animate('.5s cubic-bezier(0.175, 0.885, 0.320, 1.275)', style({
          opacity: 0,
          transform: 'translateY(-30%)'
        }))
      ])
    ])
  ]
})
export class OpportunityReviewComponent implements OnInit {
  /**
   * Steps to add a new field:
   * 1. Add the field to OpportunityFields enum (opportunity.fields.ts)
   * 2. Add an element for the field in html template (opportunity.page.html)
   *  2a. (optional) Give the element an ID by calling generateID(...)
   *  2b. Add an *ngIf condition to the element that checks shouldBeShown(...), as well as any null checks required
   * 3. In setDisplayFields(...), set this.displayField[newField] = false for any conditions where it should be hidden
   * 4. Update unit tests (opportunity.spec.ts) as appropriate
   *
   * Steps to add a new opportunity type:
   * 1. Add the type to type labels pipe (opportunity-type-label.pipe.ts)
   * 2. In setDisplayFields(...), set this.displayField[someField] = false for any fields this type does not show
   * 3. Update unit tests (opportunity.spec.ts) as appropriate
   */
  public opportunityFields = OpportunityFields; // expose the OpportunityFields enum for use in html template
  public displayField = {}; // object containing boolean flags for whether fields should be displayed

  packagesWarning : any = false;
  @Input() viewModel: OpportunityFormViewModel;
  @ViewChild('errorDisplay') errorDisplayComponent: OpportunityErrorDisplayComponent;
  reviewErrorList: OppFieldErrorList;
  originalOpportunity: any;
  opportunity: any;
  public relatedNoticeNumber: string;
  processedHistory: any;
  procurementType: any;
  historyByProcurementType: any;
  organization: any;
  currentUrl: string;
  //dictionary: any;
  attachments: any = [];
  packages: any = [];
  alerts: any = [];
  public logoUrl: string;
  public logoInfo: any;
  opportunityAPI: any;
  previousOpportunityVersion: any;
  differences: any;
  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;
  showRevisionMessage: boolean = false;
  qParams: any;
  dictionariesUpdated: boolean = false;
  history: any;
  noHistory: boolean;
  keyword: string;
  showIvls: boolean = false;
  ivls: any;
  ivlSort: any = { "type":"contractorCageNumber", "sort":"desc" };
  ivlSortOptions = [
    { label: "UEI", value: "contractorDuns" },
    { label: "Entity Name", value: "contractorName" },
    { label: "POC Last Name", value: "contactLastName" }
  ];
  ivlNaicsCodeList: any;
  errorOrganization: any;
  errorLogo: any;
  awardSort: string = "awardDate"; //default
  awardSortOptions = [
    { label: "Award Date", value: "awardDate" },
    { label: "Dollar Amount", value: "dollarAmount" },
    { label: "Company (Awardee) Name", value: "awardeeName" },
  ];
  sidenavModel = {
    "label": "Contract Opportunities",
    "children": []
  };
  attachmentError:boolean;
  private pageNum = 0;
  private totalPages: number;
  private showPerPage = 20;
  min: number;
  max: number;
  private ready: boolean = false;

  // On load select first item on sidenav component
  selectedPageLabel: string;
  selectedPage: number = 0;
  pageRoute: string;
  pageFragment: string;
  authToken: string;

  crumbs: Array<IBreadcrumb> = [
    {breadcrumb: 'Workspace', urlmock: true},
    {breadcrumb: 'Contract Opportunity Workspace', urlmock: true}
  ];


  private pristineIconClass = 'pending';
  private updatedIconClass = 'completed';
  private invalidIconClass = 'error';
  private statusBannerLeadingText;

  sectionLabels: any = [
    'Header Information',
    'Award Details',
    'General Information',
    'Classification',
    'Description',
    'Packages',
    'Contact Information',
    'History',
    'Interested Vendors List'
  ];

  sections: string[] = [
    OpportunitySectionNames.HEADER,
    OpportunitySectionNames.AWARD_DETAILS,
    OpportunitySectionNames.GENERAL,
    OpportunitySectionNames.CLASSIFICATION,
    OpportunitySectionNames.DESCRIPTION,
    OpportunitySectionNames.CONTACT,
  ];

  sideNavSelection;
  sideNavModel: MenuItem = {
    label: "Contract Opportunities",
    children:[{
      label: this.sectionLabels[0],
      route: "#" + OpportunitySectionNames.HEADER,
      iconClass: this.pristineIconClass
    },{
      label: this.sectionLabels[2],
      route: "#" + OpportunitySectionNames.GENERAL,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[3],
      route: "#" + OpportunitySectionNames.CLASSIFICATION,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[4],
      route: "#" + OpportunitySectionNames.DESCRIPTION,
      iconClass: this.pristineIconClass
    },  {
      label: this.sectionLabels[5],
      route: "#" + OpportunitySectionNames.PACKAGES,
      iconClass: this.pristineIconClass
    },  {
      label: this.sectionLabels[6],
      route: "#" + OpportunitySectionNames.CONTACT,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[7],
      route: "#history"
    }]
  };

  sideNavModelAwards: MenuItem = {
    label: "Contract Opportunities",
    children:[{
      label: this.sectionLabels[0],
      route: "#" + OpportunitySectionNames.HEADER,
      iconClass: this.pristineIconClass
    },{
      label: this.sectionLabels[1],
      route: "#" + OpportunitySectionNames.AWARD_DETAILS,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[2],
      route: "#" + OpportunitySectionNames.GENERAL,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[3],
      route: "#" + OpportunitySectionNames.CLASSIFICATION,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[4],
      route: "#" + OpportunitySectionNames.DESCRIPTION,
      iconClass: this.pristineIconClass
    },  {
      label: this.sectionLabels[5],
      route: "#" + OpportunitySectionNames.PACKAGES,
      iconClass: this.pristineIconClass
    },  {
      label: this.sectionLabels[6],
      route: "#" + OpportunitySectionNames.CONTACT,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[7],
      route: "#history"
    },]
  };

  sideNavModelIvls: MenuItem = {
    label: "Contract Opportunities",
    children:[{
      label: this.sectionLabels[0],
      route: "#" + OpportunitySectionNames.HEADER,
      iconClass: this.pristineIconClass
    },{
      label: this.sectionLabels[2],
      route: "#" + OpportunitySectionNames.GENERAL,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[3],
      route: "#" + OpportunitySectionNames.CLASSIFICATION,
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[4],
      route: "#" + OpportunitySectionNames.DESCRIPTION,
      iconClass: this.pristineIconClass
    },  {
      label: this.sectionLabels[5],
      route: "#" + OpportunitySectionNames.PACKAGES,
      iconClass: this.pristineIconClass
    },  {
      label: this.sectionLabels[6],
      route: "#" + OpportunitySectionNames.CONTACT,
      iconClass: this.pristineIconClass
    },{
      label: this.sectionLabels[7],
      route: "#history"
    },{
      label: this.sectionLabels[8],
      route: "#" + OpportunitySectionNames.IVL,
      iconClass: this.pristineIconClass
    }]
  };

  constructor(
    private sidenavService: SidenavService,
    private sidenavHelper: SidenavHelper,
    private router: Router,
    private route:ActivatedRoute,
    private opportunityService:OpportunityService,
    private fhService:FHService,
    private dictionaryService: DictionaryService,
    private entityService: EntityService,
    private location: Location,
    private errorService: OpportunityFormErrorService) {

    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        this.pageFragment = tree.fragment;
      }
    });

   /* route.queryParams.subscribe(data => {
      this.qParams = data;
      this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
    });*/
  }

  ngOnInit() {
    this.authToken = Cookies.get('iPlanetDirectoryPro');
    if(this.authToken == undefined) {
      this.router.navigate(['accessrestricted']);
    }

    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;
    this.loadDictionary();
    let opportunityAPI = this.loadOpportunity();
    this.opportunityAPI = opportunityAPI;
    let parentOpportunityAPI = this.loadParentOpportunity(opportunityAPI);
    this.loadOrganization(opportunityAPI);
    let historyAPI = this.loadHistory(opportunityAPI);
    let previousOpportunityAPI = this.loadPreviousOpportunityVersion(historyAPI);
    let packagesOpportunities = this.loadPackages(historyAPI);
    let totalAttachmentsCount = this.getTotalAttachmentsCount(opportunityAPI, historyAPI, packagesOpportunities);
    //load IVLS
    let ivls = this.getIVLs(opportunityAPI);

    this.sidenavService.updateData(this.selectedPage, 0);

    // Construct a new observable that emits both opportunity and its parent as a tuple
    // Combined observable will not trigger until both APIs have emitted at least one value
    let parentAndOpportunityAPI = opportunityAPI.zip(parentOpportunityAPI);
    this.setDisplayFields(parentAndOpportunityAPI);

    // Assumes DOM its ready when opportunites, packages and related opportutnies API calls are done
    // Observable triggers when each API has emitted at least one value or error
    // and waits for 2 seconds for package's animation to finish
    let DOMReady$ = Observable.zip(opportunityAPI, packagesOpportunities, totalAttachmentsCount, ivls).delay(2000);
    this.sidenavHelper.DOMComplete(this, DOMReady$);
  }

  private loadOpportunity() :ReplaySubject<any>{
    let opportunitySubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers

    let apiStream = this.route.params.switchMap((params) => { // construct a stream of opportunity data
      this.differences = null;
      this.packages = [];
      this.packagesWarning = false;
      this.showRevisionMessage = false;
      return this.opportunityService.getContractOpportunityById(params['id'], this.authToken);
    });

    this.apiStreamSub = apiStream.subscribe(opportunitySubject);

    this.apiSubjectSub = opportunitySubject.subscribe(api => { // do something with the opportunity api
      this.opportunity = api;
      // Adds page title as the last item in breadcrumbs
      let pageTitleObj = { breadcrumb: this.opportunity.data.title }
      this.crumbs.push(pageTitleObj);

      // Run validations
      this.viewModel = new OpportunityFormViewModel(this.opportunity);
      this.errorService.viewModel = this.viewModel;
      this.errorService.validateAll()
      this.reviewErrorList = this.errorService.applicableErrors;
      let pristineSections = this.sections.filter(section => {
        return this.viewModel.getSectionStatus(section) === 'pristine';
      });

      if (this.checkForErrors()) {
        // todo: remove setTimeout
        setTimeout(() => {this.errorDisplayComponent.formatErrors(this.reviewErrorList, pristineSections);});
      }
      //this.showHideButtons(this.opportunity);
      this.makeSideNav();

      this.setAlerts();

      if (this.opportunity.related && this.opportunity.related.opportunityId) {
        this.opportunityService.getContractOpportunityById(this.opportunity.related.opportunityId).subscribe(res => {
          this.relatedNoticeNumber = res.data.solicitationNumber || null;
        }, _ => {
          this.relatedNoticeNumber = this.opportunity.related.opportunityId;
        });
      }
    }, err => {
      this.router.navigate(['/404']);
    });

    return opportunitySubject;
  }

  private setupSideNavMenus(){
    this.updateSidenavIcons(OpportunitySectionNames.HEADER, this.sectionLabels[0]);
    if(this.shouldBeDisplayed(this.opportunityFields.Award)) {
      this.updateSidenavIcons(OpportunitySectionNames.AWARD_DETAILS, this.sectionLabels[1]);
    }
    this.updateSidenavIcons(OpportunitySectionNames.GENERAL, this.sectionLabels[2]);
    this.updateSidenavIcons(OpportunitySectionNames.CLASSIFICATION, this.sectionLabels[3]);
    this.updateSidenavIcons(OpportunitySectionNames.DESCRIPTION, this.sectionLabels[4]);
    this.updateSidenavIcons(OpportunitySectionNames.PACKAGES, this.sectionLabels[5]);
    this.updateSidenavIcons(OpportunitySectionNames.CONTACT, this.sectionLabels[6]);
    this.sidenavModel.children = [];
  }

  private loadPreviousOpportunityVersion(historyAPI: Observable<any>|ReplaySubject<any>){
    let opportunitySubject = new ReplaySubject(1);

    let opportunityStream = historyAPI.switchMap( opportunity => {
      if (!(this.opportunity['data']['type'] === "m") || opportunity['content']['history'].length < 2){
        return Observable.of(null);
      } else {
        let index = _.result(_.find(opportunity.content.history, { 'notice_id': this.opportunity.id }), 'index');
        index--;
        let id = _.result(_.find(opportunity.content.history, { 'index': index }), 'notice_id');
        return this.opportunityService.getContractOpportunityById(id, this.authToken);
      }
    });// attach subject to stream
    opportunityStream.subscribe(opportunitySubject);
    opportunitySubject.subscribe(api => {
    });
    return opportunitySubject;
  }

  private loadParentOpportunity(opportunityAPI: Observable<any>|ReplaySubject<any>){
    let parentOpportunitySubject = new ReplaySubject(1); // broadcasts the parent opportunity to multiple subscribers

    let parentOpportunityStream = opportunityAPI.switchMap(api => {
      if (api.parent.opportunityId != null) { // if this opportunity has a parent
        // then call the opportunity api again for parent and attach the subject to the result
        return this.opportunityService.getContractOpportunityById(api.parent.opportunityId, this.authToken);
      } else {
        return Observable.of(null); // if there is no parent, just return a single null
      }
    });
    parentOpportunityStream.subscribe(parentOpportunitySubject);

    parentOpportunitySubject.subscribe(parent => { // do something with the parent opportunity api
      this.originalOpportunity = parent;
    }, err => {
      console.log('Error loading parent opportunity: ', err);
    });

    return parentOpportunitySubject;
  }


  private getIVLs(opportunityAPI : Observable<any>) {
    let ivlSubject = new ReplaySubject(1);
    let ivlStream = opportunityAPI.switchMap(opportunity => {
      if (opportunity._links && opportunity._links['opportunity:ivl:view'] != null) {
        let sort = ((this.ivlSort.sort == 'desc') ? '-' : '') + this.ivlSort.type;
        return this.opportunityService.getOpportunityIVLs(this.authToken, opportunity.id, this.keyword, this.pageNum, this.showPerPage, sort)
          .switchMap(ivls => {
            if(ivls != null && ivls.hasOwnProperty('_embedded') && ivls.hasOwnProperty('page')) {
              this.ivls = ivls;
              this.showIvls = true;
              this.sideNavModel = this.sideNavModelIvls;
              this.sidenavService.setModel(this.sideNavModelIvls);
              this.setupSideNavMenus();
              return Observable.from(ivls['_embedded']['ivl']);
            } else {
              return [];
            }
          })
          .concatMap(ivl => {
            if(ivl != null && ivl.hasOwnProperty('contractorDuns')) {
              return this.entityService.getCoreDataById(ivl.contractorDuns)
                .catch(error => {
                  return Observable.of(null);
                });
            } else {
              return Observable.of(null);
            }
          })
          .toArray(); // optional: this will wait for the previous part of the stream to complete and return an array of all results, remove this if you want to receive every result as a single "next"
//        .retryWhen(
//          errors => {
//            return this.route.params;
//        });
      } else {
        return Observable.of(null);
      }
    });

    ivlStream.subscribe(ivlSubject);

    ivlSubject.subscribe(naicsList => {
      this.ivlNaicsCodeList = naicsList;
      if(this.ivls != null && this.ivls.hasOwnProperty('_embedded')) {
        this.ivls['_embedded']['ivl'].forEach((ivl, idx) => {
          if(ivl.hasOwnProperty('contractorDuns') && ivl['contractorDuns'] != null) {
            _.forEach(naicsList, item => {
              if(item != null && item.hasOwnProperty('entityInfo') && item['entityInfo'].hasOwnProperty('coreData') &&
                item['entityInfo']['coreData'].hasOwnProperty('generalInfo') && item['entityInfo']['coreData']['generalInfo'].hasOwnProperty('duns') &&
                item['entityInfo']['coreData']['generalInfo']['duns'] == ivl['contractorDuns'] && item['entityInfo'].hasOwnProperty('assertions')) {
                this.ivls['_embedded']['ivl'][idx]['naics'] = item['entityInfo']['assertions'];
              }
            });
          }
        });
      }
    });

    return ivlSubject;
  }

  private reloadIVLs(pageNumber: number) {
    this.pageNum = pageNumber;
    this.getIVLs(this.opportunityAPI);
  }


  private loadOrganization(opportunityAPI: Observable<any>|ReplaySubject<any>) {
    let organizationSubject = new ReplaySubject(1); // broadcasts the organization to multiple subscribers

    opportunityAPI.subscribe(api => {
      if(api.data.organizationId != null) {
        this.fhService.getFHOrganizationById(api.data.organizationId, false).subscribe(organizationSubject);
        this.fhService.getOrganizationLogo(organizationSubject,
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
      } else {
        this.errorOrganization = true;
      }
    });

    organizationSubject.subscribe(organization => { // do something with the organization api
      this.organization = organization['_embedded'][0]['org'];
    }, err => {
      this.errorOrganization = true;
    });

    return organizationSubject;
  }

  private getTotalAttachmentsCount(opportunity: Observable<any>|ReplaySubject<any>, historyAPI: Observable<any>|ReplaySubject<any>, packagesOpportunities: Observable<any>|ReplaySubject<any>){
    let attachmentCountSubject = new ReplaySubject(1);
    let historyNoticeIds: string;
    let attachmentCountStream = historyAPI.switchMap(api =>{
      historyNoticeIds = '';
      let current = _.filter(api.content.history, historyItem => {
        return historyItem.notice_id == this.opportunity.id;
      })[0];
      this.historyByProcurementType = [];
      this.procurementType = current.procurement_type
      if(current.procurement_type == 'a') {
        historyNoticeIds = current.notice_id + ',';
        this.historyByProcurementType.push(current);
      }else {
        api.content.history.forEach((res: any) => {
          if (res.parent_notice == null && current.procurement_type == 'm') {
            historyNoticeIds += res.notice_id + ',';
            this.historyByProcurementType.push(res);
          } else if (res.procurement_type == current.procurement_type) {
            historyNoticeIds += res.notice_id + ',';
            this.historyByProcurementType.push(res);
          } else if (current.parent_notice == null && res.procurement_type== 'm') {
            historyNoticeIds += res.notice_id + ',';
            this.historyByProcurementType.push(res);
          }
        });
      }
      this.historyByProcurementType = _.sortBy(this.historyByProcurementType, 'index');

      historyNoticeIds = historyNoticeIds.substring(0, historyNoticeIds.length - 1);
      return this.opportunityService.getContractOpportunityPackagesCount(historyNoticeIds);
    });

    attachmentCountSubject.subscribe(data => {
      historyAPI.subscribe(historyAPI => {
        packagesOpportunities.subscribe(res =>{
          if(data > this.packages.length && this.procurementType != 'a') {
            this.packagesWarning = true;
          }
          else {
            this.packagesWarning = false;
          }
        });
      });
    });
    attachmentCountStream.subscribe(attachmentCountSubject);
    return attachmentCountSubject;
  }


  private loadPackages(historyAPI: Observable<any>|ReplaySubject<any>){
    let packagesSubject = new ReplaySubject(1);
    let historyNoticeIds: string;
    let packagesStream = historyAPI.switchMap(api =>{
      historyNoticeIds = '';
      let parentOpportunity = '';
      if(api.content.history.length > 0) {
        let current = _.filter(api.content.history, historyItem => {
          return historyItem.notice_id == this.opportunity.id;
        })[0];
        if (current.procurement_type == 'a')
          historyNoticeIds = current.notice_id + ',';
        else {
          api.content.history.forEach((res: any) => {
            if (res.index <= current.index) {
              if (res.parent_notice == null && current.procurement_type == 'm')
                historyNoticeIds += res.notice_id + ',';
              else if (res.procurement_type == current.procurement_type)
                historyNoticeIds += res.notice_id + ',';
              else if (current.parent_notice == null && res.procurement_type == 'm')
                historyNoticeIds += res.notice_id + ',';
            }
          });
        }

        historyNoticeIds = historyNoticeIds.substring(0, historyNoticeIds.length - 1);
        return this.opportunityService.getContractOpportunityPackages(historyNoticeIds).retryWhen(
          errors => {
            this.attachmentError = true;
            return this.route.params;
          }
        );
      }
    });
    packagesStream.subscribe(packagesSubject);
    packagesSubject.subscribe((data: any) =>{
      this.packages = [];
      let filesizePipe = new FilesizePipe();
      let dateformatPipe = new DateFormatPipe();
      let archiveVal = this.opportunity.archived;

      data.packages.forEach(attachmentsPackage => {
        attachmentsPackage.resources = [];
        attachmentsPackage.accordionState = "collapsed";
        attachmentsPackage.downloadUrl = this.getDownloadPackageURL(attachmentsPackage.packageId, archiveVal);
        attachmentsPackage.postedDate = dateformatPipe.transform(attachmentsPackage.postedDate,'MMM DD, YYYY');
        if(attachmentsPackage.access == "public" || attachmentsPackage.access == "Public"){
          attachmentsPackage.attachments.forEach((resource: any) => {
            data.resources.forEach((res: any) => {
              if(resource.resourceId == res.resourceId){
                if(res.type=="link"){
                  res.downloadUrl = res.uri;
                } else {
                  //file
                  res.downloadUrl = this.getDownloadFileURL(resource.resourceId, archiveVal);
                }
                if(!isNaN(res.size)){
                  res.size = filesizePipe.transform(res.size);
                }
                let getResourceTypeInfo = new GetResourceTypeInfo();
                res.typeInfo = getResourceTypeInfo.transform(res.type === 'file' ? this.getExtension(res.name) : res.type);
                attachmentsPackage.resources.push(res);
              }
            });
          });
        }
        this.packages.push(attachmentsPackage);
      });
      this.packages = _.sortBy(this.packages, function(item) {return new Date(item.postedDate)});
    },err => {
      console.log('Error loading packages: ', err);
      this.attachmentError = true;
    });
    return packagesSubject;
  }


  private loadDictionary() {
    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('classification_code,naics_code,set_aside_type,fo_justification_authority');
    if (filteredDictionaries===''){
      this.dictionariesUpdated = true;
    } else {
      this.dictionaryService.getContractOpportunityDictionary(filteredDictionaries).subscribe(data => {
        // do something with the dictionary api
        this.dictionariesUpdated = true;
      }, err => {
        console.log('Error loading dictionaries: ', err);
      });
    }
  }


  private findDictionary(key: any): any[] {
    return this.dictionaryService.dictionaries[key] ? this.dictionaryService.dictionaries[key] : [];
  }

  private loadHistory(opportunity: Observable<any>|ReplaySubject<any>) {
    let historySubject = new ReplaySubject(1);
    let tempOpportunityApi;
    let historyStream = opportunity.switchMap(opportunityAPI => {
      /** Check that opportunity id exists **/
      if (opportunityAPI.id == '' || typeof opportunityAPI.id === 'undefined') {
        console.log('Error loading history');
        return;
      }
      /** Load history API **/
      tempOpportunityApi = opportunityAPI;
      return this.opportunityService.getContractOpportunityHistoryById(opportunityAPI.id);
    });
    historyStream.subscribe(historySubject);
    historySubject.subscribe(historyAPI => {
      this.history = historyAPI;
      if (this.history.content.history.length < 1){
        this.noHistory = true;
      } else {
        let processOpportunityHistoryPipe = new ProcessOpportunityHistoryPipe();
        let pipedHistory = processOpportunityHistoryPipe.transform(historyAPI, tempOpportunityApi, this.qParams);

        for ( var i = 0; i < pipedHistory.processedHistory.length; i++ ) {
          if(pipedHistory.processedHistory[i].url !=null && pipedHistory.processedHistory[i].url != undefined) {
            let pathArray = pipedHistory.processedHistory[i].url.split("/");
            let id = pathArray[2];
            let curarray = this.currentUrl.split("/");
            if(curarray[4] != null && curarray[4] != undefined) {
              let curid = curarray[4];
              if (id === curid) {
                pipedHistory.processedHistory[i].url = "";
              }
            }
          }
        }
        this.processedHistory = pipedHistory.processedHistory;
        if (pipedHistory.showRevisionMessage){
          this.showRevisionMessage = pipedHistory.showRevisionMessage;
        }
      }

    }, err => {
      console.log('Error loading history: ', err);
    });

    return historySubject;
  }

  // Sets the correct displayField flags for this opportunity type
  private setDisplayFields(combinedOpportunityAPI: Observable<any>) {
    combinedOpportunityAPI.subscribe(([opportunity, parent]) => {
      if(opportunity.data == null || opportunity.data.type == null) {
        console.log('Error: No opportunity type');
        return;
      }

      let type = opportunity.data.type === 'm' ? parent.data.type : opportunity.data.type;
      let setDisplayFields = new SetDisplayFields();
      this.displayField = setDisplayFields.transform(type, parent);
      this.ready = true;
      if(this.shouldBeDisplayed(this.opportunityFields.Award)){
        this.sideNavModel = this.sideNavModelAwards;
      }
      this.setupSideNavMenus();
    });
  }

  // Input should be one of the fields defined in OpportunityFields enum
  // To hide a field, set the flag displayField[field] to false
  // A field is always displayed by default, unless it is explicitly set not to
  private shouldBeDisplayed(field: OpportunityFields) {
    return this.displayField[field] !== false; //&& this.ready === true;
  }

  // Given a field name, generates an id for it by adding the correct prefixes
  private generateID(name: string, prefix?: string) {
    let id = name;
    if(prefix != null) { id = prefix + '-' + id; }
    return id;
  }

  // If any part of a POC exists, then we consider the entire POC to exist
  // If a POC does not exist, its section header is hidden
  private hasPOC(index: number): boolean {
    if(this.opportunity && this.opportunity.data && this.opportunity.data.pointOfContact[index]) {
      return (this.opportunity.data.pointOfContact[index].email != null
      || this.opportunity.data.pointOfContact[index].phone != null
      || this.opportunity.data.pointOfContact[index].fullName != null
      || this.opportunity.data.pointOfContact[index].title != null
      || this.opportunity.data.pointOfContact[index].fax != null);
    }
    return false;
  }

  private isSecure(field: string){
    if(field === "Public"){
      return "Not Secure";
    } else {
      return "Secured"
    }
  }

  pageChange(pagenumber){
    this.pageNum = pagenumber;
    this.min = (pagenumber + 1)  * this.showPerPage - this.showPerPage;
    this.max = (pagenumber + 1) * this.showPerPage;
    var pcobj = this.setupPageChange(false);
    let navigationExtras: NavigationExtras = {
      queryParams: pcobj,
      fragment: 'opportunity-award-summary'
    };
    this.router.navigate(['/opp',this.opportunity.id],navigationExtras);
    document.getElementById('awards-list').focus();
  }

  setupPageChange(newpagechange){
    var pcobj = {};

    if(!newpagechange && this.pageNum>=0){
      pcobj['page'] = this.pageNum+1;
    }
    else{
      pcobj['page'] = 1;
    }
    return pcobj;
  }

  public getDownloadFileURL(fileID: string, isArchived: boolean = false){
    return this.getBaseURL() + '/opportunities/resources/files/' + fileID + this.getAPIUmbrellaKey() + this.getOppStatusQueryString(isArchived);
  }

  selectedItem(item){
    this.selectedPageLabel = this.sidenavService.getSelectedModel().label;
    this.selectedPage = this.sidenavService.getData()[0];
  }

  sidenavPathEvtHandler(data){
    this.sidenavHelper.sidenavPathEvtHandler(this, data);
  }

  public getDownloadPackageURL(packageID: string, isArchived: boolean = false) {
    return this.getBaseURL() + '/opportunities/resources/packages/' + packageID + '/download/zip' + this.getAPIUmbrellaKey() + this.getOppStatusQueryString(isArchived);
  }

  public getDownloadAllPackagesURL(opportunityID: string, isArchived: boolean = false) {
    return this.getBaseURL() + '/opportunities/' + opportunityID + '/resources/packages/download/zip' + this.getAPIUmbrellaKey() + this.getOppStatusQueryString(isArchived) +'&includeRevisions=true';
  }

  public getBaseURL() {
    return API_UMBRELLA_URL + '/opps/v2';
  }

  public getAPIUmbrellaKey() {
    return '?api_key=' + API_UMBRELLA_KEY;
  }

  public getOppStatusQueryString(isArchived: boolean = false): string {
    return (isArchived === true) ? '&status=archived' : '';
  }

  public toggleAccordion(card){
    card.accordionState = card.accordionState == 'expanded' ? 'collapsed' : 'expanded';
  }

  public hasPublicPackages(){
    for(let pkg of this.packages) {
      if(pkg['access'] === 'Public') { return true; }
    }
    return false;
  }

  private getExtension(filename: string) {
    let ext = filename.match(/\.[a-z0-9]+$/i);

    if(ext != null) {
      return ext[0];
    }

    return null;
  }

  private numberLabel(){
    if (this.opportunity.data.type === 'k' || (this.opportunity.data.type === 'm' && (this.originalOpportunity !=null && this.originalOpportunity.data.type === 'k'))){
      return "Solicitation Number";
    } else {
      return "Notice Number";
    }
  }

  navHandler(obj) {
    this.router.navigate([], {fragment: obj.route.substring(1)});
  }

  public tabsClicked(tab){
    switch (tab.label) {
      case 'Public':
        this.tabsNavigation('Public');
        break;
      case 'Submit':
        this.tabsNavigation('Submit');
        break;
      case 'Reject':
        this.tabsNavigation('Reject');
        break;
      case 'Publish':
        this.tabsNavigation('Publish');
        break;
      case 'Notify Assistance Administrator':
        this.tabsNavigation('Notify');
        break;
      default:
        break;
    }
  }

  tabsNavigation(tabType) {
    let url;
    if(tabType === 'Public') {
      url = '/opp/' + this.opportunity.id + '/view';
    }
    if(tabType === 'Submit') {
      url = '/opp/' + this.opportunity.id + '/submit';
    }
    if(tabType === 'Reject') {
      url = '/opp/' + this.opportunity.id + '/reject';
    }
    if(tabType === 'Publish') {
      url = '/opp/' + this.opportunity.id + '/publish';
    }

    this.router.navigateByUrl(url);
  }

  breadcrumbHandler(event) {
    if(event === 'Workspace') {
      this.router.navigateByUrl('/workspace');
    }
    if(event === 'Contract Opportunity Workspace') {
      this.router.navigateByUrl('/opp/workspace');
    }
  }

  private updateSidenavIcons(sectionName: string, sectionLabel: string) {
    let hasError = FALFormErrorService.hasErrors(FALFormErrorService.findErrorById(this.errorService.errors, sectionName));
    let status = this.viewModel.getSectionStatus(sectionName);
    let iconClass = this.pristineIconClass;
    if (status === 'updated' || this.opportunity.status.code === 'rejected') {
      if (hasError) {
        iconClass = this.invalidIconClass;
      } else {
        iconClass = this.updatedIconClass;
      }
    }

    let filter = new FilterMultiArrayObjectPipe();
    let section = filter.transform([sectionLabel], this.sideNavModel.children, 'label', true, 'children')[0];
    section['iconClass'] = (this.opportunity.status.code === 'draft' || this.opportunity.status.code === 'draft_review' || this.opportunity.status.code === 'rejected') ? iconClass : null;
  }

  // different alerts are shown depending on the opportunity status
  private setAlerts() {
    let draftAlert = {
      'labelname': 'draft-opportunity-alert',
      'config': {
        'type': 'info',
        'title': '',
        'description': 'This is a draft Opportunity. Any updates will need to be published before the public is able to view the changes.'
      }
    };

    let publishedAlert = {
      'labelname': 'published-fal-alert',
      'config': {
        'type': 'info',
        'title': '',
        'description': 'This is the currently published version of this opportunity.'
      }
    };

    // show correct alert based on current status
    let status = this.opportunity.status;
    let code = status.code ? status.code : null;
    switch (code) {
      case 'draft':
        // alert for draft version
        this.alerts.push(draftAlert);
        break;

      case 'published':
        this.alerts.push(publishedAlert);
        break;

      default:
        break;
    }
  }

  public canEdit() {
    // show edit button if user has update permission, except on published Opportunity, or if user has revise permission
    if (this.opportunity._links && this.opportunity._links['opportunity:edit'] && this.opportunity.status && this.opportunity.status.code !== 'published') {
      return true;
    }

    return false;
  }

  public onEditClick(page: string[]) {
    if (this.opportunity._links && this.opportunity._links['opportunity:edit'] && this.opportunity._links['opportunity:edit'].href) {
     let id = this.opportunity.id;
      let url = '/opp/' + id + '/edit'.concat(page.toString());
      this.router.navigateByUrl(url);
    }
  }

  private makeSideNav() {
    this.route.fragment.subscribe((fragment: string) => {
      for (let item of this.sidenavModel.children) {
        if (item.route === fragment) {
          this.sideNavSelection = item.label;
          break;
        }
      }
    });
  }
  checkForErrors(){
    if(!this.errorService.viewModel) {
      return false;
    }

    let pristineSections = this.sections.filter(section => {
      return this.viewModel.getSectionStatus(section) === 'pristine';
    });

    return OpportunityFormErrorService.hasErrors(this.errorService.applicableErrors) || pristineSections.length > 0;
  }

  getErrorMessage(sectionId: string, fieldId: string, row: boolean = false, suffix: string = null, atLeastOneEntryError: boolean = false, errorId: string = null){

    let errObj : (OppFieldError | OppFieldErrorList) = OpportunityFormErrorService.findSectionErrorById(this.reviewErrorList, sectionId, fieldId);
    let message = '';

    if(errObj) {

      if(!row && errObj['errors']) {
        message = this.generateErrorMessage(errObj);
      }
      else if(row && errObj['errorList']) {
        let rowErrorObj: any;

        if(atLeastOneEntryError) {
          rowErrorObj = FALFormErrorService.findErrorById(<OppFieldErrorList> errObj, fieldId);
        }
        else {
          rowErrorObj = FALFormErrorService.findErrorById(<OppFieldErrorList> errObj, fieldId + suffix);

          if (errorId !== null) {

            if(rowErrorObj && rowErrorObj.errors && rowErrorObj.errors[errorId])
              message = rowErrorObj.errors[errorId]['message'];
          }
        }

        if(rowErrorObj && errorId == null)
          message = this.generateErrorMessage(rowErrorObj);
      }
    }

    return message;
  }

  generateErrorMessage(fieldErrors){
    let message = [];
    for(let key of Object.keys(fieldErrors['errors'])) {
      message.push(fieldErrors['errors'][key]['message']);
    }
    return message.join('<br/>');
  }
  updateBannerText(msg){
    this.statusBannerLeadingText = msg;
  }

  getFieldId(field) {
    return OpportunityFieldNames[field];
  }

  getSectionId(section){
    return OpportunitySectionNames[section];
  }
  getState(opportunity) {
    let state;
    if (opportunity && this.opportunity.data && opportunity.data.placeOfPerformance && opportunity.data.placeOfPerformance.state) {
      state = opportunity.data.placeOfPerformance.state;
      if (state === '1') {
        state = 'Non-U.S.'
      } else {
        state = state;
      }
    }
    return state;
  }
  parentArchiveDate(){
    if( this.originalOpportunity && this.originalOpportunity.data && this.originalOpportunity.data.archive && this.originalOpportunity.data.archive.date)
      return this.originalOpportunity.data.archive.date.substr(0,this.originalOpportunity.data.archive.date.indexOf('T'));
  }

  archiveDate(){
    if( this.opportunity.data && this.opportunity.data.archive && this.opportunity.data.archive.date)
      return this.opportunity.data.archive.date.substr(0,this.opportunity.data.archive.date.indexOf('T'));
  }

  showOriginalArchiveDate() {
    return ((this.originalOpportunity && this.originalOpportunity.data &&
      this.originalOpportunity.data.archive && this.originalOpportunity.data.archive.type &&
      this.originalOpportunity.data.archive.type != 'auto15') ||
      (this.opportunity.data && this.opportunity.data.archive && this.opportunity.data.archive.type != 'auto15'));
  }
}
