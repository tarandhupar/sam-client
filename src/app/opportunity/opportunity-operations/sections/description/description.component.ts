import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";

@Component({
  selector: 'opp-form-description',
  templateUrl: 'description.template.html'
})

export class OpportunityDescriptionComponent implements OnInit {

  @Input() viewModel: OpportunityFormViewModel;
  oppDescForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
    } else {
      description = '';
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
