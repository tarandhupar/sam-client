import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormService } from "../../framework/service/opportunity-form/opportunity-form.service";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import { OpportunityService } from "../../../../../api-kit/opportunity/opportunity.service";
import { v4 as UUID } from 'uuid';

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
      description: null
    });
  }

  updateForm(){
    let description = null;
    if(this.viewModel.description && this.viewModel.description.length > 0) {
      for (let item of this.viewModel.description) {
        description = item.body;
      }
    }
    this.oppDescForm.patchValue({
      description: description
    }, {
      emitEvent: false
    });
  }

  updateViewModel(data) {
    let desc = [];
    if(data['description'])  {
      desc.push({
        "body": data['description']
      })
    }
    this.viewModel.description = desc.length > 0 ? desc : null;
  }
}
