import { Component } from '@angular/core';
import { IAMService } from '../../../../api-kit/iam/iam.service';

@Component({
  selector: 'cba-widget',
  templateUrl: './cba-widget.template.html'
})
export class CbaWidgetComponent {

  permissions: boolean = false;
  isLinkActive: boolean = false;

  constructor(private iamService: IAMService) {}

  ngOnInit() {
    this.iamService.iam.user.get((data) => {
      this.permissions = data.gov;
    });
  }

  toggleClass(flag){
    this.isLinkActive = flag;
  }
}
