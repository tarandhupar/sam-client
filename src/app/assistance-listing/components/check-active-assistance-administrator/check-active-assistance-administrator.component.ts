import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {FALIAMDomain, FALIAMUserRoles} from '../../assistance-listing-operations/fal-form.constants';
import {UserAccessService} from '../../../../api-kit/access/access.service';
import {AlertFooterService} from '../../../app-components/alert-footer/alert-footer.service';

@Component({
  selector: 'check-active-assistance-administrator',
  providers: [],
  templateUrl: 'check-active-assistance-administrator.template.html',
})
export class CheckActiveAssistanceAdministratorComponent implements OnInit, OnChanges {

  @Input() organization: OrganizationModel;
  showAlert: boolean = false;

  constructor(
    private userAccessService: UserAccessService,
    private alertFooterService: AlertFooterService
  ) {
  }

  private init() {
    if (this.organization && this.organization.fullParentPath != null) {
      let orgs: any[] = this.organization.fullParentPath.split('.');
      let params = {
        domain: FALIAMDomain,
        roles: FALIAMUserRoles.ASSISTANCE_ADMINISTRATOR,
        orgKey: orgs.join(','),
      };

      this.userAccessService.findUsers(params).subscribe(
        users => {
          if (!users || !users.length) {
            this.showAlert = true;
          } else if (users && users.length > 0) {
            this.showAlert = false;
          }
        },
        err => {
          this.alertFooterService.registerFooterAlert({
            title: "",
            description: "There was an error while searching for an active assistance administrator.",
            type: 'error',
            timer: 3200
          });
        });
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes?: any) {
    this.init();
  }
}

interface OrganizationModel {
  fullParentPath: string
}