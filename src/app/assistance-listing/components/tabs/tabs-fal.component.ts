import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from "../../../../api-kit/program/program.service";
import { FALFormService } from "../../assistance-listing-operations/fal-form.service";
import { FALFormErrorService } from "../../assistance-listing-operations/fal-form-error.service";
import { FALFormViewModel } from "../../assistance-listing-operations/fal-form.model";
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import * as Cookies from 'js-cookie';

@Component({
  selector: 'tabs-fal',
  templateUrl: 'tabs-fal.template.html',
  providers: [
    ProgramService,
    FALFormErrorService,
    FALFormService
  ]
})
export class TabsFalComponent implements OnInit{
  
  /**
  * FAL Data
  */
  @Input() data: any;
  
  /**
  * Emmits event on click
  */
  @Output() tabClick: EventEmitter<any> = new EventEmitter<any>();
  
  /**
  * Modals
  */
  @ViewChild('editModal') editModal;
  @ViewChild('deleteModal') deleteModal;
  
  modalConfig = {title: 'Delete Draft AL', description: ''};
  
  currentRouteConfig: string;
  
  cookieValue: string;
  
  buttonText: any[] = [];
  toggleButton: boolean = false;
  enableDisableBtn: boolean = false;
  
  reviewErrorList = {};
  
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
  
  changeRequestDropdown: any = {
    config: {
      "hint": "Actions",
      "name": "fal-change-request",
      "disabled": false,
    },
    permissions: null,
    defaultOption: "Make a Request"
  };
  
  programRequest: any;
  
  private tabItems: any = {
    review: { label: "Auntheticated", routeConfig: "programs/:id/review"},
    edit: { label: "Edit", routeConfig: "programs/:id/edit"},
    public: { label: "Public", routeConfig: "programs/:id/view"},
  };
  
  constructor(
    private alertFooterService: AlertFooterService,
    private service: FALFormService,
    private errorService: FALFormErrorService,
    private programService: ProgramService,
    private route: ActivatedRoute, 
    private router: Router) {
  }
  
  ngOnInit(){
    this.currentRouteConfig = this.route.snapshot['_routeConfig'].path;
    
    let cookie = Cookies.get('iPlanetDirectoryPro');

    if (cookie != null) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.cookieValue = cookie;
      }
    }
    
    this.showHideButtons(this.data);
    
    if (this.cookieValue && this.data.id) {
      this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS', this.data.data.organizationId).subscribe(res => {
        this.changeRequestDropdown.permissions = res;
        if (this.changeRequestDropdown.permissions != null && (this.changeRequestDropdown.permissions.APPROVE_REJECT_AGENCY_CR == true ||
          this.changeRequestDropdown.permissions.APPROVE_REJECT_ARCHIVE_CR == true ||
          this.changeRequestDropdown.permissions.APPROVE_REJECT_NUMBER_CR == true ||
          this.changeRequestDropdown.permissions.APPROVE_REJECT_TITLE_CR == true ||
          this.changeRequestDropdown.permissions.APPROVE_REJECT_UNARCHIVE_CR == true ||
          this.changeRequestDropdown.permissions.INITIATE_CANCEL_AGENCY_CR == true ||
          this.changeRequestDropdown.permissions.INITIATE_CANCEL_ARCHIVE_CR == true ||
          this.changeRequestDropdown.permissions.INITIATE_CANCEL_NUMBER_CR == true ||
          this.changeRequestDropdown.permissions.INITIATE_CANCEL_TITLE_CR == true ||
          this.changeRequestDropdown.permissions.INITIATE_CANCEL_UNARCHIVE_CR == true)) {
          this.programService.getPendingRequest(this.cookieValue, this.data.id).subscribe(res => {
            if (res.length > 0) {
              this.programRequest = res[0];
            }
          });
        }
      });
    }
    
  }
  
  /*
   * ========================================
   *  Buttons
   * ========================================
   */
  
  showHideButtons(program: any) {
    this.errorService.viewModel = new FALFormViewModel(program);
    this.errorService.initFALErrors();
    let errorFlag = FALFormErrorService.hasErrors(this.errorService.errors);
    this.reviewErrorList = this.errorService.applicableErrors;
    if (program._links) {
      if (program._links['program:submit']) {
        this.toggleButtonTextOnPermissions('Submit', true);
        this.enableDisableButtons(errorFlag);
      } else if (program._links['program:request:reject'] || program._links['program:request:approve']) {
        if (program._links['program:request:reject'])
          this.toggleButtonTextOnPermissions('Reject', true);
        if (program._links['program:request:approve'])
          this.toggleButtonTextOnPermissions('Publish', true);
      } else if (program._links['program:notify:coordinator']) {
        this.toggleButtonTextOnPermissions('Notify Agency Coordinator', true);
        this.enableDisableButtons(errorFlag);
      }
    }
  }
  
  toggleButtonTextOnPermissions(buttonText: string, toggleFlag: boolean) {
    this.buttonText.push(buttonText);
    this.toggleButton = toggleFlag;
  }
  
  enableDisableButtons(errorFlag: boolean) {
    if (errorFlag === true) {
      this.enableDisableBtn = true;
    } else {
      this.enableDisableBtn = false;
    }
  }
  
  onButtonClick(event) {
    if (event) {
      if (event === 'Submit') {
        let url = '/programs/' + this.data.id + '/submit';
        this.router.navigateByUrl(url);
      } else if (event === 'Reject') {
        let url = '/programs/' + this.data.id + '/reject';
        this.router.navigateByUrl(url);
      } else if (event === 'Publish') {
        let url = '/programs/' + this.data.id + '/publish';
        this.router.navigateByUrl(url);
      } else if (event === 'Notify Agency Coordinator') {
        this.notifyAgencyCoordinator();
      }
    }
  }
  
  notifyAgencyCoordinator() {
    this.service.sendNotification(this.data.id)
      .subscribe(api => {
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifySuccessFooterAlertModel)));
          this.router.navigate(['/fal/workspace']);
        },
        error => {
          console.error('error sending notification', error);
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyErrorFooterAlertModel)));
        });
  }
  
  public onChangeRequestSelect(event) {
    this.router.navigateByUrl('programs/' + event.program.id + '/change-request?type=' + event.value);
  }
  
  /*
   * ========================================
   *  Modals
   * ========================================
   */
  
  public onEditClick(page: string[]) {
    if (this.data._links && this.data._links['program:update'] && this.data._links['program:update'].href) {
      let id = this.data._links['program:update'].href.match(/\/programs\/(.*)\/edit/)[1]; // extract id from hateoas edit link
      let url = '/programs/' + id + '/edit'.concat(page.toString());
      this.router.navigateByUrl(url);
    } else if (this.data._links && this.data._links['program:revise']) {
      this.editModal.openModal(page.toString());
    }
  }
  
  public onEditModalSubmit(page: any[]) {
    this.editModal.closeModal();
    this.programService.reviseProgram(this.data.id, this.cookieValue).subscribe(res => {
      let url = '/programs/' + JSON.parse(res._body).id + '/edit'.concat(page[0]);
      this.router.navigateByUrl(url);
    });
  }
  
  public onDeleteClick() {
    this.deleteModal.openModal();
    let title = this.data.data.title;
    if (title !== undefined) {
      this.modalConfig.description = 'Please confirm that you want to delete "' + title + '".';
    } else {
      this.modalConfig.description = 'Please confirm that you want to delete draft AL.';
    }
  }

  public onDeleteModalSubmit() {
    this.deleteModal.closeModal();
    this.programService.deleteProgram(this.data.id, this.cookieValue).subscribe(res => {
      this.router.navigate(['/fal/workspace']);
    }, err => {
      // todo: show error message when failing to delete
      console.log('Error deleting program ', err);
    });
  }

  /*
   * ========================================
   *  Tabs permissions
   * ========================================
   */
   
  public canEdit() {
    // show edit button if user has update permission, except on published FALs, or if user has revise permission
    if (this.data._links && this.data._links['program:update'] && this.data.status && this.data.status.code !== 'published') {
      return true;
    } else if (this.data._links && this.data._links['program:revise']) {
      return true;
    }
    return false;
  }
  
  public canReview() {
    // show edit button if user is logged in and has access.
    if (this.cookieValue && (this.data.id && this.data._links['program:access'])) {
      return true;
    }
    return false;
  }
  
  public canDelete() {
    return this.data.status && this.data.status.code === 'draft' && this.data._links && this.data._links['program:delete'];
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