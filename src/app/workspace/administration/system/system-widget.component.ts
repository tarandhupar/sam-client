import { Component } from '@angular/core';
import { IAMService } from 'api-kit';

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

  constructor(private api: IAMService) {}

  ngOnInit() {
    this.api.iam.user.get(user => {
      this.user = user;
      this.api.iam.cws.status(summary => {
        this.summary.Pending = summary.pending;
        this.summary.Approved = summary.approved;
        this.summary.Rejected = summary.rejected;
        this.summary.Cancelled = summary.cancelled;
      });
    });
  }
}
