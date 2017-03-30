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
  domainName = '';
  domains;
  domainOptions;
  objectName;
  objectId;
  requestObject;

  selectedPermissions = [];
  permissionOptions = [];
  originalPermissions = [];
  permission;

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
      this.objectId = +objectId;
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
        console.log(this.domains);
        let d = this.domains.find(dom => {
          return +dom.domain.id === domainId;
        });
        this.domainName = d.domain.domainName;
        this.onDomainChange();
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

    if (this.mode === 'new' && !this.selectedDomain && this.domainOptions.length) {
      this.selectedDomain = this.domainOptions[0].value;
      this.onDomainChange();
    }
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

  removePermission(i) {
    this.selectedPermissions.splice(i, 1);
  }

  onDomainChange() {
    this.accessService.getRoleObjDefinitions(null, ''+this.selectedDomain).subscribe(
      res => {
        if (this.mode === 'edit') {
          if (!res || !res[0]) {
            return;
          }
          let func = res[0].functionMapContent.find(fun => +fun.function.id === +this.objectId);
          this.selectedPermissions = func.permission;
        }
      }
    );
  }

  onAddPermissionClick(newValue: any) {
    console.log(this, arguments);
    let v = typeof newValue === 'string' ? newValue : newValue.inputValue;

    if (this.selectedPermissions.findIndex(sp => sp.val === v) !== -1) {
      // No duplicates
      console.warn('duplicate permission');
      return;
    }

    // User has selected a value from the drop down
    if (typeof newValue === 'string') {
      this.selectedPermissions.push({
        val: v,
      });
    // User has input a new value
    } else {
      this.selectedPermissions.push({
        val: v,
        isNew: true,
      })
    }

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
