import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import * as _ from 'lodash';
import { Title } from "@angular/platform-browser";


@Component({
  templateUrl: 'object-details.page.html'
})
export class ObjectDetailsPage implements OnInit {
  @ViewChild('permission') permissionComponent: SamAutocompleteComponent;

  mode: 'edit'|'new' = 'new';
  selectedDomains = [];
  selectedDomain;
  domains;
  domainOptions;
  objectName;
  requestObject;

  selectedPermissions = [];
  permissionOptions = [];
  originalPermissions = [];

  permissionSetter;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accessService: UserAccessService,
    private footerAlerts: AlertFooterService,
    private titleService: Title,
  ) {

  }

  ngOnInit() {
    this.determineMode();
    this.setTitle();
    this.getAllDomains();
    this.getAllPermissions();
    if (this.mode === 'edit') {
      this.parseUrlForDomains();
      this.getObjectName();
    }
  }

  setTitle() {
    this.titleService.setTitle(this.mode === 'edit' ? 'Edit Object' : 'Create New Object');
  }


  getObjectName() {
    this.route.params.subscribe(params => {
      if (!params['objectId'] || !params['objectId'].length) {
        this.footerAlerts.registerFooterAlert({
          title: 'Object ID parameter missing',
          type: 'error',
        });
        return;
      }
      let objectId = params['objectId'];
      this.accessService.getFunctionById(+objectId).subscribe(obj => {
        this.objectName = obj.functionName;
      });
    });
  }

  parseUrlForDomains() {
    this.route.queryParams.subscribe(
      params => {
        let domainId = params['domain'];
        if (!domainId || !domainId.length) {
          this.footerAlerts.registerFooterAlert({
            title: 'Domain parameter missing',
            type: 'error',
          });
        }
        domainId = +domainId;
        this.selectedDomain = domainId;
        this.onDomainChange();

        // if (!params['domains'] || !params['domains'].length) {
        //   this.footerAlerts.registerFooterAlert({
        //     title: 'Domains parameter missing',
        //     type: 'error',
        //   });
        //   return;
        // }
        // this.selectedDomains = params['domains'].split(',').map(dom => {
        //   return +dom;
        // });
        // this.domainOptions.forEach(opt => {
        //   if (this.selectedDomains.indexOf(+opt.value) !== -1) {
        //     opt.disabled = true;
        //   }
        // })
      }
    );
  }

  determineMode() {
    let match = this.router.url.match('edit');
    if(match && match.length) {
      this.mode = 'edit';
    }
  }

  getAllDomains() {
    this.domains = this.route.parent.snapshot.data['domains']._embedded.domainList;
    this.domainOptions = this.domains.map(d => {
      return {
        label: d.domainName,
        value: d.id,
      };
    });
  }

  getAllPermissions() {
    this.accessService.getPermissions().subscribe(
      res => {
        this.permissionOptions = res._embedded.permissionList.map(perm => {
          return perm.permissionName;
        })
      },
      error => {
        // do nothing, but the user cannot select existing permissions
      }
    );
  }

  showGenericServicesError() {
    this.footerAlerts.registerFooterAlert({
      description: 'Something went wrong with a required service',
      type: 'error'
    })
  }

  onDomainChange() {
    let domainId = +this.selectedDomain;
    this.accessService.getRoleObjDefinitions('object', ''+domainId).subscribe(
      domains => {
        console.log('ddd', domains);
        if (domains[0] && domains[0].functionMapContent && domains[0].functionMapContent.length) {
          let permissions = domains[0].functionMapContent.map(f => f.function.val);
          this.originalPermissions = _.clone(domains[0].functionMapContent);
          this.selectedPermissions = permissions;
        } else {
          this.selectedPermissions = [];
        }
      }
    )
  }

  onAddPermissionClick() {
    let val = this.permissionComponent.inputValue;
    this.permissionSetter = val;
  }

  onSubmitClick() {
    let perms = this.getPermissionsArray();
    this.accessService.createObject(+this.selectedDomain, this.objectName, perms).delay(1000).subscribe(
      res => {
        this.footerAlerts.registerFooterAlert({
          title: 'Successfully created object',
          type: 'success'
        });
        this.router.navigate(['/access/workspace']);
      },
      err => {
        this.showGenericServicesError();
      }
    );
  }

  getPermissionsArray() {
    return this.selectedPermissions.map((perm: string) => {
      let p = this.originalPermissions.find(op => op.val === perm);
      if (p) {
        return p;
      } else {
        return { val: perm };
      }
    })
  }


}
