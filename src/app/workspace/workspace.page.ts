import  { Component } from "@angular/core";
import  { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FHService, IAMService } from 'api-kit';

@Component ( {
  templateUrl: 'workspace.template.html'
})
export class WorkspacePage  {

  public showWelcome:boolean = true;
  public dataEntryWidgetControl:any =  {entity:true,exclusions:true,award:true,opportunities:true,assistanceListings:true,subAward:true};
  public administrationWidgetControl:any =  {profile:true,fh:true,rm:false,aacRequest:true,alerts:true,analytics:true};

  public userProfile = 'r-IAE-ad';
  public userMapping:any =  {1:'f-ng-na',2:'f-g-na',3:'r-ng-na',4:'r-g-na',5:'r-g-ad',6:'r-IAE-ad'};
  public userAccessTokens:any = [];
  
  public user = null;
  
  private api = {
    fh: null,
    iam: null,
  };
  
  private store = {
    primary: '',
    secondary: 'Sub-tier Agency'
  };
  
  private shortcuts = {
    reset: {
      text: 'Reset Your Password',
      routerLink: ['/profile/password']
    },
    profile: {
      text: 'Go to My Profile',
      routerLink: ['/profile']
    }
  };
  
  public states = {
    public: false,
    federal: false
  };
  
  actions: Array<any> = [
    { name: 'help', label: 'Help', icon: 'fa fa-question-circle', callback: () => { console.log("Help!");}}
  ];
  
  constructor(private router: Router, 
              private route: ActivatedRoute,
              private _fh: FHService, 
              private _iam: IAMService) {
                this.api.iam = _iam.iam;
                this.api.fh = _fh;
  }

  ngOnInit() {
    this.initSession();
    this.route.queryParams.subscribe(queryParams => {
      if(queryParams['user'] !== undefined && queryParams['user'] !== null) {
        this.userProfile = this.userMapping[queryParams['user']];
      }

      this.userAccessTokens = this.userProfile.split('-');
      this.showWelcome =  this.userAccessTokens[0] === 'f';
      this.setDataEntryWidgetControl();
      this.setAdministrationWidgetControl();
    });
  }
  
  initSession() {
    this.api.iam.checkSession((user) => {
      this.user = user;
      this.states.public = !(this.user.gov || this.user.entity);
      this.states.federal = this.user.gov;
      
      if(this.states.federal) {
        const orgID = (this.user.agencyID || this.user.departmentID).toString();

        if(orgID.length) {
          this.api.fh
           .getOrganizationById(orgID)
           .subscribe(data => {
             const organization = data['_embedded'][0]['org'];
             this.store.primary = (organization.l2Name || organization.l1Name || '');
           });
        }
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
