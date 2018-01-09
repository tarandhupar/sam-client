import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CBAFormViewModel} from "../../framework/data-model/form/cba-form.model";
import {NavigationExtras} from "@angular/router";
import {UserService} from "../../../../role-management/user.service";
import {UserAccessService} from "../../../../../api-kit/access/access.service";

@Component({
  selector: 'cba-form-contract',
  templateUrl: 'contract-info.template.html'
})

export class CBAContractInfoComponent implements OnInit {
  @Input() viewModel: CBAFormViewModel;
  contractInfoForm: FormGroup;
  orgRoots: string[];

  constructor(private fb: FormBuilder, private userService: UserService, private userAccessService: UserAccessService) {
  }

  ngOnInit() {
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.contractInfoForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
      }
    );
  }

  createForm() {
    this.contractInfoForm = this.fb.group({
      services: '',
      activity: ''
    });
    this.populateOrgRoots();
  }

  updateForm() {
    this.contractInfoForm.patchValue({
      services: this.viewModel.contractServices ? this.viewModel.contractServices : '',
      activity: this.viewModel.organizationId ? this.viewModel.organizationId : ''
    }, {
      emitEvent: false
    });
  }

  populateOrgRoots() {
    let user: any = this.userService.getUser();
    if (user != null && user.email != null) {
      this.orgRoots = [];

      if (user.departmentID) {
        this.orgRoots.push(user.departmentID);
      }

      if (user.agencyID) {
        this.orgRoots.push(user.agencyID);
      }

      if (user.officeID) {
        this.orgRoots.push(user.officeID);
      }
    }
  }

  updateViewModel(data) {
    this.viewModel.contractServices = data['services'];
    this.viewModel.organizationId = data['activity']['orgKey'];
  }
}
