import {Component, OnInit} from "@angular/core";
import { UserAccessService } from "api-kit/access/access.service";
import {Router, Route, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'rm-widget',
  templateUrl: './rm-widget.template.html'
})
export class RMWidgetComponent implements OnInit {

  autocompletePeoplePickerConfig = {
    keyValueConfig: {
      keyProperty: 'email',
      valueProperty: 'givenName',
      subheadProperty: 'email'
    }
  };

  adminLevel: number = 2; // default to regular user (non-admin)

  pendingCount: number;
  escalatedCount: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accessService: UserAccessService,
  ) {

  }

  ngOnInit() {
    this.adminLevel = this.route.snapshot.data['adminLevel'];
    this.accessService.getWidget().subscribe(res => {
      if (!res || !res.requests || ! res.requests.length) {
        return;
      }
      res.requests.forEach(countInfo => {
        if (!countInfo.type || !countInfo.type.toLowerCase()) {
          return;
        }
        if (countInfo.type.toLowerCase() === 'pending') {
          this.pendingCount = countInfo.count;
        } else if(countInfo.type.toLowerCase() === 'escalated') {
          this.escalatedCount = countInfo.count;
        }
      });
    });
  }

  onPersonChange(person) {
    this.router.navigate(['/users', person.email, 'access']);
  }
}
