import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CBAFormViewModel} from "../../framework/data-model/form/cba-form.model";

@Component({
  selector: 'cba-form-dates',
  templateUrl: 'dates.template.html'
})

export class CBADatesComponent implements OnInit {
  @Input() viewModel: CBAFormViewModel;
  datesForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.datesForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
      }
    );
  }

  createForm() {
    this.datesForm = this.fb.group({
      effectiveDateRange: {
        startDate: null,
        endDate: null,
      },
      amendedFrom: null,
      solicitationNumber: null
    });
  }

  updateForm() {
    this.datesForm.patchValue({
      effectiveDateRange: {
        startDate: this.viewModel.effectiveStartDate ? this.viewModel.effectiveStartDate : '',
        endDate: this.viewModel.effectiveEndDate ? this.viewModel.effectiveEndDate : '',
      },
      amendedFrom: this.viewModel.amendmentDate ? this.viewModel.amendmentDate : '',
      solicitationNumber: this.viewModel.solicitationContractNo ? this.viewModel.solicitationContractNo : ''
    }, {
      emitEvent: false
    });
  }

  updateViewModel(data) {
    this.viewModel.effectiveStartDate = data['effectiveDateRange']['startDate'];
    this.viewModel.effectiveEndDate = data['effectiveDateRange']['endDate'];
    this.viewModel.amendmentDate = data['amendedFrom'];
    this.viewModel.solicitationContractNo = data['solicitationNumber'];
  }
}
