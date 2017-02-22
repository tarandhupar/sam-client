import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, NavigationEnd, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OpportunityService, FHService } from 'api-kit';
import { ReplaySubject, Observable } from 'rxjs';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';
import { OpportunityFields } from "./opportunity.fields";
import { trigger, state, style, transition, animate } from '@angular/core';
import * as _ from 'lodash';
import { OpportunityTypeLabelPipe } from "./pipes/opportunity-type-label.pipe";
import { DateFormatPipe } from "../app-pipes/date-format.pipe";
import { SidenavService } from "../../ui-kit/sidenav/services/sidenav.service";

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity.page.html',
  providers: [
    OpportunityService,
    FilterMultiArrayObjectPipe
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
export class OpportunityPage implements OnInit {
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

  alert: any = [];
  originalOpportunity: any;
  opportunityLocation: any;
  opportunity: any;
  history: any;
  processedHistory: any;
  organization: any;
  currentUrl: string;
  dictionary: any;
  attachment: any;
  relatedOpportunities:any;
  relatedOpportunitiesMetadata:any;
  public logoUrl: string;
  public logoInfo: any;
  opportunityAPI: any;

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
  selectedPage: number = 0;
  pageRoute: string;
  pageFragment: string;
  sidenavModel = {
    "label": "Opportunities",
    "children": []
  };

  constructor(
    private sidenavService: SidenavService,
    private router: Router,
    private route:ActivatedRoute,
    private opportunityService:OpportunityService,
    private fhService:FHService,
    private location: Location) {

    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        this.pageFragment = tree.fragment;
        if (this.pageFragment) {
          const element = document.getElementById(tree.fragment);
          if (element) {
            element.scrollIntoView();
          }
        }
      }
    });
    route.queryParams.subscribe(data => {
      this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
    });
  }

  ngOnInit() {
    // Using document.location.href instead of
    // location.path because of ie9 bug
    this.currentUrl = document.location.href;
    this.loadDictionary();
    let opportunityAPI = this.loadOpportunity();
    this.opportunityAPI = opportunityAPI;
    let parentOpportunityAPI = this.loadParentOpportunity(opportunityAPI);
    this.loadOrganization(opportunityAPI);
    this.loadOpportunityLocation(opportunityAPI);
    let packagesOpportunities = this.loadAttachments(opportunityAPI);
    let relatedOpportunities = this.loadRelatedOpportunitiesByIdAndType(opportunityAPI);
    this.loadHistory(opportunityAPI);
    this.sidenavService.updateData(this.selectedPage, 0);

    // Construct a new observable that emits both opportunity and its parent as a tuple
    // Combined observable will not trigger until both APIs have emitted at least one value
    let parentAndOpportunityAPI = opportunityAPI.zip(parentOpportunityAPI);
    this.setDisplayFields(parentAndOpportunityAPI);

    // Assumes DOM its ready when opportunites, packages and related opportutnies API calls are done
    // Observable triggers when each API has emitted at least one value or error
    // and waits for 2 seconds for package's animation to finish
    let DOMReady$ = Observable.zip(opportunityAPI, relatedOpportunities, packagesOpportunities).delay(2000);
    this.DOMComplete(DOMReady$);
  }

  private DOMComplete(observable){
    observable.subscribe(
      success => {
        if (this.pageFragment && document.getElementById(this.pageFragment)) {
          document.getElementById(this.pageFragment).scrollIntoView();
        }
      },
      error => {
        // Sometimes api calls return an error
        // we still need to check if dom element exist on page
        if (this.pageFragment && document.getElementById(this.pageFragment))  {
          document.getElementById(this.pageFragment).scrollIntoView();
        }
      }
    );
  }

  private loadOpportunity() {
    let opportunitySubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers

    this.route.params.subscribe((params: Params) => { // construct a stream of opportunity data
      this.opportunityService.getOpportunityById(params['id']).subscribe(opportunitySubject); // attach subject to stream
    });

    opportunitySubject.subscribe(api => { // do something with the opportunity api
      this.opportunity = api;
      this.pageRoute = "opportunities/" + this.opportunity.opportunityId;
      let opportunitySideNavContent = {
        "label": "Opportunity",
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
      this.updateSideNav(opportunitySideNavContent);
    }, err => {
      console.log('Error loading opportunity: ', err);
    });

    return opportunitySubject;
  }

  private updateSideNav(content?){

    let self = this;

    if(content){
      // Items in first level (pages) have to have a unique name
      let repeatedItem = _.findIndex(this.sidenavModel.children, item => item.label == content.label );
      // If page has a unique name added to the sidenav
      if(repeatedItem === -1){
        this.sidenavModel.children.push(content);
      }
    }

    updateContent();

    function updateContent(){
      let children = _.map(self.sidenavModel.children, function(possiblePage){
        let possiblePagechildren = _.map(possiblePage.children, function(possibleSection){
          if(self.shouldBeDisplayed(possibleSection.field)){
            possibleSection.route = "#" + self.generateID(possibleSection.field);
            return possibleSection;
          }
        });
        _.remove(possiblePagechildren, _.isUndefined);
        possiblePage.children = possiblePagechildren;
        return possiblePage;
      });
      self.sidenavModel.children = children;
    }

  }

  private loadParentOpportunity(opportunityAPI: Observable<any>){
    let parentOpportunitySubject = new ReplaySubject(1); // broadcasts the parent opportunity to multiple subscribers

    opportunityAPI.subscribe(api => {
      if (api.parent != null) { // if this opportunity has a parent
        // then call the opportunity api again for parent and attach the subject to the result
        this.opportunityService.getOpportunityById(api.parent.opportunityId).subscribe(parentOpportunitySubject);
      } else {
        return Observable.of(null).subscribe(parentOpportunitySubject); // if there is no parent, just return a single null
      }
    });

    parentOpportunitySubject.subscribe(parent => { // do something with the parent opportunity api
      this.originalOpportunity = parent;
    }, err => {
      console.log('Error loading parent opportunity: ', err);
    });

    return parentOpportunitySubject;
  }

  private loadRelatedOpportunitiesByIdAndType(opportunityAPI: Observable<any>){
    let relatedOpportunitiesSubject = new ReplaySubject(1);
      this.min = (this.pageNum + 1) * this.showPerPage - this.showPerPage;
      this.max = (this.pageNum + 1) * this.showPerPage;
    opportunityAPI.subscribe((opportunity => {
      this.opportunityService.getRelatedOpportunitiesByIdAndType(opportunity.opportunityId, "a", this.pageNum, this.awardSort).subscribe(relatedOpportunitiesSubject);
    }));
    relatedOpportunitiesSubject.subscribe(data => { // do something with the related opportunity api
      if (!_.isEmpty(data)) {
        this.relatedOpportunities = data['relatedOpportunities'][0];
        this.relatedOpportunitiesMetadata = {
          'count': data['count'],
          'recipientCount': data['recipientCount'],
          'totalAwardAmt': data['totalAwardAmt'],
          'unparsableCount': data['unparsableCount']
        };
        this.totalPages = Math.ceil(parseInt(data['count']) / this.showPerPage);

        let awardSideNavContent = {
          "label": "Award Notices",
          "route": this.pageRoute,
          "children": [
            {
              "label": "Award Summary",
              "field": this.opportunityFields.AwardSummary,
            },
          ]
        };
        this.updateSideNav(awardSideNavContent);

      }
    }, err => {
      console.log('Error loading related opportunities: ', err);
    });
    return relatedOpportunitiesSubject;
  }

  private reloadRelatedOpportunities() {
    this.pageNum = 0;
    this.loadRelatedOpportunitiesByIdAndType(this.opportunityAPI);
  }

  private loadOrganization(opportunityAPI: Observable<any>) {
    let organizationSubject = new ReplaySubject(1); // broadcasts the organization to multiple subscribers

    opportunityAPI.subscribe(api => {
      if(api.data.organizationId != null) {
        this.fhService.getOrganizationById(api.data.organizationId, false).subscribe(organizationSubject);
        this.fhService.getOrganizationLogo(organizationSubject,
          (logoData) => {
            this.logoUrl = logoData.logo;
            this.logoInfo = logoData.info;
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

  private loadOpportunityLocation(opportunityApiStream: Observable<any>) {
    opportunityApiStream.subscribe(opAPI => {
      if(opAPI.data.organizationLocationId != '' && typeof opAPI.data.organizationLocationId !== 'undefined') {
        this.opportunityService.getOpportunityLocationById(opAPI.data.organizationLocationId).subscribe(data => {
          this.opportunityLocation = data;
        });
      }
    });
  }

  private loadAttachments(opportunityAPI: Observable<any>){
    let attachmentSubject = new ReplaySubject(1); // broadcasts the attachments to multiple subscribers
    opportunityAPI.subscribe(api => {
      this.opportunityService.getAttachmentById(api.opportunityId).subscribe(attachmentSubject);
    });

    attachmentSubject.subscribe(attachment => { // do something with the organization api
      this.attachment = attachment;
      this.attachment.packages.forEach((key: any) => {
        key.accordionState = 'collapsed';
      });
      this.attachment.resources.forEach((res: any) => {
        res.typeInfo = this.getResourceTypeInfo(res.type === 'file' ? this.getExtension(res.name) : res.type);
      });
    }, err => {
      console.log('Error loading attachments: ', err);
      this.attachmentError = true;
    });

    return attachmentSubject;
  }

  private loadDictionary() {
    this.opportunityService.getOpportunityDictionary('classification_code,naics_code,set_aside_type,fo_justification_authority').subscribe(data => {
      // do something with the dictionary api
      this.dictionary = data;
    }, err => {
      console.log('Error loading dictionaries: ', err);
    });
  }

  private loadHistory(opportunity: Observable<any>) {
    opportunity.subscribe(opportunityAPI => {
      if(opportunityAPI.opportunityId == '' || typeof opportunityAPI.opportunityId === 'undefined') {
        console.log('Error loading history');
        return;
      }

      this.opportunityService.getOpportunityHistoryById(opportunityAPI.opportunityId).subscribe(historyAPI => {
        this.history = historyAPI; // save original history information in case it is needed

        // setup necessary items for processing history
        let typeLabel = new OpportunityTypeLabelPipe();
        let dateFormat = new DateFormatPipe();
        let originalType = typeLabel.transform(_.filter(historyAPI.content.history, historyItem => {
          return historyItem.parent_notice == null;
        })[0].procurement_type); // filter through history to find original opportunity, and save its type label

        // process history into a form usable by history component
        this.processedHistory = historyAPI.content.history.map(historyItem => {
          let processedHistoryItem = {};
          processedHistoryItem['id'] = historyItem.notice_id;
          processedHistoryItem['title'] = (function makeTitle(){
            let prefix = '';

            if(historyItem.parent_notice != null) { prefix = 'Updated'; }

            // Canceled prefix takes precedence over updated
            if(historyItem.cancel_notice === '1') { prefix = 'Canceled'; }

            // Original prefix takes precedence over all others
            if(historyItem.parent_notice == null) { prefix = 'Original';}

            let type = historyItem.procurement_type;
            let currentType = typeLabel.transform(type); // label for type of current history item

            switch(type) {
                // For these types, show title as prefix and opportunity type
              case 'p': // Presolicitation
              case 'r': // Sources Sought
              case 's': // Special Notice
              case 'g': // Sale of Surplus Property
              case 'f': // Foreign Government Standard
              case 'k': // Combined Synopsis/Solicitation
                return prefix + ' ' + currentType;

                // For these types, show the opportunity type as the title with no prefix
              case 'a': // Award Notice
              case 'j': // Justification and Approval (J&A)
              case 'i': // Intent to Bundle Requirements (DoD-Funded)
              case 'l': // Fair Opportunity / Limited Sources Justification
                return currentType;

                // For modifications or cancellations, show the appropriate prefix plus original opportunity type
              case 'm': // Modification/Amendment/Cancel
                return prefix + ' ' + originalType;

              // Unrecognized type, show generic message
              default:
                return prefix + ' Opportunity';
            }
          })();
          processedHistoryItem['description'] = ''; // not implemented yet
          processedHistoryItem['date'] = dateFormat.transform(historyItem.posted_date, 'MMM DD, YYYY h:mma');
          processedHistoryItem['url'] = 'opportunities/' + historyItem.notice_id;
          processedHistoryItem['index'] = historyItem.index;
          processedHistoryItem['isTagged'] = false; // todo: decide on logic for which opportunities are tagged
          processedHistoryItem['authoritative'] = historyItem.authoritative;

          return processedHistoryItem;
        });

        // Alert if not latest version
        let current = _.filter(this.processedHistory, historyItem => {
          return historyItem.id === opportunityAPI.opportunityId;
        })[0];

        let authoritative = _.filter(this.processedHistory, historyItem => {
          return historyItem.authoritative === '1';
        })[0];

        if(authoritative && current.id !== authoritative.id) {
          this.alert.push({
            config: {
              type: 'info',
              description: 'Note: There have been updates to this opportunity. To view the most recent update/amendment, click <a href="' + authoritative.url + '">here</a>'
            }
          });
        }
      });
    });
  }

  // Sets the correct displayField flags for this opportunity type
  private setDisplayFields(combinedOpportunityAPI: Observable<any>) {
    combinedOpportunityAPI.subscribe(([opportunity, parent]) => {
      if(opportunity.data == null || opportunity.data.type == null) {
        console.log('Error: No opportunity type');
        return;
      }

      this.displayField = {}; // for safety, clear any existing values

      // if type is Update/Amendment then display like original type
      let type = opportunity.data.type === 'm' ? parent.data.type : opportunity.data.type;

      switch (type) {
        // These types are a superset of p/m/r/s, using case fallthrough
        case 'g': // Sale of Surplus Property
        case 'f': // Foreign Government Standard
          this.displayField[OpportunityFields.SpecialLegislation] = false;
        // These types are a superset of j, using case fallthrough
        case 'p': // Presolicitation
        case 'k': // Combined Synopsis/Solicitation
        case 'r': // Sources Sought
        case 's': // Special Notice
          this.displayField[OpportunityFields.Award] = false;
          this.displayField[OpportunityFields.StatutoryAuthority] = false;
          this.displayField[OpportunityFields.ModificationNumber] = false;
        case 'j': // Justification and Approval (J&A)
          this.displayField[OpportunityFields.AwardAmount] = false;
          this.displayField[OpportunityFields.LineItemNumber] = false;
          this.displayField[OpportunityFields.AwardedName] = false;
          this.displayField[OpportunityFields.AwardedDUNS] = false;
          this.displayField[OpportunityFields.AwardedAddress] = false;
          this.displayField[OpportunityFields.Contractor] = false;

          this.displayField[OpportunityFields.JustificationAuthority] = false;
          this.displayField[OpportunityFields.OrderNumber] = false;
          break;

        // Type i is a superset of l, using case fallthrough
        case 'i': // Intent to Bundle Requirements (DoD-Funded)
          this.displayField[OpportunityFields.AwardDate] = false;
          this.displayField[OpportunityFields.JustificationAuthority] = false;
          this.displayField[OpportunityFields.ModificationNumber] = false;
          this.displayField[OpportunityFields.SpecialLegislation] = false;
        case 'l': // Fair Opportunity / Limited Sources Justification
          this.displayField[OpportunityFields.AwardAmount] = false;
          this.displayField[OpportunityFields.LineItemNumber] = false;
          this.displayField[OpportunityFields.AwardedName] = false;
          this.displayField[OpportunityFields.AwardedDUNS] = false;
          this.displayField[OpportunityFields.AwardedAddress] = false;
          this.displayField[OpportunityFields.Contractor] = false;
          this.displayField[OpportunityFields.StatutoryAuthority] = false;
          break;

        case 'a': // Award Notice
          this.displayField[OpportunityFields.ResponseDate] = false;
          this.displayField[OpportunityFields.StatutoryAuthority] = false;
          this.displayField[OpportunityFields.JustificationAuthority] = false;
          this.displayField[OpportunityFields.OrderNumber] = false;
          this.displayField[OpportunityFields.ModificationNumber] = false;
          this.displayField[OpportunityFields.POP] = false;
          break;

        default:
          console.log('Error: Unknown opportunity type ' + opportunity.data.type);
          break;
      }

      if(parent == null) {
        this.displayField[OpportunityFields.PostedDate] = false;
        this.displayField[OpportunityFields.ResponseDate] = false;
        this.displayField[OpportunityFields.ArchiveDate] = false;
        this.displayField[OpportunityFields.SetAside] = false;
      }

      this.ready = true;

      this.updateSideNav();
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
    this.router.navigate(['/opportunities',this.opportunity.opportunityId],navigationExtras);
    this.loadRelatedOpportunitiesByIdAndType(this.opportunityAPI);
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

  public getDownloadFileURL(fileID: string){
    return this.getBaseURL() + '/opportunities/resources/files/' + fileID + this.getAPIUmbrellaKey();
  }

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
  }

  sidenavPathEvtHandler(data){
    data = data.indexOf('#') > 0 ? data.substring(data.indexOf('#')) : data;

    if (this.pageFragment == data.substring(1)) {
      document.getElementById(this.pageFragment).scrollIntoView();
    }
    else if(data.charAt(0)=="#"){
			this.router.navigate([], { fragment: data.substring(1) });
		}
    else {
			this.router.navigate([data]);
		}
	}

  public getDownloadPackageURL(packageID: string) {
    return this.getBaseURL() + '/opportunities/resources/packages/' + packageID + '/download/zip' + this.getAPIUmbrellaKey();
  }

  public getDownloadAllPackagesURL(opportunityID: string) {
    return this.getBaseURL() + '/opportunities/' + opportunityID + '/resources/packages/download/zip' + this.getAPIUmbrellaKey();
  }

  public getBaseURL() {
    return API_UMBRELLA_URL + '/opps/v1';
  }

  public getAPIUmbrellaKey() {
    return '?api_key=' + API_UMBRELLA_KEY;
  }

  public toggleAccordion(card){
    card.accordionState = card.accordionState == 'expanded' ? 'collapsed' : 'expanded';
  }

  public hasPublicPackages(){
    for(let pkg of this.attachment['packages']) {
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

  private static readonly TYPE_UNKNOWN = { name: 'Unknown file type', iconClass: 'fa fa-file' };
  private static readonly TYPE_LINK = { name: 'External link', iconClass: 'fa fa-link' };
  private static readonly TYPE_ZIP = { name: 'Zip archive', iconClass: 'fa fa-file-archive-o' };
  private static readonly TYPE_XLS = { name: 'Excel spreadsheet', iconClass: 'fa fa-file-excel-o' };
  private static readonly TYPE_PPT = { name: 'Powerpoint presentation', iconClass: 'fa fa-file-powerpoint-o' };
  private static readonly TYPE_DOC = { name: 'Word document', iconClass: 'fa fa-file-word-o' };
  private static readonly TYPE_TXT = { name: 'Text file', iconClass: 'fa fa-file-text-o' };
  private static readonly TYPE_PDF = { name: 'PDF document', iconClass: 'fa fa-file-pdf-o' };
  private static readonly TYPE_HTML = { name: 'Html document', iconClass: 'fa fa-html5' };
  private static readonly TYPE_IMG = { name: 'Image', iconClass: 'fa fa-file-image-o' };

  private getResourceTypeInfo(type: string) {
    switch(type) {
      case 'link':
        return OpportunityPage.TYPE_LINK;

      case '.zip':
        return OpportunityPage.TYPE_ZIP;

      case '.xls':
      case '.xlsx':
        return OpportunityPage.TYPE_XLS;

      case '.ppt':
      case '.pptx':
        return OpportunityPage.TYPE_PPT;

      case '.doc':
      case '.docx':
        return OpportunityPage.TYPE_DOC;

      case '.txt':
      case '.rtf':
        return OpportunityPage.TYPE_TXT;

      case '.pdf':
        return OpportunityPage.TYPE_PDF;

      case '.htm':
      case '.html':
        return OpportunityPage.TYPE_HTML;

      case '.jpg':
      case '.png':
      case '.jpeg':
      case '.tif':
        return OpportunityPage.TYPE_IMG;

      default:
        return OpportunityPage.TYPE_UNKNOWN;
    }
  }
}
