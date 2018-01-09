import { Location } from '@angular/common';
import { animate, Component, Input, OnInit, state, style, transition, trigger, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router, Params } from '@angular/router';
import { EntityService, FHService, OpportunityService, DictionaryService } from 'api-kit';
import * as Cookies from 'js-cookie';
import isEmpty from 'lodash/isEmpty';
import result from 'lodash/result';
import find from 'lodash/find';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import forEach from 'lodash/forEach';
import * as _ from 'lodash';
import { Subscription, ReplaySubject, Observable } from "rxjs";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { SidenavService } from "sam-ui-elements/src/ui-kit/components/sidenav/services";
import { SidenavHelper } from "app/app-utils/sidenav-helper";
import { OpportunityFields } from "app/opportunity/opportunity.fields";
import { ProcessOpportunityHistoryPipe } from 'app/opportunity/pipes/process-opportunity-history.pipe';
import { ViewChangesPipe } from 'app/opportunity/pipes/view-changes.pipe';
import { FilesizePipe } from 'app/opportunity/pipes/filesize.pipe';
import { DateFormatPipe } from 'app/app-pipes/date-format.pipe';
import { GetResourceTypeInfo } from 'app/opportunity/pipes/get-resource-type-info.pipe';
import { SetDisplayFields } from 'app/opportunity/pipes/set-display-fields.pipe';
import { FilterMultiArrayObjectPipe } from 'app/app-pipes/filter-multi-array-object.pipe';
import { OpportunityFieldNames, OpportunitySectionNames } from 'app/opportunity/opportunity-operations/framework/data-model/opportunity-form-constants';
import { MenuItem } from 'sam-ui-elements/src/ui-kit/components/sidenav';



@Component({
    moduleId: __filename,
    templateUrl: 'opportunity-public.page.html',
    providers: [
        OpportunityService,
        SidenavHelper,
        FilterMultiArrayObjectPipe
    ]
})

export class OpportunityPublicPage implements OnInit {
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
  originalOpportunity: any;
  opportunityLocation: any;
  opportunity: any;
  processedHistory: any;
  procurementType: any;
  historyByProcurementType: any;
  organization: any;
  currentUrl: string;
  //dictionary: any;
  attachments: any = [];
  packages: any = [];
  relatedOpportunities:any;
  relatedOpportunitiesMetadata:any;
  public relatedNoticeNumber: string;  
  public logoUrl: string;
  public logoInfo: any;
  opportunityAPI: any;
  previousOpportunityVersion: any;
  previousOpportunityLocation: any;
  differences: any;
  showChangesGeneral = false;
  showChangesSynopsis = false;
  showChangesClassification = false;
  showChangesContactInformation = false;
  showChangesAwardDetails = false;
  private apiSubjectSub: Subscription;
  private apiStreamSub: Subscription;
  showRevisionMessage: boolean = false;
  qParams: any;
  dictionariesUpdated: boolean = false;
  history: any;
  noHistory: boolean;
  keyword: string;
  ivls: any;
  ivlSort: any = { "type":"contractorCageNumber", "sort":"desc" };
  ivlSortOptions = [
    { label: "UEI", value: "contractorDuns" },
    { label: "Entity Name", value: "contractorName" },
    { label: "POC Last Name", value: "contactLastName" }
  ];
  ivlNaicsCodeList: any;
  showIvls: boolean = false;
  errorOrganization: any;
  errorLogo: any;
  awardSort: string = "awardDate"; //default
  awardSortOptions = [
    { label: "Award Date", value: "awardDate" },
    { label: "Dollar Amount", value: "dollarAmount" },
    { label: "Company (Awardee) Name", value: "awardeeName" },
  ];
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
  sidenavModel = {
    "label": "Contract Opportunities",
    "children": []
  };
  authToken: string;

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
    },{
      label: this.sectionLabels[2],
      route: "#" + OpportunitySectionNames.GENERAL,
    }, {
      label: this.sectionLabels[3],
      route: "#" + OpportunitySectionNames.CLASSIFICATION,
    }, {
      label: this.sectionLabels[4],
      route: "#" + OpportunitySectionNames.DESCRIPTION,
    },  {
      label: this.sectionLabels[5],
      route: "#" + OpportunitySectionNames.PACKAGES,
    },  {
      label: this.sectionLabels[6],
      route: "#" + OpportunitySectionNames.CONTACT,
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
    },{
      label: this.sectionLabels[1],
      route: "#" + OpportunitySectionNames.AWARD_DETAILS,
    }, {
      label: this.sectionLabels[2],
      route: "#" + OpportunitySectionNames.GENERAL,
    }, {
      label: this.sectionLabels[3],
      route: "#" + OpportunitySectionNames.CLASSIFICATION,
    }, {
      label: this.sectionLabels[4],
      route: "#" + OpportunitySectionNames.DESCRIPTION,
    },  {
      label: this.sectionLabels[5],
      route: "#" + OpportunitySectionNames.PACKAGES,
    },  {
      label: this.sectionLabels[6],
      route: "#" + OpportunitySectionNames.CONTACT,
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
    },{
      label: this.sectionLabels[2],
      route: "#" + OpportunitySectionNames.GENERAL,
    }, {
      label: this.sectionLabels[3],
      route: "#" + OpportunitySectionNames.CLASSIFICATION,
    }, {
      label: this.sectionLabels[4],
      route: "#" + OpportunitySectionNames.DESCRIPTION,
    },  {
      label: this.sectionLabels[5],
      route: "#" + OpportunitySectionNames.PACKAGES,
    },  {
      label: this.sectionLabels[6],
      route: "#" + OpportunitySectionNames.CONTACT,
    },{
      label: this.sectionLabels[7],
      route: "#history"
    },{
      label: this.sectionLabels[8],
      route: "#" + OpportunitySectionNames.IVL,
    }]
  };

  crumbs: Array<IBreadcrumb> = [
    {breadcrumb: 'Workspace', urlmock: true},
    {breadcrumb: 'Contract Opportunity Workspace', urlmock: true}
  ];

  constructor(
    private sidenavService: SidenavService,
    private sidenavHelper: SidenavHelper,
    private router: Router,
    private route:ActivatedRoute,
    private opportunityService:OpportunityService,
    private fhService:FHService,
    private dictionaryService: DictionaryService,
    private entityService: EntityService,
    private location: Location
  ){
    router.events.subscribe(s => {
        if (s instanceof NavigationEnd) {
          const tree = router.parseUrl(router.url);
          this.pageFragment = tree.fragment;
        }
      });
  }

  //TODO: Should break several, if not all, of these methods into a different service
  ngOnInit(){
    this.authToken = Cookies.get('iPlanetDirectoryPro');
    
    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;
    this.loadDictionary();
    let opportunityAPI = this.loadOpportunity();
    this.opportunityAPI = opportunityAPI;
    let parentOpportunityAPI = this.loadParentOpportunity(opportunityAPI);
    this.loadOrganization(opportunityAPI);
    this.loadOpportunityLocation(opportunityAPI);
    let historyAPI = this.loadHistory(opportunityAPI);
    let previousOpportunityAPI = this.loadPreviousOpportunityVersion(historyAPI);
    this.checkChanges(previousOpportunityAPI);
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

  private loadOpportunity() :ReplaySubject<any>{
    let opportunitySubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers

    let apiStream = this.route.params.switchMap((params) => { // construct a stream of opportunity data
      this.differences = null;
      this.packages = [];
      this.packagesWarning = false;
      this.showRevisionMessage = false;
      this.showChangesGeneral = false;
      this.showChangesSynopsis = false;
      this.showChangesClassification = false;
      this.showChangesContactInformation = false;
      this.showChangesAwardDetails = false;
      return this.opportunityService.getContractOpportunityById(params['id'], this.authToken);
    });

    

    this.apiStreamSub = apiStream.subscribe(opportunitySubject);

    this.apiSubjectSub = opportunitySubject.subscribe(api => { // do something with the opportunity api
        this.opportunity = api;
        // Adds page title as the last item in breadcrumbs
        let pageTitleObj = { breadcrumb: this.opportunity.data.title }
        this.crumbs.push(pageTitleObj);

        this.makeSideNav();
  
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

  private loadParentOpportunity(opportunityAPI: Observable<any>|ReplaySubject<any>){
    let parentOpportunitySubject = new ReplaySubject(1); // broadcasts the parent opportunity to multiple subscribers
    let parentOpportunityStream = opportunityAPI.switchMap(api => {
      if (!_.isEmpty(api.parent)) { // if this opportunity has a parent
        // then call the opportunity api again for parent and attach the subject to the result
        return this.opportunityService.getContractOpportunityById(api.parent.id, this.authToken);
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

  private loadOrganization(opportunityAPI: Observable<any>|ReplaySubject<any>) {
    let organizationSubject = new ReplaySubject(1); // broadcasts the organization to multiple subscribers

    opportunityAPI.subscribe(api => {
      if(api.data.organizationId != null) {
        this.fhService.getOrganizationById(api.data.organizationId, false).subscribe(organizationSubject);
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

  private loadOpportunityLocation(opportunityApiStream: Observable<any>|ReplaySubject<any>) {
    opportunityApiStream.subscribe(opAPI => {
      if(opAPI.data.organizationLocationId != '' && typeof opAPI.data.organizationLocationId !== 'undefined') {
        this.opportunityService.getOpportunityLocationById(opAPI.data.organizationLocationId).subscribe(data => {
          this.opportunityLocation = data;
        });
      }
    });
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
              let curarray = document.location.href.split("/");
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

  private checkChanges(previousOpportunityAPI: Observable<any>|ReplaySubject<any>){
    previousOpportunityAPI.subscribe(api => {
      if(api != null) {
        this.previousOpportunityVersion = api;
        let viewChangesPipe = new ViewChangesPipe();
        if (this.previousOpportunityVersion.data.organizationLocationId != '' && typeof this.previousOpportunityVersion.data.organizationLocationId !== 'undefined') {
          this.opportunityService.getOpportunityLocationById(this.previousOpportunityVersion.data.organizationLocationId).subscribe(data => {
            this.previousOpportunityLocation = data;
            this.differences = viewChangesPipe.transform(this.previousOpportunityVersion, this.opportunity, this.dictionaryService.dictionaries, this.opportunityLocation, this.previousOpportunityLocation);
          });
        } else {
          this.differences = viewChangesPipe.transform(this.previousOpportunityVersion, this.opportunity, this.dictionaryService.dictionaries, this.opportunityLocation, this.previousOpportunityLocation);
        }
      }
    }, err => {
      console.log('Error loading opportunity: ', err);
    });
  }

  private loadPackages(historyAPI: Observable<any>|ReplaySubject<any>){
    let packagesSubject = new ReplaySubject(1);
    let historyNoticeIds: string;
    let packagesStream = historyAPI.switchMap(api =>{
      historyNoticeIds = '';
      let parentOpportunity = '';
      let current = _.filter(api.content.history, historyItem => {
        return historyItem.notice_id == this.opportunity.id;
      })[0];

      if(current.procurement_type == 'a')
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
    });
    packagesStream.subscribe(packagesSubject);
    packagesSubject.subscribe((data: any) =>{
        this.packages = [];
        let filesizePipe = new FilesizePipe();
        let dateformatPipe = new DateFormatPipe();
        let archiveVal = this.opportunity.data.statuses.isArchived;
        data.packages.forEach(attachmentsPackage => {
        attachmentsPackage.resources = [];
        attachmentsPackage.accordionState = "collapsed";
        attachmentsPackage.downloadUrl = this.getDownloadPackageURL(attachmentsPackage.packageId, archiveVal);
        attachmentsPackage.postedDate = dateformatPipe.transform(attachmentsPackage.postedDate,'MMM DD, YYYY');
        if(attachmentsPackage.access == "Public"){
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
              } else if (current.parent_notice == null && res.procurement_type == 'm') {
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
        return 'opportunity-' + id;
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

  private setupSideNavMenus(){
    this.pageRoute = "opp/" + this.opportunity.opportunityId;
    let opportunitySideNavContent = {
      "label": "Contract Opportunity",
      "route": this.pageRoute,
      "children": [
        {
          "label": "Award Details",
          "field": this.opportunityFields.Award,
        },
        {
          "label": "General Information",
          "field": this.opportunityFields.General,
        },
        {
          "label": "Classification",
          "field": this.opportunityFields.Classification,
        },
        {
          "label": "Synopsis/Description",
          "field": this.opportunityFields.Synopsis,
        },
        {
          "label": "Packages",
          "field": this.opportunityFields.Packages,
        },
        {
          "label": "Contact Information",
          "field": this.opportunityFields.Contact,
        },
        {
          "label": "History",
          "field": this.opportunityFields.History,
        }
      ]
    };

    this.sidenavModel.children = [];
    this.sidenavHelper.updateSideNav(this, true, opportunitySideNavContent);
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
     
    public getDownloadFileURL(fileID: string, isArchived: boolean = false){
        return this.getBaseURL() + '/opportunities/resources/files/' + fileID + this.getAPIUmbrellaKey() + this.getOppStatusQueryString(isArchived);
    }
    public getDownloadPackageURL(packageID: string, isArchived: boolean = false) {
        return this.getBaseURL() + '/opportunities/resources/packages/' + packageID + '/download/zip' + this.getAPIUmbrellaKey() + this.getOppStatusQueryString(isArchived);
    }

    public getDownloadAllPackagesURL(opportunityID: string, isArchived: boolean = false) {
        return this.getBaseURL() + '/opportunities/' + opportunityID + '/resources/packages/download/zip' + this.getAPIUmbrellaKey() + this.getOppStatusQueryString(isArchived) +'&includeRevisions=true';
    }

    public getBaseURL() {
        return API_UMBRELLA_URL + '/opps/v1';
    }

    public getAPIUmbrellaKey() {
        return '?api_key=' + API_UMBRELLA_KEY;
    }

    public getOppStatusQueryString(isArchived: boolean = false): string {
        return (isArchived === true) ? '&status=archived' : '';
    }

    private getExtension(filename: string) {
        let ext = filename.match(/\.[a-z0-9]+$/i);
    
        if(ext != null) {
          return ext[0];
        }
    
        return null;
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

    private showHideGeneral(){
        this.showChangesGeneral = !this.showChangesGeneral;
    }
    
    private showHideSynopsis(){
        this.showChangesSynopsis = !this.showChangesSynopsis;
    }
    private showHideClassification(){
        this.showChangesClassification = !this.showChangesClassification
    }
    private showHideContactInformation(){
        this.showChangesContactInformation = !this.showChangesContactInformation
    }
    private showHideAwardDetails(){
        this.showChangesAwardDetails = !this.showChangesAwardDetails;
    }
    private numberLabel(){
        if (this.opportunity.data.type === 'k' || (this.opportunity.data.type === 'm' && this.originalOpportunity.data.type === 'k')){
            return "Solicitation Number";
        } else {
            return "Notice Number";
        }
    }

    selectedItem(item){
        this.selectedPageLabel = this.sidenavService.getSelectedModel().label;
        this.selectedPage = this.sidenavService.getData()[0];
    }

    sidenavPathEvtHandler(data){
        this.sidenavHelper.sidenavPathEvtHandler(this, data);
    }

    getSectionId(section){
        return OpportunitySectionNames[section];
    }

    getFieldId(field) {
        return OpportunityFieldNames[field];
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

    private findDictionary(key: any): any[] {
        return this.dictionaryService.dictionaries[key] ? this.dictionaryService.dictionaries[key] : [];
    }

    parentArchiveDate(){
        if( this.originalOpportunity.data && this.originalOpportunity.data.archive && this.originalOpportunity.data.archive.date)
          return this.originalOpportunity.data.archive.date.substr(0,this.originalOpportunity.data.archive.date.indexOf('T'));
    }
    
    archiveDate(){
        if( this.opportunity.data && this.opportunity.data.archive && this.opportunity.data.archive.date)
            return this.opportunity.data.archive.date.substr(0,this.opportunity.data.archive.date.indexOf('T'));
    }

    breadcrumbHandler(event) {
      if(event === 'Workspace') {
        this.router.navigateByUrl('/workspace');
      }
      if(event === 'Contract Opportunity Workspace') {
        this.router.navigateByUrl('/opp/workspace');
      }
    }

    navHandler(obj) {
      this.router.navigate([], {fragment: obj.route.substring(1)});
    }

    showOriginalArchiveDate() {
      return ((this.originalOpportunity && this.originalOpportunity.data &&
        this.originalOpportunity.data.archive && this.originalOpportunity.data.archive.type &&
        this.originalOpportunity.data.archive.type != 'auto15') ||
        (this.opportunity.data && this.opportunity.data.archive && this.opportunity.data.archive.type != 'auto15'));
    }
    
}