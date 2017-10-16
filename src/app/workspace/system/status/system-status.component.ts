import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';

import { IAMService } from 'api-kit';
import { CWSApplication } from 'api-kit/iam/interfaces';

@Component({
  templateUrl: './system-status.component.html',
  providers: [
    IAMService,
  ],
})
export class SystemStatusComponent {
  private store = {};
  public application: CWSApplication;

  constructor(private route: ActivatedRoute, private router: Router, private api: IAMService) {}

  ngOnInit() {
    this.store['observer'] = this.route.params.subscribe(params => {
      if(params['id']) {
        this.api.iam.cws.application.get(params['id'], application => {
          this.application = application;
        }, error => {
          this.router.navigate(['/workspace/system']);
        });
      }
    });

  }

  ngOnDestroy() {
    if(this.store['observer']) {
      this.store['observer'].unsubscribe();
    }
  }

  get status(): number {
    let status = 1;

    switch(this.application.applicationStatus) {
      case 'Pending Approval':
        status = 2;
        break;

      case 'Approved':
      case 'Rejected':
        status = 3;
        break;
    }

    return status;
  }

  field(key: string = '') {
    let field = this.application[key] ? this.application[key] : '',
        format = 'MMM D, h:mm a';

    switch(key) {
      case 'submittedDate':
      case 'lastUpdate':
      case 'securityApproved_Date':
        if(field) {
          field = moment(field).format(format);
        } else if(key == 'securityApproved_Date') {
          field = '<em>Not yet approved</em>';
        }

        break;

      case 'securityApprover':
        if(!field) {
          field = '<em>Not yet approved</em>';
        }

        break;
    }

    return field;
  }
}
