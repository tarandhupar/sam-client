import { Component, OnInit } from '@angular/core';
import { UserAccessService } from "api-kit/access/access.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { UserAccessInterface } from "api-kit/access/access.interface";
import { PropertyCollector } from "../../../app-utils/property-collector";
import { PageScrollService, PageScrollInstance, PageScrollConfig } from "ng2-page-scroll";

@Component({
  templateUrl: 'edit-domain.template.html'
})
export class EditDomainPage implements OnInit {

  public roleOptions = [];
  public domainId: number;
  public roleId: number|string;

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private footerAlert: AlertFooterService,
    public router: Router,
    private pageScrollService: PageScrollService,
  ) {
    PageScrollConfig.defaultDuration = 500;
  }

  ngOnInit() {
    this.domainId = this.route.snapshot.params['domainId'];

    this.route.queryParams.subscribe(queryParams => {
      this.roleId = queryParams["role"];
    });

    this.userService.getRoles().subscribe(
      roles => {
        this.roleOptions = roles.map(role => {
          return { value: role.id, label: role.roleName };
        });
      },
      error => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to fetch access information.",
          description:"",
          type:'error',
          timer:0
        });
      }
    );
  }

}
