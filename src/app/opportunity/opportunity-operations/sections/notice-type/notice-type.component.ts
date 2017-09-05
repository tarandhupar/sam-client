import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormService } from "../../opportunity-form.service";
import { OpportunityFormViewModel } from "../../opportunity-form.model";
import { OpportunityService } from "../../../../../api-kit/opportunity/opportunity.service";

@Component({
  providers: [OpportunityFormService, OpportunityService],
  selector: 'opp-form-notice-type',
  templateUrl: 'notice-type.template.html'
})

export class OppFormNoticeTypeComponent implements OnInit {

  @Input() viewModel: OpportunityFormViewModel;
  oppNoticeTypeForm: FormGroup;

  constructor(private fb: FormBuilder, private service: OpportunityFormService, private oppService: OpportunityService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  createForm(){
    this.oppNoticeTypeForm = this.fb.group({
      title: ''
    });
  }

  updateForm(){
    this.oppNoticeTypeForm.patchValue({
      title: this.viewModel.title
    }, {
      emitEvent: false
    });
  }
}
