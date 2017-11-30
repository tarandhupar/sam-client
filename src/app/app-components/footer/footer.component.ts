import { Component } from '@angular/core';
import { SYSTEM_ALERTS_PAGE_PATH } from "../../alerts/alerts.route";
import { SystemAlertsService } from '../../../api-kit/system-alerts/system-alerts.service';
import { get } from 'lodash';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IAMService } from '../../../api-kit/iam/iam.service';
import { globals } from '../../globals';

@Component({
  selector: 'sam-footer',
  templateUrl:'footer.template.html',
})
export class SamFooterComponent {
  alertsUrl: string = SYSTEM_ALERTS_PAGE_PATH;
  buildDate: string = BUILD_DATE;
  gitLog: string = GIT_LOG;
  isAdmin: boolean = false;
  routerSubscription: Subscription;
  wasSignedIn: boolean = false;

  constructor(
    private systemAlertsService: SystemAlertsService,
    private router: Router,
    private iamService: IAMService)
  {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isSignedIn = this.iamService.iam.user.isSignedIn();
        if (isSignedIn !== this.wasSignedIn) {
          systemAlertsService.getActive(1).subscribe(
            res => {
              this.isAdmin = !!get(res, "_links.create");
            }, err => {
              // do nothing, but we do not want to throw if the service is down
            });
        }
        this.wasSignedIn = isSignedIn;
      }
    });
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
