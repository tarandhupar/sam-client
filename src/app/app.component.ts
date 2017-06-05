
/*
 * Angular 2 decorators and services
 */
import { Component, ViewChild, Input, NgZone } from '@angular/core';
import { Router, NavigationExtras,NavigationEnd,ActivatedRoute } from '@angular/router';
import { globals } from './globals.ts';
import { SearchService } from 'api-kit';
import { Cookie } from 'ng2-cookies';
import { FontChecker } from './app-utils/fontchecker';
import { UserSessionService } from 'api-kit/user-session/user-session.service';


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  templateUrl: './app.template.html',
  providers : [SearchService]
})
export class App{

  @ViewChild('autocomplete') autocomplete: any;
  @ViewChild('userSessionModal') sessionModal;
  sessionModalConfig = {
    type:'warning',
    title:'User Session Timeout',
    description:'Your login session will expire in 2 mins due to inactivity. Do you want to stay signed in?'
  };

  keyword: string = "";
  index: string = "";
  isActive: boolean = true;
  qs: any = {};
  searchSelectConfig = {
    options: globals.searchFilterConfig,
    disabled: false,
    label: '',
    name: 'filter',
  };

  showOverlay = false;

  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private searchService: SearchService, private userSessionService: UserSessionService, private zone: NgZone) {}

  ngOnInit() {
    //for browsers that are blocking font downloads, add fallback icons
    new FontChecker("FontAwesome", {
      error: function() { document.getElementsByTagName("body")[0].classList.add("fa-fallback-icons"); }
    });

    this.searchService.paramsUpdated$.subscribe(
      obj => {
        this.setQS(obj);
      });
    if(window.location.pathname.localeCompare("/fal/workspace") !== 0){
      this.activatedRoute.queryParams.subscribe(
        data => {
          this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
          this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
          this.isActive = typeof data['isActive'] === "string" ? data['isActive'] : this.isActive;
        });
    }
    this._router.events.subscribe(
      val => {
        this.showOverlay = false;
        if (val instanceof NavigationEnd) {
          if(this.userSessionService.idleState === "Not started" && Cookie.check("iPlanetDirectoryPro")){
            this.zone.run(()=>{this.userSessionService.idleDetectionStart(this.sessionModalCB)});
          }

          const tree = this._router.parseUrl(this._router.url);
          if(this._router.url == "/") {
            this.autocomplete.inputValue = "";
            this.keyword = "";
            this.index = "";
            this.qs = {};
          }
          if (tree.fragment) {
            const element = document.getElementById(tree.fragment);
            if (element) {
              element.scrollIntoView();
            }
          } else {
            window.scrollTo(0,0);
          }
        }
      });
  }

  get isHeaderWithSearch() {
    return globals.isDefaultHeader;
  }

  onHeaderSearchEvent(searchObject) {
    var qsobj = this.qs;
    if(searchObject.keyword.length>0){
      qsobj['keyword'] = searchObject.keyword;
    } else {
      qsobj['keyword'] = '';
    }
    if(searchObject.searchField.length>0){
      qsobj['index'] = searchObject.searchField;
    } else {
      qsobj['index'] = '';
    }

    qsobj['page'] = 1;

    //set regionalOffice filter keyword to null on header search event
    qsobj['ro_keyword'] = null;

    if(searchObject.searchField === 'fh') {
      qsobj['isActive'] = true;
    } else {
      qsobj['isActive'] = this.isActive;
    }
    if(searchObject.searchField !== 'wd') {
      qsobj['wdType'] = null;
      qsobj['state'] = null;
      qsobj['county'] = null;
      qsobj['conType'] = null;
      qsobj['service'] = null;
      qsobj['isEven'] = null;
      qsobj['cba'] = null;
      qsobj['prevP'] = null;
      qsobj['isStandard'] = null;
    }
    if(searchObject.searchField === 'wd' || searchObject.searchField === 'ei'){
      qsobj['organizationId'] = null;
    }
    if(searchObject.searchField !== 'fpds') {
      qsobj['awardOrIdv'] = null;
      qsobj['awardType'] = null;
      qsobj['contractType'] = null;
    }
    if(searchObject.searchField !== 'fpds' && searchObject.searchField !== 'opp' && searchObject.searchField !== 'ei') {
      qsobj['naics'] = null;
      qsobj['psc'] = null;
      qsobj['duns'] = null;
    }
    if(searchObject.searchField !== 'cfda'){
      qsobj['applicant'] = null;
      qsobj['beneficiary'] = null;
    }

    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };

    this._router.navigate(['/search'], navigationExtras );

    return false;
  }

  setQS(obj){
    this.qs = obj;
  }

  toggleOverlay(value){
    this.showOverlay = value;

  }

  continueSession:boolean = false;
  sessionModalCB:any = () => {
    if(this.userSessionService.isIdle && !this.userSessionService.timedOut && this.userSessionService.pingState !== "Log out"){
      if(!this.sessionModal.show) {
        this.sessionModal.openModal();
      }
    }
    if(this.userSessionService.timedOut || this.userSessionService.pingState == "Log out") {
      if(this.sessionModal.show) this.sessionModal.closeModal();
    }
  };

  onSessionModalContinue(){
    //User session service extend user session call
    this.userSessionService.extendUserSession();
    this.continueSession = true;
    this.sessionModal.closeModal();
  }

  onSessionModalClose(){
    this.userSessionService.idleDetectionStop();
    if(!this.continueSession){
      //User session service log out call and redirect to home page
      this.userSessionService.logoutUserSession();

      if(this.sessionModal.show) this.sessionModal.closeModal();

    }else{
      this.zone.run(()=>{this.userSessionService.idleDetectionStart(this.sessionModalCB)});

    }
    this.continueSession = false;
  }

}
