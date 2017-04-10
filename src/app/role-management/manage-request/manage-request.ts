import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { Title } from "@angular/platform-browser";

@Component({
  templateUrl: 'manage-request.page.html'
})
export class ManageRequestPage implements OnInit {
  private allDomains;
  public options = [
    { label: 'Select access for this user', value: 'select', name: 'select' },
    { label: 'Reject request', value: 'reject', name: 'reject' },
    { label: 'Escalate request to a department administrator', value: 'escalate', name: 'escalate' }
  ];
  public selectedOption: 'select'|'reject'|'escalate'|undefined;
  public statusNames: any[] = [];
  public request;
  public message = '';
  public messageError = '';

  constructor(
    private route: ActivatedRoute,
    private footerAlerts: AlertFooterService,
    private titleService: Title,
    private accessService: UserAccessService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.setTitle();
    this.getAllDomains();
    this.getRequestObject();
    this.getRequestStatusNames();
  }

  setTitle() {
    this.titleService.setTitle('Manage Requests');
  }

  getRequestObject() {
    console.log(this.route);
    this.request = this.route.snapshot.data['request'];
  }

  getRequestStatusNames() {
    this.statusNames = this.route.snapshot.data['statusNames'];
  }

  getStatusNameById(statusId: number) {
    let s = this.statusNames.find(status => +status.id === statusId);

    if (s) {
      return s.status;
    }
  }

  getDomainNameById(domainId: any) {
    let dom = this.allDomains.find(d => ''+d.id === ''+domainId);
    if (dom) {
      return dom.domainName;
    }
  }

  getAllDomains() {
    this.allDomains = this.route.parent.snapshot.data['domains']._embedded.domainList;
  }

  showGenericServicesError() {
    this.footerAlerts.registerFooterAlert({
      description: 'Something went wrong with a required service',
      type: 'error'
    })
  }

  shouldShowTextarea() {
    return this.selectedOption === 'reject' || this.selectedOption === 'escalate';
  }

  validateForm() {
    return this.selectedOption && (this.selectedOption === 'select' || this.message);
  }

  onSubmitClick() {
    if (!this.validateForm()) {
      this.messageError = 'A message is required';
      return;
    }

    let newStatus: any = {
      adminMessage: '',
      status: '',
    };
    switch (this.selectedOption) {
      case 'select':
        let extras: NavigationExtras = {
          queryParams: {
            domain: this.request.domainId,
            ref: '/role-workspace'
          }
        };

        this.router.navigate(['/users', this.request.createdBy, 'grant-access'], extras);
        return;
        // break;
      case 'reject':
        newStatus = { status: 'rejected' };
        break;
      case 'escalate':
        newStatus = { status: 'escalated' };
        break;
      default:
        console.error('an option was not selected');
    }

    newStatus.adminMessage = this.message;

    this.accessService.updateRequest(this.request.id, newStatus).subscribe(() => {
      let verb;

      switch (this.selectedOption) {
        case 'reject': verb = 'rejected'; break;
        case 'escalate': verb = 'escalated'; break;
        default:
          console.error('should not modify this request');
          return;
      }

      this.footerAlerts.registerFooterAlert({
        title: 'Success',
        description: `The request was ${verb}.`,
        type: 'success',
      });
      this.router.navigate(['/role-workspace']);
    });
  }
}
