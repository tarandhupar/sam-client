import {Component, Input, OnInit} from '@angular/core';
import {FALFormService} from "../../fal-form.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-overview',
  templateUrl: 'fal-form-overview.template.html'
})

export class FALFormOverviewComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;

  falOverviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.falOverviewForm = this.fb.group({
      'objective': '',
      'description':''
    });

    this.falOverviewForm.valueChanges.subscribe(data => this.updateViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  updateViewModel(data) {
    this.viewModel.objective = data['objective'];
    this.viewModel.description = data['description'];
  }

  updateForm() {
    let objective = this.viewModel.objective;
    let description = this.viewModel.description;

    this.falOverviewForm.patchValue({
      objective: objective,
      description: description
    }, {
      emitEvent: false
    });
  }
}
