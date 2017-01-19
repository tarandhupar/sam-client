import { Component } from '@angular/core';
import { FHService } from "api-kit";
import {Organization} from "../organization/organization.model";
import { UserDirService } from "api-kit";


@Component({
  templateUrl: 'user-directory.template.html'
})
export class UserDirectoryPage {
  private orgId: number = 100000028;
  private orgLevels = [];
  private loadState: string = 'closed'; // success, info, init, loading or error

  resultList: any = [];
  alphabetSelectorPageConfig: any = {
    currentPage:1,
    totalPages:10
  };


  constructor(private fh: FHService, private userDirService: UserDirService) {

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
        res => {
          let org = Organization.FromResponse(res);
          this.orgLevels = [];
          let names = org.ancestorOrganizationNames;
          let types = org.ancestorOrganizationTypes;
          for (let i = 0; i < org.ancestorOrganizationNames.length; i++) {
            this.orgLevels.push({name: names[i], type: types[i]});
          }
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


  updateResultList($event){
    this.resultList = $event;
  }
  onAlphabetSelectorPageChange($event){
    this.alphabetSelectorPageConfig.currentPage = $event;
  }
  OnPaginationUpdate($event){
    this.alphabetSelectorPageConfig = $event;
  }


}
