import {Injectable} from '@angular/core';
import {MenuItem} from 'sam-ui-elements/src/ui-kit/components/sidenav';
import {CBASectionNames} from "../../data-model/cba-form-constants";

@Injectable()

export class CBASideNavService {
  private pristineIconClass = 'pending';

  private sections: string[] = [
    CBASectionNames.CBA
  ];

  private sectionLabels: any = [
    'CBA'
  ];

  private sidenavModel: MenuItem = {
    label: "Collective Bargaining Agreement",
    children: [{
      label: this.sectionLabels[0],
      route: "",
      iconClass: this.pristineIconClass
    }]
  };

  constructor() {
  }

  getSectionLabel(index) {
    return this.sectionLabels[index];
  }

  getSectionIndex(fragment) {
    return this.sections.indexOf(fragment);
  }

  getSideNavModel() {
    return this.sidenavModel;
  }

  disableSideNavItem(fragment) {
    let index = this.getSectionIndex(fragment);
    this.sidenavModel.children[index].disabled = true;
  }

  enableSideNavItem(fragment) {
    let index = this.getSectionIndex(fragment);
    this.sidenavModel.children[index].disabled = false;
  }

  refreshSideNav() {
    for (let section of this.sidenavModel.children) {
      section.iconClass = "pending";
    }
  }
}
