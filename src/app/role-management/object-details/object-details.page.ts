import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";

@Component({
  templateUrl: 'object-details.page.html'
})
export class ObjectDetailsPage implements OnInit {
  @ViewChild('permission') permissionComponent: SamAutocompleteComponent;

  mode: 'edit'|'new' = 'new';
  selectedDomains = [];
  domains;
  domainOptions;
  objectName;
  requestObject;

  selectedPermissions = [];
  permissionOptions = [];

  permissionSetter;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accessService: UserAccessService,
    private footerAlerts: AlertFooterService,
  ) {

  }

  ngOnInit() {
    this.determineMode();
    this.getAllDomains();
    this.getAllPermissions();
    if (this.mode === 'edit') {
      this.parseUrlForDomains();
      this.getObjectName();
    }
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
        if (!params['domains'] || !params['domains'].length) {
          this.footerAlerts.registerFooterAlert({
            title: 'Domains parameter missing',
            type: 'error',
          });
          return;
        }
        this.selectedDomains = params['domains'].split(',').map(dom => {
          return +dom;
        });
        this.domainOptions.forEach(opt => {
          if (this.selectedDomains.indexOf(+opt.value) !== -1) {
            opt.disabled = true;
          }
        })
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

  onDomainsChange() {

  }

  onAddPermissionClick() {
    let val = this.permissionComponent.inputValue;
    this.permissionSetter = val;
  }

  onSubmitClick() {
    this.requestObject = this.getRequestObject();
  }

  getRequestObject() {
    return {
      domains: this.selectedDomains,
      objectName: this.objectName,
      permissions: this.selectedPermissions
    };
  }
}
