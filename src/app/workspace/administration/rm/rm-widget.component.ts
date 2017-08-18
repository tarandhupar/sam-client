import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { UserAccessService } from "api-kit/access/access.service";
import {Router, Route, ActivatedRoute} from "@angular/router";
import { RMSUserServiceImpl } from "../../../users/request-access/username-autocomplete.component";
import { ReplaySubject, Subject, Observable, Observer } from "rxjs";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";

@Component({
  selector: 'rm-widget',
  templateUrl: './rm-widget.template.html'
})
export class RMWidgetComponent implements OnInit {

  userConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  loadingState: 'loading'|'success'|'error' = 'loading';
  pendingCount: number = 0;
  escalatedCount: number = 0;

  shouldShowPending: boolean = false;
  shouldShowEscalated: boolean = false;
  shouldShowRoleDefinitions: boolean = false;
  shouldShowRoleDirectory: boolean = false;
  
  @ViewChild('autoComplete') autoComplete: SamAutocompleteComponent;

  get shouldShowAnyAdmin() {
    return this.shouldShowEscalated || this.shouldShowPending || this.shouldShowRoleDirectory || this.shouldShowRoleDefinitions;
  }

  dummySearchValue; //autocomplete makes me do this
  request: Observable<any>;

  constructor(
    private router: Router,
    private accessService: UserAccessService,
  ) {

  }


  ngOnInit() {
    this.request = this.autoComplete.keyEvents
      .debounceTime(300)
      .switchMap(
        input => {
          return this.accessService.getUserAutoComplete(input)
            .catch(e => {
              return Observable.of([]);
            });
        }
      )
      .map(
        users => {
          if (!users) {
            return [];
          }
          return users.map(user => {
            return {
              key: user.email,
              value: `${user.firstName} ${user.lastName} (${user.email })`
            };
          });
        }
      );

    this.accessService.getWidget().subscribe(
      res => {
        this.loadingState = 'success';
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
        this.loadingState = 'error';
      }
    );
  }

  getResults(q) {
    return this.accessService.getUserAutoComplete(q).map(
      users => {
        return users.map(user => {
          return {
            key: user.email,
            value: `${user.firstName} ${user.lastName} (${user.email })`
          };
        });
      }
    );
  }

  onPersonChange(person) {
    this.router.navigate(['/users', person.key, 'access']);
  }
}
