
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
import { SamTitleService } from 'api-kit/title-service/title.service';
import { SamErrorService } from 'api-kit/error-service';
import { AlertFooterService } from "./app-components/alert-footer/alert-footer.service";


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  templateUrl: './app.template.html'
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
  searchBarConfig = {
    placeholder: "I'm looking for..."
  };

  showOverlay = false;

  errorSubscription;

  constructor(private _router: Router,
              private activatedRoute: ActivatedRoute,
              private searchService: SearchService,
              private userSessionService: UserSessionService,
              private zone: NgZone,
              private titleService: SamTitleService,
              private errorService: SamErrorService,
              private alertFooterService: AlertFooterService) {}

  ngOnInit() {
    //for browsers that are blocking font downloads, add fallback icons
    new FontChecker("FontAwesome", {
      error: function() { document.getElementsByTagName("body")[0].classList.add("fa-fallback-icons"); }
    });

    if(window.location.pathname.localeCompare("/fal/workspace") !== 0){
      this.activatedRoute.queryParams.subscribe(
        data => {
          this.autocomplete.inputValue = "";
          this.keyword = "";
          this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
          this.isActive = typeof data['is_active'] === "string" ? data['is_active'] : this.isActive;
        });
    }
    this._router.events.subscribe(
      val => {
        this.showOverlay = false;
        if (val instanceof NavigationEnd) {
          this.titleService.setTitle(this._router.url);

          if(this.userSessionService.idleState === "Not started" && Cookie.check("iPlanetDirectoryPro")){
            this.zone.run(()=>{this.userSessionService.idleDetectionStart(this.sessionModalCB)});
          }

          const tree = this._router.parseUrl(this._router.url);
          let root = this._router.url.split('?')[0];
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
          } else if(['/search'].indexOf(root)!==-1){
            //nothing, just don't scroll
          } else {
            window.scrollTo(0,0);
          }
        }
      });
    /**
     * LEAVE COMMENTED OUT
     * 
     * Once we finish implementing the business rules,
     * this will send API errors to the alert footer service
     * and they will all be managed from here.
     */
    // this.errorService.addEventListener('newError', (err) => {
    //   this.alertFooterService.registerFooterAlert({
    //     type: 'error',
    //     title: err.message.title,
    //     description: err.message.description,
    //     dismiss: 0,
    //     error: err
    //   })
    // }, this);

    // this.alertFooterService.addEventListener('dismiss', (alert) => {
    //   if (alert.error) {
    //     this.errorService.removeError(alert.error);
    //   }
    // }, this);
  }

  get isHeaderWithSearch() {
    return globals.isDefaultHeader;
  }

  onHeaderSearchEvent(searchObject) {
    var qsobj = this.qs;

    if(searchObject.keyword.length>0){
      qsobj['keywords'] = this.autocomplete.inputValue;
    } else {
      qsobj['keywords'] = '';
    }

    if(qsobj['keywords'].length > 0){
      //default sort for non-blank search
      qsobj['sort'] = "-relevance"
    }else{
      //different default sort by date options for blank search
      if(this.index === 'ei'){
        qsobj['sort'] = 'title';
      }else{
        qsobj['sort'] = "-modifiedDate";
      }
    }

    if(searchObject.searchField.length>0){
      qsobj['index'] = searchObject.searchField;
    } else {
      qsobj['index'] = '';
    }

    qsobj['page'] = 1;

    if(searchObject.searchField !== 'ei') {
      qsobj['entity_type'] = null;
    } else {
      qsobj['entity_type'] = ["ent","ex"];
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
