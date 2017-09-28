import {Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityService } from "../../../../api-kit/opportunity/opportunity.service";
import { OpportunityFormService } from "../../opportunity-operations/framework/service/opportunity-form.service";
import { OpportunityFormViewModel } from "../../opportunity-operations/framework/data-model/opportunity-form.model";
import { AlertFooterService } from "../../../app-components/alert-footer/alert-footer.service";
import * as Cookies from 'js-cookie';

@Component({
  selector: 'tabs-opp',
  templateUrl: 'tabs-opportunity.template.html',
  providers: [
    OpportunityService,
    OpportunityFormService
  ]
})
export class TabsOpportunityComponent implements OnInit {

  /**
   * Opportunity Data
   */
  @Input() data: any;

  /**
   * Emmits event on click
   */
  @Output() tabClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Modals
   */
  @ViewChild('deleteModal') deleteModal;

  modalConfig = {title: 'Delete Draft Opportunity', description: ''};

  currentRouteConfig: string;

  cookieValue: string;

  buttonText: any[] = [];
  toggleButtonOnAccess: boolean = false;
  toggleButtonOnErrors: boolean = false;

  notifySuccessFooterAlertModel = {
    title: "Success",
    description: "Successfully sent notification.",
    type: "success",
    timer: 3000
  };

  notifyErrorFooterAlertModel = {
    title: "Error",
    description: "Error sending notification.",
    type: "error",
    timer: 3000
  };

  private tabItems: any = {
    review: { label: "Authenticated", routeConfig: "opportunities/:id/review"},
    edit: { label: "Edit", routeConfig: "opportunities/:id/edit"},
    public: { label: "Public", routeConfig: "opportunities/:id"},
  };

  constructor(
    private alertFooterService: AlertFooterService,
    private service: OpportunityFormService,
    private oppService: OpportunityService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(){
    this.currentRouteConfig = this.route.snapshot['_routeConfig'].path;
  }

  onButtonClick(event) {
    this.tabClick.emit({
      label: event
    });
  }

  public onEditClick(page: string[]) {
    console.log("page", page, this.data);
    //let url = '/programs/' + id + '/edit'.concat(page.toString());
    //this.router.navigateByUrl(url);
  }

  /*
   * ========================================
   *  Modals
   * ========================================
   */

  public onDeleteClick() {
    this.deleteModal.openModal();
    let title = this.data.title;
    if (title !== undefined && title !== '') {
      this.modalConfig.description = 'Please confirm that you want to delete "' + title + '".';
    } else {
      this.modalConfig.description = 'Please confirm that you want to delete draft Opportunity.';
    }
  }

  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.oppService.deleteContractopportunity(this.data.id).subscribe(res => {
      this.router.navigate(['/opportunity/workspace']);
    }, err => {
      // todo: show error message when failing to delete
      console.log('Error deleting opportunity ', err);
    });
  }

  /*
   * ========================================
   *  Tabs permissions
   * ========================================
   */

  public canEdit() {
    // show edit button if user has update permission, except on published FALs, or if user has revise permission
    //TODO Implement permission check
    if (this.data.status && this.data.status.code !== 'published') {
      return true;
    }

    return false;
  }

  public canReview() {
    //TODO Implement permission check
    // show edit button if user is logged in and has access.
    if (this.data.id) {
      return true;
    }
    return false;
  }

  public canDelete() {
    //TODO Implement permission check
    return this.data.status && this.data.status.code === 'draft';
  }

  /*
   * ========================================
   *  Emmit events
   * ========================================
   */
  tabClicked(tab){
    if ((this.currentRouteConfig != tab.routeConfig) && this.data.id) {
      this.tabClick.emit({
        label:tab.label,
        routeConfig: tab.routeConfig
      });
    }
  }

}
