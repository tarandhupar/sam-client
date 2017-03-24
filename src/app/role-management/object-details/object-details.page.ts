import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";

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

  permissionOptions = [
    'Unarchive',
    'Create',
    'Edit',
    'Submit'
  ];

  permissionSetter;

  onAutocompleteSelect(evt) {
    // let val = evt.target.value;
    // console.log(val);
    let val = this.permissionComponent.inputValue;
    this.permissionSetter = val;
  }

  constructor(private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.determineMode();
    this.getAllDomains();
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

  onDomainsChange() {

  }

  onAddPermissionClick() {

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
