import  { Component } from "@angular/core";
import  { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component ( {
  templateUrl: 'workspace.template.html'
})
export class WorkspacePage  {
  private store = {
    nav: [
      { text: 'My Workspace', routerLink: '/workspace', routerLinkActive: 'usa-current', children: [
        { text: 'Notification',    routerLink: '#notification',   anchor: true },
        { text: 'User Preference', routerLink: '#preference',     anchor: true },
        { text: 'Data Entry',      routerLink: '#data-entry',     anchor: true },
        { text: 'Administration',  routerLink: '#administration', anchor: true },
      ] },
    ]
  };

  private states = {
    nav: true
  };

  public currentUrl:string = "workspace";
  public currentSection: string = "";
  public showWelcome:boolean = true;
  public dataEntryWidgetControl:any =  {entity:true,exclusions:true,award:true,opportunities:true,assistanceListings:true,subAward:true};
  public administrationWidgetControl:any =  {profile:true,fh:true,rm:true,aacRequest:true,alerts:true,analytics:true};

  public userProfile = 'r-IAE-ad';
  public userMapping:any =  {1:'f-ng-na',2:'f-g-na',3:'r-ng-na',4:'r-g-na',5:'r-g-ad',6:'r-IAE-ad'};
  public userAccessTokens:any = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if(queryParams['user'] !== undefined && queryParams['user'] !== null) {
        this.userProfile = this.userMapping[queryParams['user']];
      }

      this.userAccessTokens = this.userProfile.split('-');
      this.showWelcome =  this.userAccessTokens[0] === 'f';
      this.setDataEntryWidgetControl();
      this.setAdministrationWidgetControl();
    });

    this.router.events.subscribe((event) => {
      if(event.constructor.name === 'NavigationEnd') {
        this.states.nav = this.router.url.match(/workspace\/system[^\/]/) ? false : true;
      }
    });
  }

  setDataEntryWidgetControl() {
    if(this.userAccessTokens[2] !== 'ad')  {
      this.dataEntryWidgetControl.entity = false;
      this.dataEntryWidgetControl.exclusions = false;
      this.dataEntryWidgetControl.assistanceListings = false;
      this.dataEntryWidgetControl.award = false;
      this.dataEntryWidgetControl.subAward = false;
      this.dataEntryWidgetControl.opportunities = false;
    }

    if(this.userAccessTokens[1] === 'IAE') {
      this.dataEntryWidgetControl.award = false;
    }

    if(this.userProfile === 'r-ng-na') {
      this.dataEntryWidgetControl.subAward = true;
    }

    if(this.userProfile === 'r-g-na') {
      this.dataEntryWidgetControl.opportunities = true;
    }
  }

  setAdministrationWidgetControl() {
    if(this.userAccessTokens[2] !== 'ad') {
      this.administrationWidgetControl.fh = false;
      this.administrationWidgetControl.rm = false;
    }

    if(this.userAccessTokens[1] === 'ng') {
      this.administrationWidgetControl.aacRequest = false;
    }

    if(this.userAccessTokens[1] !== 'IAE') {
      this.administrationWidgetControl.alerts = false;
      this.administrationWidgetControl.analytics = false;
    }
  }

  getSectionClass(sectionValue) {
    return this.currentSection === sectionValue? "usa-current":"";
  }

  closeWelcomeSection() {
    this.showWelcome = false;
  }

  isDisplayDataEntry():boolean {
    let display = false;

    Object.keys(this.dataEntryWidgetControl).forEach(key => {
      if(this.dataEntryWidgetControl[key]) display = true;
    });

    return display;
  }
}
