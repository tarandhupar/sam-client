import { Component } from '@angular/core';
import { SamMenuItemComponent } from '../menu-item';
import { MenuItem } from './interfaces';
import { SamSidenavComponent } from 'sam-ui-elements/src/ui-kit/components/sidenav/sidenav';
import { SidenavService } from 'sam-ui-elements/src/ui-kit/components/sidenav/services';

/* <sam-sidenav but with a feedback button at the bottom */
@Component({
  selector: 'sam-feedback-sidenav',
  templateUrl: 'feedback-sidenav.template.html'
})
export class SamFeedbackSidenavComponent extends SamSidenavComponent {
  constructor(private sideNavService: SidenavService) {
    super(sideNavService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
