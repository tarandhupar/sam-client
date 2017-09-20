import { Component } from '@angular/core';
import { globals } from '../../globals.ts';
import { SYSTEM_ALERTS_PAGE_PATH } from "../../alerts/alerts.route";


@Component({
  selector: 'sam-footer',
  templateUrl:'footer.template.html',
})
export class SamFooterComponent {
  alertsUrl: string = SYSTEM_ALERTS_PAGE_PATH;
  buildDate: string = BUILD_DATE;
  gitLog: string = GIT_LOG;

  constructor() {
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }
}
