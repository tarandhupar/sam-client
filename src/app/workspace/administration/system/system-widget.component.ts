import { Component } from '@angular/core';
import { IAMService } from 'api-kit';

import { merge } from 'lodash';

@Component({
  selector: 'system-widget',
  templateUrl: './system-widget.component.html'
})
export class SystemWidgetComponent {
  public user;
  private summary = {
    Pending: '-',
    Approved: '-',
    Rejected: '-',
    Cancelled: '-',
  };

  private keys = {
    Pending: 'pending approval',
    approved: 'approved',
    rejected: 'rejected',
    cancelled: 'cancelled',
  };

  constructor(private api: IAMService) {}

  ngOnInit() {
    this.api.iam.user.get(user => {
      this.user = user;
      this.api.iam.cws.status(summary => {
        this.summary = merge({}, this.summary, {
          Pending: summary.pending,
          Approved: summary.approved,
          Rejected: summary.rejected,
          Cancelled: summary.cancelled,
        });
      });
    });
  }
}
