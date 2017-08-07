import {Component, OnInit} from "@angular/core";
import { UserAccessService } from "api-kit/access/access.service";
import {Router, Route, ActivatedRoute} from "@angular/router";
import { RMSUserServiceImpl } from "../../../users/request-access/username-autocomplete.component";

@Component({
  selector: 'rm-widget',
  templateUrl: './rm-widget.template.html',
  providers: [RMSUserServiceImpl]
})
export class RMWidgetComponent implements OnInit {

  userConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  pendingCount: number = 0;
  escalatedCount: number = 0;

  shouldShowPending: boolean = false;
  shouldShowEscalated: boolean = false;
  shouldShowRoleDefinitions: boolean = false;
  shouldShowRoleDirectory: boolean = false;

  get shouldShowAnyAdmin() {
    return this.shouldShowEscalated || this.shouldShowPending || this.shouldShowRoleDirectory || this.shouldShowRoleDefinitions;
  }

  dummySearchValue; //autocomplete makes me do this
  loadingAccess: boolean = true;

  constructor(
    private router: Router,
    private accessService: UserAccessService,
  ) {

  }

  ngOnInit() {
    this.accessService.getWidget().subscribe(
      res => {
        if (res._links && res._links.domaindefinition) {
          this.shouldShowRoleDefinitions = true;
        }

        if (res._links && res._links.userdirectory) {
          this.shouldShowRoleDirectory = true;
        }

        if (!res || !res.requests || ! res.requests.length) {
          return;
        }

        res.requests.forEach(countInfo => {
          if (!countInfo.type || !countInfo.type.toLowerCase()) {
            return;
          }
          if (countInfo.type.toLowerCase() === 'pending') {
            this.shouldShowPending = true;
            this.pendingCount = countInfo.count;
          } else if(countInfo.type.toLowerCase() === 'escalated') {
            this.shouldShowEscalated = true;
            this.escalatedCount = countInfo.count;
          }
        });
      },
      err => {
        this.loadingAccess = false;
      },
      () => {
        this.loadingAccess = false;
      }
    );
  }

  onPersonChange(person) {
    this.router.navigate(['/users', person.key, 'access']);
  }
}
