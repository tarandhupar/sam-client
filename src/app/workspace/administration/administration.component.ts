import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { IAMService } from 'api-kit';

import { SystemAlertsService } from 'api-kit/system-alerts/system-alerts.service';
import { AdminService } from 'application-content/403/admin.service';
import { Cookie } from "ng2-cookies";
import { UserService } from "../../role-management/user.service";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { FeatureToggleService } from "../../../api-kit/feature-toggle/feature-toggle.service";
import { FHAdminType, FhWidgetService } from './fh/fh-widget.service';

@Component({
  selector: 'workspace-administration',
  templateUrl: 'administration.template.html'
})
export class AdministrationComponent {
  public shortcuts = {
    reset: {
      text: 'Reset Your Password',
      routerLink: ['/profile/password']
    },
    profile: {
      text: 'Go to My Profile',
      routerLink: ['/profile']
    }
  };

  public activeAlerts: number = 0;
  public draftAlerts: number = 0;
  public user = null;
  public states = {
    isSignedIn: false,
    menu: false,
    public: false,
    isCreate: false,
    isEdit: false,
    expanded: {
      aacRequest: false,
      fh: false,
      fsd: false,
      profile: false,
      rm: false,
      system: false,
      opp: false
    }
  };
  public widgetResult: any;

  @Input() toggleControl: any;

  actions: Array<any> = [
    {
      label: 'Help',
      icon: 'fa fa-question-circle',
      callback: () => { this._router.navigate(['/help/award'], { fragment: 'federalHierarchy'});}
    }
  ];

  constructor(private _router: Router,
              private route: ActivatedRoute,
              private api: IAMService,
              private alertService: SystemAlertsService,
              private userService: UserService,
              private userAccessService: UserAccessService,
              private featureToggleService: FeatureToggleService,
              private fhWidetService: FhWidgetService,
  ) {}

  ngOnInit() {
    this.initSession();
    this.getAlertStatistic('Active', this.setActiveAlertsNum);
    this.getAlertStatistic('Draft', this.setDraftAlertsNum);
    if (this.userService.isLoggedIn()) {
      this.userAccessService.getWidget().subscribe(
        res => {
          if (!res) {
            return;
          }
          this.toggleControl.rm = true;
          this.widgetResult = res;
        },
        err => {
          // don't show the widget on errors, or 401 or 405
        });
    }

    this.fhWidetService.fetchRecent().subscribe(res => {
      const adminType: FHAdminType = this.fhWidetService.getAdminType(res);
      if (adminType === FHAdminType.SuperAdmin || adminType === FHAdminType.OfficeAdmin) {
        this.toggleControl.fh = true;
      }
    });
  }

  resetHelpDetails() {
    let type;

    for(type in this.states.expanded) {
      this.states.expanded[type] = false;
    }
  }

  toggleHelpDetail(type) {
    if(this.states.expanded[type]) {
      this.states.expanded[type] = false;
    } else {
      this.resetHelpDetails();
      this.states.expanded[type] = true;
    }
  }

  onAddNewAlert() {
    let navigationExtras:NavigationExtras = {queryParams: {mode: 'create'}};
    this._router.navigate(["/alerts"], navigationExtras);
  }

  onDirectToAlerts(status) {
    let navigationExtras:NavigationExtras = {queryParams: {status: status}};
    this._router.navigate(["/alerts"], navigationExtras);
  }

  initSession() {
    // Get the sign in info
    this.api.iam.checkSession((user) => {
      this.states.isSignedIn = true;
      this.user = user;

      this.initRoles();
    });
  }

  initRoles() {
    this.states.public = !(this.user.gov || this.user.entity);
    this.toggleControl.system = (this.user.systemAccount || this.user.systemApprover);
    this.toggleControl.fsd = this.user.fsd;
  }

  getAlertStatistic(type, cb:(num)=>any){
    this.alertService
      .getAll(5, 0, [type], ['Error', 'Informational', 'Warning'], '', 'published_date', 'asc')
      .subscribe(alerts => {
        cb(alerts.total);
      });
  }

  setActiveAlertsNum:any = (num) => {this.activeAlerts = num;};
  setDraftAlertsNum:any = (num) => {this.draftAlerts = num;};
}
