import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormService } from "../../framework/service/opportunity-form.service";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form.model";
import { OpportunityService } from "../../../../../api-kit/opportunity/opportunity.service";

@Component({
  providers: [OpportunityFormService, OpportunityService],
  selector: 'opp-form-description',
  templateUrl: 'description.template.html'
})

export class OpportunityDescriptionComponent implements OnInit {

  @Input() viewModel: OpportunityFormViewModel;
  oppDescForm: FormGroup;

  constructor(private fb: FormBuilder, private service: OpportunityFormService, private oppService: OpportunityService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.oppDescForm.valueChanges.subscribe(data => {
        this.updateViewModel(data)
      }
    );
  }

  createForm(){
    this.oppDescForm = this.fb.group({
      description: ''
    });
  }

  updateForm(){
    this.oppDescForm.patchValue({
      description: this.viewModel.description
    }, {
      emitEvent: false
    });
  }
  updateViewModel(data) {
    this.viewModel.description = data['description'];
  }
}
