import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CBAFormViewModel} from "../../framework/data-model/form/cba-form.model";

@Component({
  selector: 'cba-form-contractor',
  templateUrl: 'contractor-info.template.html'
})

export class CBAContractorInfoComponent implements OnInit {
  @Input() viewModel: CBAFormViewModel;
  contractorInfoForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.contractorInfoForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
      }
    );
  }

  createForm() {
    this.contractorInfoForm = this.fb.group({
      name: '',
      union: '',
      number: ''
    });
  }

  updateForm() {
    this.contractorInfoForm.patchValue({
      name: this.viewModel.contractorName ? this.viewModel.contractorName : '',
      union: this.viewModel.contractorUnion ? this.viewModel.contractorUnion : '',
      number: this.viewModel.localUnionNumber ? this.viewModel.localUnionNumber : ''
    }, {
      emitEvent: false
    });
  }

  updateViewModel(data) {
    this.viewModel.contractorName = data['name'];
    this.viewModel.contractorUnion = data['union'];
    this.viewModel.localUnionNumber = data['number'];
  }
}
