import { Component } from '@angular/core';
import { IAMService } from 'api-kit';

@Component({
  selector: 'system-widget',
  templateUrl: './system-widget.component.html'
})
export class SystemWidgetComponent {
  private accounts = [];

  constructor(private api: IAMService) {}

  ngOnInit() {
    this.api.iam.system.account.get(accounts => {
      this.accounts = accounts.filter((account, intAccount) => (intAccount < 3));
    });
  }
}
