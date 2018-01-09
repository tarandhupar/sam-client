import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EntityService, FHService, IAMService } from 'api-kit';

import { some } from 'lodash';

@Component ( {
  templateUrl: 'workspace.template.html'
})
export class WorkspacePage  {
  public showWelcome: boolean = true;
  public dataEntryWidgetControl: { [key: string]: boolean } =  {
    entity: true,
    exclusions: true,
    award: true,
    opportunities: true,
    assistanceListings: true,
    subAward: true,
    cba: true
  };

  public administrationWidgetControl: { [key: string]: boolean } =  {
    fsd: false,
    fh: true,
    rm: true,
    system: false,
  };

  public userProfile = 'r-IAE-ad';
  public userMapping: { [key: string]: string } = {
    1: 'f-ng-na',
    2: 'f-g-na',
    3: 'r-ng-na',
    4: 'r-g-na',
    5: 'r-g-ad',
    6: 'r-IAE-ad'
  };

  public userAccessTokens: Array<string> = [];

  public user = null;

  private subscriptions = {};
  private api = {
    entity: null,
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
    federal: false,
    anyAdminWidget: false,
    isDisplayDataEntry: false,
  };

  public actions: Array<{ [key: string]: string|Function }> = [
    {
      label: 'Help',
      icon: 'fa fa-question-circle',
      callback: () => { this.router.navigate(['/help/accounts']); }
    }
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _entity: EntityService,
              private _fh: FHService,
              private _iam: IAMService) {
    this.api.entity = _entity;
    this.api.fh = _fh;
    this.api.iam = _iam.iam;
  }

  ngOnInit() {
    this.initSession(() => {
      this.subscriptions['queryParams'] = this.route.queryParams.subscribe(queryParams => {
        if(queryParams['user'] !== undefined && queryParams['user'] !== null) {
          this.userProfile = this.userMapping[queryParams['user']];
        }

        this.userAccessTokens = this.userProfile.split('-');
        this.showWelcome =  this.userAccessTokens[0] === 'f';
        this.setDataEntryWidgetControl();
        this.setAdministrationWidgetControl();
      });
    });

  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.subscriptions).map(key => {
      if(this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    });
  }

  initSession(cb: Function = () => {}) {
    this.api.iam.checkSession((user) => {
      this.user = user;
      this.states.public = !(this.user.gov || this.user.entity);
      this.states.federal = this.user.gov;

      if(this.states.federal) {
        const orgID = (this.user.agencyID || this.user.departmentID).toString();

        if(orgID.length) {
          this.subscriptions['fh'] = this.api.fh
           .getOrganizationById(orgID)
           .subscribe(data => {
             const organization = data['_embedded'][0]['org'];
             this.store.primary = (organization.l2Name || organization.l1Name || '');
           });
        }
      } else if(this.user.entity) {
        this.subscriptions['entity'] = this.api.entity
          .findByCageCode(this.user.businessName)
          .subscribe(entity => {
            this.store.primary = entity.legalBusinessName
          });
      }

      cb();
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
      this.dataEntryWidgetControl.cba = false;
    }

    if(this.userAccessTokens[1] === 'IAE') {
      this.dataEntryWidgetControl.award = false;
      this.dataEntryWidgetControl.cba = true;
    }

    if(this.userProfile === 'r-ng-na') {
      this.dataEntryWidgetControl.subAward = true;
    }

    if(this.userProfile === 'r-g-na') {
      this.dataEntryWidgetControl.opportunities = true;
    }

    this.states.isDisplayDataEntry = some(this.dataEntryWidgetControl);
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

    this.administrationWidgetControl.fsd = this.user.fsd;
    this.administrationWidgetControl.system = this.user.system;

    this.states.anyAdminWidget = some(this.administrationWidgetControl);
  }

  closeWelcomeSection() {
    this.showWelcome = false;
  }
}
