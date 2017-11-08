import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SamAutocompleteComponent } from "sam-ui-elements/src/ui-kit/form-controls/autocomplete";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import * as _ from 'lodash';
import { Title } from "@angular/platform-browser";

@Component({
  templateUrl: 'object-details.page.html'
})
export class ObjectDetailsPage implements OnInit {
  @ViewChild('permission') permissionComponent: SamAutocompleteComponent;

  crumbs = [
    { url: '/workspace', breadcrumb: 'Workspace'},
    { url: '/role-management/workspace', breadcrumb: 'Definitions'},
    { breadcrumb: ''}
  ];

  mode: 'edit'|'new' = 'new';
  selectedDomains = [];
  selectedDomain;
  domainName = '';
  domains;
  domainOptions;
  objectName;
  originalObjectName;
  objectId;
  requestObject;

  selectedPermissions = [];
  permissionOptions = [];
  originalPermissions = [];
  permission = null;

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
    this.crumbs[2].breadcrumb = this.mode === 'new' ? 'New Object' : 'Edit Object';
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
          timer: 3200,
        });
        return;
      }
      let objectId = params['objectId'];
      this.objectId = +objectId;
      this.accessService.getFunctionById(+objectId).subscribe(obj => {
        this.objectName = obj.functionName;
        this.originalObjectName = _.clone(this.objectName);
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
        let d = this.domains.find(dom => {
          return +dom.id === domainId;
        });
        if (!d) {
          this.footerAlerts.registerFooterAlert({
            title: 'Domain '+domainId+' not found.',
            type: 'error',
          });
          return;
        }
        this.domainName = d.domainName;
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
    this.accessService.getDomains().subscribe(res => {
      this.domains = res._embedded.domainList;
      this.domainOptions = this.domains.map(d => ({label: d.domainName, name: d.domainName, value: d.id}));

      if (this.mode === 'new' && !this.selectedDomain && this.domainOptions.length) {
        this.selectedDomain = this.domainOptions[0].value;
        this.onDomainChange();
      }
    });
  }

  getAllPermissions() {
    this.accessService.getPermissions().subscribe(
      res => {
        this.originalPermissions = res._embedded.permissionList;
        this.permissionOptions = this.originalPermissions.map(p => {
          return { id: ''+p.id, permissionName: p.permissionName };
        });
      },
      error => {
        // do nothing, but the user cannot select existing permissions
      }
    );
  }

  showGenericServicesError() {
    this.footerAlerts.registerFooterAlert({
      description: 'Something went wrong with a required service',
      type: 'error',
      timer: 3200,
    })
  }

  removePermission(i) {
    this.selectedPermissions.splice(i, 1);
  }

  onDomainChange() {
    this.accessService.getDomainDefinition('object', ''+this.selectedDomain).subscribe(
      res => {
        if (this.mode === 'edit') {
          if (!res || !res[0]) {
            return;
          }
          let func = res[0].functionMapContent.find(fun => +fun.function.id === +this.objectId);
          this.selectedPermissions = func.permission.map(p => {
            return { val: p.val };
          });
        }
      },
      err => {
        this.showGenericServicesError();
      }
    );
  }

  pushSelected(v) {
    this.selectedPermissions.push(v);
  }

  onAddPermissionClick(newValue: any) {
    console.log(newValue);
    if (!newValue) {
      return;
    }

    // was the value typed or selected from the list
    let wasTyped: boolean = typeof newValue === 'string';
    let asString: any = wasTyped ? newValue : newValue.permissionName; // object

    if (!asString || !asString.length || !asString.trim().length) {
      return;
    }

    if (this.selectedPermissions.findIndex(sp => sp.val === asString) !== -1) {
      // No duplicates
      console.warn('duplicate permission');
      return;
    }

    if (!wasTyped) {
      // newValue is a id/value pair
      this.pushSelected({
        val: asString,
        id: newValue.id,
      });
    // User has input a new value
    } else {
      console.log(this.permissionOptions);
      let i = this.permissionOptions.find((opt: any) => {
        return opt.permissionName.toLowerCase() === asString.toLowerCase();
      });
      if (i) {
        this.pushSelected({
          val: i.permissionName,
          id: i.id,
        })
      } else {
        this.pushSelected({
          val: asString,
          isNew: true,
        });
      }
    }
  }

  onSubmitClick() {
    let perms = this.getPermissionsArray();
    let name = this.objectName;
    if (this.mode === 'edit' && name === this.originalObjectName) {
      name = undefined;
    }
    this.accessService.createObject(+this.selectedDomain, name, perms, this.objectId).delay(1000).subscribe(
      res => {
        this.footerAlerts.registerFooterAlert({
          title: 'Successfully created object',
          type: 'success',
          timer: 3200,
        });
        this.router.navigate(['/role-management/workspace']);
      },
      err => {
        this.showGenericServicesError();
      }
    );
  }

  getPermissionsArray() {
    return this.selectedPermissions.map(perm => {
      if (perm.isNew) {
        return {
          val: perm.val
        }
      } else {
        let o = this.originalPermissions.find(op => op.permissionName.toUpperCase() === perm.val.toUpperCase() );
        if (!o) {
          console.error('could not find', perm, 'in', this.originalPermissions);
        }
        return { id: o.id };
      }
    });
  }


}
