import {Component, ViewChild} from '@angular/core';
import {UserService} from "../../../role-management/user.service";
import {WageDeterminationService} from "../../../../api-kit";
import {Form, FormControl} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'cba-widget',
  templateUrl: './cba-widget.template.html'
})

export class CbaWidgetComponent {
  @ViewChild('infoModal') infoModal;
  @ViewChild('errorModal') errorModal;

  permissions: boolean = false;
  isLinkActive: boolean = false;
  formControl: FormControl;
  foundMessage: string = 'A previously created draft revision for this published CBA has been found. Please click ok to navigate to this draft revision.';
  createdMessage: string = 'A draft revision for this published CBA has been created. Please click ok to navigate to this draft revision.';
  private user: any;

  constructor(private userService: UserService,
              private wageDeterminationService: WageDeterminationService,
              private router: Router) {
  }

  ngOnInit() {
    try {
      this.user = this.userService.getUser();
      this.permissions = !!this.user.isGov;
      this.formControl = new FormControl();
    } catch (e) {
      this.permissions = false;
    }
  }

  onInfoSubmit(event) {
    this.infoModal.closeModal();
    this.router.navigateByUrl('/wage-determination/cba/' + event[0] + '/edit');
  }

  onErrorSubmit() {
    this.errorModal.closeModal();
  }

  onEnterClick(event){
    if(event.keyCode == 13) {
      this.reviseCBAClick();
    }
  }

  reviseCBAClick() {
    if (this.formControl.value) {
      this.wageDeterminationService.reviseCollectiveBargaining(this.formControl.value)
        .subscribe(api => {
          if (api.status == 200) {
            this.infoModal.description = this.foundMessage;
            this.infoModal.openModal(api._body);
          }

          if (api.status == 201) {
            this.infoModal.description = this.createdMessage;
            this.infoModal.openModal(api._body);
          }
        }, api => {
          let errorMessage = '';

          if (api.status == 404) {
            errorMessage = 'CBA Number ' + this.formControl.value + ' does not exist.';
          } else if (api.status == 403) {
            errorMessage = 'This user account does not possess the necessary permissions to revision Collective Bargaining Agreements.';
          } else if (api.status == 400) {
            errorMessage = 'User account error. Please contact a system administrator to resolve the issue.';
          } else if (api.status == 500) {
            errorMessage = 'Internal server error. Please contact a system administrator if the problem persists.';
          }

          this.errorModal.description = 'Error creating revision for CBA number provided.\n' + errorMessage;
          this.errorModal.openModal();
        });
    }
  }

  toggleClass(flag) {
    this.isLinkActive = flag;
  }
}
