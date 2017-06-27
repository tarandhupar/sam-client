import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { EntityService, FHService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import { SidenavService } from 'sam-ui-kit/components/sidenav/services/sidenav.service';
import { SidenavHelper } from "../app-utils/sidenav-helper";
import { BackToSearch } from "../app-utils/back-to-search-helper";
import { LocationService } from 'api-kit/location/location.service';
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'entity-object-view.page.html',
  providers: [
    EntityService,
	FHService,
	SidenavHelper,
	BackToSearch
  ]
})
export class EntityPage implements OnInit, OnDestroy {
  currentUrl: string;
  coreData: any;
  assertions: any;
  repsAndCerts: any;
  mandatoryPOCs: any;
  optionalPOCs: any;
  exclusionsList: any;
  subscription: Subscription;
  errorEntity: any;
  errorLogo: any;
  public logoUrl: any;
  public logoInfo: any;
  pageRoute: string;
  selectedPage: number = 0;
  sidenavModel = {
    "label": "Entity",
    "children": []
  };
  naicsDetails: any;
  pscDetails: any;
  qParams:any = {};
  error;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private EntityService: EntityService,
	private fhService: FHService,
	private sidenavHelper: SidenavHelper,
	private sidenavService: SidenavService,
	private backToSearch: BackToSearch,
	private locationService: LocationService) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadEntityData();
	this.sidenavService.updateData(this.selectedPage, 0);
	this.qParams = this.backToSearch.setqParams();
  }

   private loadEntityData() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.EntityService.getCoreDataById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.coreData = jsonData.entityInfo.coreData;
      this.assertions = jsonData.entityInfo.assertions;
      this.repsAndCerts = jsonData.entityInfo.repsAndCerts;
      this.mandatoryPOCs = jsonData.entityInfo.mandatoryPOCs;
  	  this.optionalPOCs = jsonData.entityInfo.optionalPOCs;
	  this.exclusionsList = jsonData.entityInfo.exclusionsList;
	  if(jsonData.entityInfo.assertions.naicsList != null){
		this.getNaicsDescription(jsonData.entityInfo.assertions.naicsList);
	  }
	  if(jsonData.entityInfo.assertions.pscList != null){
		this.getPscDescription(jsonData.entityInfo.assertions.pscList);
	  }
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
		this.pageRoute = this.currentUrl;
		let entitySideNavContent = {
        "label": "Entity Registration",
        "route": this.pageRoute,
        "children": [
			{
				"label": "Core Data",
				"field": "#core-data",
			},
			{
			  "label": "Assertions",
			  "field": "#assertions",
			},
			{
			  "label": "Reps & Certs",
			  "field": "#reps-certs",
			},
			{
			  "label": "POCs",
			  "field": "#pocs",
			},
			{
			  "label": "Exclusions",
			  "field": "#exclusions",
			}
		]
      };
	this.sidenavHelper.updateSideNav(this, false, entitySideNavContent);
    }, err => {
		this.errorEntity = true;
      console.log('Error logging', err);
    });
   }
   
  sidenavPathEvtHandler(data){
    this.sidenavHelper.sidenavPathEvtHandler(this, data);
  }

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
  }
  
  getNaicsDescription(naicsList){
	var codeList;
	naicsList.forEach(code => {
		if(codeList != null){
			codeList += ',' + code;
		}
		else {
			codeList = code;
		}
	});
	this.locationService.getNaicsDetails('2017', codeList).subscribe(
		res => {
			this.naicsDetails = res._embedded.nAICSList;
		},
		  error => {
			this.error = error;
	});
  }
	
	getPscDescription(pscList){
	var codeList;
	pscList.forEach(code => {
		if(codeList != null){
			codeList += ',' + code;
		}
		else {
			codeList = code;
		}
	});
	this.locationService.getPSCDetails(codeList).subscribe(
		res => {
			this.pscDetails = res._embedded.productServiceCodeList;
		},
		  error => {
			this.error = error;
	});
	}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
