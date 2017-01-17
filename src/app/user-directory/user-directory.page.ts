import { Component } from '@angular/core';
import { FHService } from "api-kit";

@Component({
  templateUrl: 'user-directory.template.html'
})
export class UserDirectoryPage {
  private orgId: number = 100000028;
  private orgNames: string[];
  private orgTypes: string[];
  private loadState: string = 'closed'; // success, info, init, loading or error

  constructor(private fh: FHService) {

  }

  toggleButtonClass() {
    return this.loadState === 'closed' ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'
  }

  isToggleButtonDisabled() {
    return this.loadState === 'loading';
  }

  onToggleHierarchyClick() {
    if (this.loadState !== 'closed') {
      this.loadState = 'closed';
    } else {
      this.loadState = 'loading';
      this.fh.getOrganizationById('' + this.orgId, false).subscribe(
        org => {
          this.loadState = 'success';
        },
        error => {
          this.loadState = 'error';
        },
        () => {

        }
      );
    }
  }


}
