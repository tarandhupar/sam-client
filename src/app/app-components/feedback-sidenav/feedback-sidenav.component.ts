import { Component } from '@angular/core';
import { SamMenuItemComponent } from '../menu-item';
import { MenuItem } from './interfaces';
import { SamSidenavComponent } from "sam-ui-kit/components/sidenav/sidenav";
import { SidenavService } from "sam-ui-kit/components/sidenav/services";
import { FeedbackFormService } from "../feedback-form/feedback-form.service";

/* <sam-sidenav but with a feedback button at the bottom */
@Component({
  selector: 'sam-feedback-sidenav',
  templateUrl: 'feedback-sidenav.template.html'
})
export class SamFeedbackSidenavComponent extends SamSidenavComponent {
  feedback: any;
  constructor(
    private sideNavService: SidenavService,
    private formService: FeedbackFormService)
  {
    super(sideNavService);
  }

  ngOnInit() {
    this.feedback = this.formService.componentInstance;
    super.ngOnInit();
  }
}
