import {Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OpportunityService} from "../../../../api-kit/opportunity/opportunity.service";
import {OpportunityFormService} from "../../opportunity-operations/framework/service/opportunity-form/opportunity-form.service";

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

  private tabItems: any = {
    review: {label: "Authenticated", routeConfig: "opp/:id/review"},
    edit: {label: "Edit", routeConfig: "opp/:id/edit"},
    public: {label: "Public", routeConfig: "opportunities/:id"},
  };

  constructor(
    private oppService: OpportunityFormService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.currentRouteConfig = this.route.snapshot['_routeConfig'].path;
  }

  onButtonClick(event) {
    this.tabClick.emit({
      label: event
    });
  }

  public onEditClick(page: string[]) {
    let id = this.data.id;
    let url = '/opp/' + id + '/edit'.concat(page.toString());
    this.router.navigateByUrl(url);
  }

  public onReviewClick() {
    let id = this.data.id;
    let url = '/opp/' + id + '/review';
    this.router.navigateByUrl(url);
  }

  /*
   * ========================================
   *  Modals
   * ========================================
   */

  public onDeleteClick() {
    this.deleteModal.openModal();
    let title = this.data.data.title;
    if (title !== undefined && title !== '') {
      this.modalConfig.description = 'Please confirm that you want to delete "' + title + '".';
    } else {
      this.modalConfig.description = 'Please confirm that you want to delete draft Opportunity.';
    }
  }

  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.oppService.deleteContractOpportunity(this.data.id).subscribe(res => {
      this.router.navigate(['/opp/workspace']);
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
    if (this.data != null && this.data._links != null && this.data._links['opportunity:edit'] != null && this.data.status && this.data.status.code == 'draft') {
      return true;
    }
    return false;
  }

  public canReview() {
    // show edit button if user is logged in and has access.
    if (this.data != null && this.data._links != null && this.data._links['opportunity:access'] != null && this.data.status && this.data.status.code == 'draft') {
      return true;
    }
    return false;
  }

  public canDelete() {
    if (this.data != null && this.data._links != null && this.data._links['opportunity:delete'] != null && this.data.status && this.data.status.code == 'draft') {
      return true;
    }
    return false;
  }

  /*
   * ========================================
   *  Emmit events
   * ========================================
   */
  tabClicked(tab) {
    if ((this.currentRouteConfig != tab.routeConfig) && this.data.id) {
      this.tabClick.emit({
        label: tab.label,
        routeConfig: tab.routeConfig
      });
    }
  }

}
