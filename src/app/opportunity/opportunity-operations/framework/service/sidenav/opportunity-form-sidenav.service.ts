import { Injectable } from '@angular/core';
import { MenuItem } from 'sam-ui-elements/src/ui-kit/components/sidenav';
import { OpportunitySectionNames } from '../../data-model/opportunity-form-constants';

@Injectable()

export class OpportunitySideNavService {

  private pristineIconClass = '';

  private sections: string[] = [
    OpportunitySectionNames.HEADER_INFORMATION,
    OpportunitySectionNames.AWARD_DETAILS,
    OpportunitySectionNames.GENERAL_INFORMATION,
    OpportunitySectionNames.CLASSIFICATION,
    OpportunitySectionNames.DESCRIPTION,
    OpportunitySectionNames.CONTACT_INFORMATION,
  ];

  private sectionLabels: any = [
    'Header Information',
    'Award Details',
    'General Information',
    'Classification',
    'Description',
    'Contact Information',
  ];

  private sidenavModel: MenuItem = {
    label: "Contract Opportunity", // not used anywhere
    children: [{
      label: this.sectionLabels[0],
      route: "#" + this.sections[0],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[1],
      route: "#" + this.sections[1],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[2],
      route: "#" + this.sections[2],
      iconClass: this.pristineIconClass
    }, {
      label: this.sectionLabels[3],
      route: "#" + this.sections[3],
      iconClass: this.pristineIconClass,
    },{
      label: this.sectionLabels[4],
      route: "#" + this.sections[4],
      iconClass: this.pristineIconClass
    },{
      label: this.sectionLabels[5],
      route: "#" + this.sections[5],
      iconClass: this.pristineIconClass
    }]
  };

  constructor(){}

  getSections() {
    return this.sections;
  }

  getSectionLabel(index) {
    return this.sectionLabels[index];
  }

  getSectionIndex(fragment) {
    return this.sections.indexOf(fragment);
  }

  getFragment(index) {
    return this.sections[index];
  }

  getSideNavModel() {
    return this.sidenavModel;
  }
}
