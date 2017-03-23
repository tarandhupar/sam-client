import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: 'object-details.page.html'
})
export class ObjectDetailsPage implements OnInit {
  mode: 'edit'|'new' = 'new';
  selectedDomains = [];
  domains;
  domainOptions;
  objectName;
  requestObject;

  selectedPermissions = [1, 2];

  permissionOptions = [
    {
      label:'Unarchive',
      value: 1,
      name: 'apple'
    },
    {
      label:'Create',
      value: 2,
      name: 'orange'
    },
    {
      label:'Edit',
      value: 3,
      name: 'banana'
    },
    {
      label:'Submit',
      value: 4,
      name: 'grape'
    },
    {
      label:'tomato',
      value: 5,
      name: 'tomato'
    }
  ];

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
