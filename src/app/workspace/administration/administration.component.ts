import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { IAMService } from "api-kit";
import { UserAccessService } from "api-kit/access/access.service";
import { SystemAlertsService } from "api-kit/system-alerts/system-alerts.service";
import { AdminService } from "../../application-content/403/admin.service";

@Component({
  selector: 'workspace-administration',
  templateUrl: 'administration.template.html'
})
export class AdministrationComponent {
  public activeAlerts:number = 0;
  public draftAlerts:number = 0;

  public user = null;

  public states = {
    isSignedIn: false,
    menu: false,
    isCreate: false,
    isEdit: false,
    expanded: {
      aacRequest: false,
      fh: false,
      fsd: false,
      profile: false,
      rm: false,
      system: false,
    }
  };

  @Input() toggleControl = {
    aacRequest: true,
    fh: true,
    fsd: false,
    profile: true,
    rm: false,
    system: false,
  };

  constructor(private _router:Router,
              private route:ActivatedRoute,
              private api:IAMService,
              private alertService: SystemAlertsService,
  ) {}

  ngOnInit() {
    this.checkSession();
    this.getAlertStatistic('Active', this.setActiveAlertsNum);
    this.getAlertStatistic('Draft', this.setDraftAlertsNum);

    if (this.route.snapshot.data['adminLevel'] > 1) {
      this.toggleControl.rm = true;
    }
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

  checkSession() {
    //Get the sign in info
    this.api.iam.checkSession((user) => {
      this.states.isSignedIn = true;
      this.user = user;
    });

    this.toggleControl.system = this.api.iam.user.isSystemAccount();
    this.toggleControl.fsd = this.api.iam.user.isFSD();
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
