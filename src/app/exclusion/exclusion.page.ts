import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ExclusionService, FHService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import {CapitalizePipe} from "../app-pipes/capitalize.pipe";
import { BackToSearch } from "../app-utils/back-to-search-helper";
import { SidenavService } from 'sam-ui-elements/src/ui-kit/components/sidenav/services/sidenav.service';
import { SidenavHelper } from "../app-utils/sidenav-helper";
import { LocationService } from 'api-kit/location/location.service';
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'exclusion.page.html',
  providers: [
    ExclusionService,
	SidenavHelper,
	BackToSearch
  ]
})
export class ExclusionsPage implements OnInit, OnDestroy {
  currentUrl: string;
  subscription: Subscription;
  exclusion: any;
  qParams:any = {};
  linkedObjectView: any;
  errorExclusion: any;
  errorLogo: any;
  public logoUrl: any;
  public logoInfo: any;
  pageRoute: string;
  selectedPage: number = 0;
  urlIndex: number = 0;
  entitySideNavContent: any;
  sidenavModel = {
    "label": "Exclusion",
    "children": []
  };
  error;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private ExclusionService: ExclusionService,
	private fhService: FHService,
	private sidenavHelper: SidenavHelper,
	private sidenavService: SidenavService,
	private backToSearch: BackToSearch,
	private locationService: LocationService) {}

  ngOnInit() {
    this.loadExclusion();
	this.sidenavService.updateData(this.selectedPage, 0);
	this.qParams = this.backToSearch.setqParams();
	this.currentUrl = this.location.path();
  }

   private loadExclusion() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      this.linkedObjectView = params['link'];
	  return this.ExclusionService.getExclusion(params['id']);
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.exclusion = jsonData.exclusionDetails;
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
		this.urlIndex = this.currentUrl.indexOf("?");
		let url = this.currentUrl.substring(0, this.urlIndex)
		this.pageRoute = decodeURIComponent(url);
		this.entitySideNavContent = {
        "label": "Exclusion",
        "route": this.pageRoute,
        "children": [
			{
				"label": "Exclusion Details",
				"field": "#exclusion-details",
			},
			{
			  "label": "Cross References",
			  "field": "#cross-references",
			}
		]
      };
	if(this.exclusion.classificationType == 'Vessel')
	{
		let vesselSideNavChildren = {
        "label": "Vessel Details",
        "field": "#vessel-details",
		};
		this.entitySideNavContent.children.unshift(vesselSideNavChildren);
	}
	else if(this.exclusion.classificationType == 'Individual')
	{
		let individualSideNavChildren = {
        "label": "Primary Address",
        "field": "#primary-address",
		};
		this.entitySideNavContent.children.unshift(individualSideNavChildren);
	}
	this.sidenavHelper.updateSideNav(this, false, this.entitySideNavContent);
    }, err => {
		this.errorExclusion = true;
      console.log('Error logging', err);
    });
   }
   
  sidenavPathEvtHandler(data){
    this.sidenavHelper.sidenavPathEvtHandler(this, data);
  }

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
