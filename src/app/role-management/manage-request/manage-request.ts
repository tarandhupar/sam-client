import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { Title } from "@angular/platform-browser";


@Component({
  templateUrl: 'manage-request.page.html'
})
export class ManageRequestPage implements OnInit {
  private domains;
  public options = [
    { label: 'Select access for this user', value: 'select', name: 'select' },
    { label: 'Reject request', value: 'reject', name: 'reject' },
    { label: 'Escalate request to a department administrator', value: 'escalate', name: 'escalate' }
  ];
  public selectedOption: 'select'|'reject'|'escalate'|undefined;
  public request;

  constructor(
    private route: ActivatedRoute,
    private footerAlerts: AlertFooterService,
    private titleService: Title,
  ) {

  }

  ngOnInit() {
    this.setTitle();
    this.getAllDomains();
    this.getRequestObject();
  }

  setTitle() {
    this.titleService.setTitle('Manage Requests');
  }

  getRequestObject() {
    this.request = this.route.snapshot.data['request'];
  }

  getAllDomains() {
    this.domains = this.route.parent.snapshot.data['domains']._embedded.domainList;
  }

  showGenericServicesError() {
    this.footerAlerts.registerFooterAlert({
      description: 'Something went wrong with a required service',
      type: 'error'
    })
  }

  onSubmitClick() {

  }
}
